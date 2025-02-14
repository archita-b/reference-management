import { v4 as uuidv4 } from "uuid";

import {
  createArticleDB,
  getArticleDB,
  getArticlesDB,
  getProcessById,
  saveProcess,
  updateProcess,
} from "../model/articles.js";

export async function getArticles(req, res, next) {
  try {
    const { author, title, startDate, endDate, offset, limit } = req.query;

    const articles = await getArticlesDB(
      author,
      title,
      startDate,
      endDate,
      offset,
      limit
    );

    res.status(200).json(articles);
  } catch (error) {
    console.log("Error in getArticle controller: ", error.message);
    next(error);
  }
}

export async function getArticle(req, res, next) {
  try {
    const { id: articleId } = req.params;
    const { path } = req.query;

    const response = await getArticleDB(articleId, path);

    if (!response) {
      return res.status(404).json({ error: "Resource not found." });
    }

    res.status(200).json(response);
  } catch (error) {
    console.log("Error in getArticleByIdAndPath controller: ", error.message);
    next(error);
  }
}

export async function fetchUrlsFromSitemap(req, res, next) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const processId = uuidv4();
    await saveProcess(processId, {
      status: "in_progress",
      total: 0,
      processed: 0,
      skipped: 0,
    });

    res.status(200).json({ processId });

    const urlParser = "https://late3-0-scraper.onrender.com/sitemap";
    const xmlResponse = await fetch(
      `${urlParser}?url=${encodeURIComponent(url)}`
    );

    if (!xmlResponse.ok) {
      await updateProcess(processId, { status: "failed" });
      return res.json({ error: "Could not fetch xml data." });
    }

    const xmls = await xmlResponse.json();
    const limitedXmls = xmls.slice(3, 4);
    // console.log("limitedXmls=", limitedXmls);

    let totalUrls = 0;
    let processedUrls = 0;
    let skippedUrls = 0;

    for (const element of limitedXmls) {
      if (element.endsWith(".xml")) {
        const urlResponse = await fetch(
          `${urlParser}?url=${encodeURIComponent(element)}`
        );

        if (!urlResponse.ok) {
          console.log(`Skipping ${element} (could not fetch sitemap)`);
          continue;
        }

        const urls = await urlResponse.json();
        totalUrls += urls.length;
        // console.log("totalUrls=", totalUrls);
        // const limitedUrls = urls.slice(0, 10);

        const count = await processUrls(urls, 10, (processed, skipped) => {
          processedUrls += processed;
          skippedUrls += skipped;
          // console.log(
          //   "processedUrls=",
          //   processedUrls,
          //   "skippedUrls=",
          //   skippedUrls
          // );

          updateProcess(processId, {
            total: totalUrls,
            processed: processedUrls,
            skipped: skippedUrls,
          });
        });
      }
    }

    await updateProcess(processId, { status: "completed" });
  } catch (error) {
    console.log("Error in fetchUrlsFromSitemap controller: ", error.message);
    next(error);
  }
}

async function processUrls(urls, batchSize, updateStatusCallback) {
  let processed = 0;
  let skipped = 0;
  let activeRequests = 0;

  const processNextUrl = async () => {
    if (urls.length === 0) return;

    activeRequests++;
    const url = urls.shift();

    createRecordForUrl(url)
      .then((newArticle) => {
        if (newArticle) {
          processed++;
        } else {
          skipped++;
        }
        updateStatusCallback(processed, skipped);
      })
      .catch((error) => console.log(`Error processing ${url}:`, error))
      .finally(() => {
        activeRequests--;
        processNextUrl();
      });
  };

  while (activeRequests < batchSize && urls.length > 0) {
    processNextUrl();
  }
  return { processed, skipped };
}

async function getMetadataAndContentForUrl(url) {
  try {
    const webScraperURL = "https://late3-0-scraper.onrender.com";

    const responses = await Promise.allSettled([
      fetch(`${webScraperURL}/metadata?url=${encodeURIComponent(url)}`),
      fetch(`${webScraperURL}/content?url=${encodeURIComponent(url)}`),
    ]);

    const metadataResponse =
      responses[0].status === "fulfilled" && responses[0].value.ok
        ? await responses[0].value.json()
        : null;

    const contentResponse =
      responses[1].status === "fulfilled" && responses[1].value.ok
        ? await responses[1].value.json()
        : null;

    if (!metadataResponse || !contentResponse) {
      console.log(`Skipping ${url} (metadata or content request failed)`);
      return null;
    }

    return {
      metadata: metadataResponse.metadata.content || null,
      content: contentResponse,
    };
  } catch (error) {
    console.log(
      "Error in getMetadataAndContentForUrl function: ",
      error.message
    );
  }
}

async function createRecordForUrl(url) {
  try {
    const { metadata, content } = await getMetadataAndContentForUrl(url);

    if (!metadata || !content) {
      console.log(`Skipping ${url} (metadata or content request failed)`);
      return null;
    }

    const title = metadata.title || null;
    const author = metadata.author || null;

    return await createArticleDB(
      url,
      title,
      author,
      content,
      metadata.images || null,
      metadata["article:published_time"] || null
    );
  } catch (error) {
    console.log("Error in createRecordForUrl function: ", error.message);
  }
}

export async function createArticle(req, res, next) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required." });
    }

    const newArticle = await createRecordForUrl(url);

    res.status(201).json(newArticle);
  } catch (error) {
    console.log("Error in createArticle controller: ", error.message);

    next(error);
  }
}

export async function getProcessStatus(req, res, next) {
  try {
    const { id: processId } = req.params;

    const process = await getProcessById(processId);

    if (!process) {
      return res.status(404).json({ error: "Process not found." });
    }

    res.status(200).json(process);
  } catch (error) {
    console.log("Error in getProcessStatus controller: ", error.message);
    next(error);
  }
}
