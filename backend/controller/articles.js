import {
  createArticleDB,
  getArticleDB,
  getArticlesDB,
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

    const urlParser = "https://late3-0-scraper.onrender.com/sitemap";
    const xmlResponse = await fetch(
      `${urlParser}?url=${encodeURIComponent(url)}`
    );

    if (!xmlResponse.ok) {
      return res.json({ error: "Could not fetch xml data." });
    }

    const xmls = await xmlResponse.json();
    const limitedXmls = xmls.slice(0, 500);
    let newArticleCount = 0;

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

        const batchSize = 10;
        const numOfBatches = Math.ceil(urls.length / batchSize);

        for (let i = 0; i < numOfBatches; i++) {
          const start = i * batchSize;
          const end = Math.min(start + batchSize, urls.length);

          const batch = urls.slice(start, end);
          const getMetadataAndContentForBatch = batch.map((singleUrl) =>
            createRecordForUrl(singleUrl)
          );

          const newArticles = await Promise.allSettled([
            getMetadataAndContentForBatch,
          ])
            .then((newArticles) => newArticles)
            .catch((error) => console.log(error.message));

          newArticleCount += newArticles.filter(
            (article) => article !== null
          ).length;
        }
      }
    }

    res
      .status(200)
      .json({ message: `${newArticleCount} new articles created.` });
  } catch (error) {
    console.log("Error in fetchUrlsFromSitemap controller: ", error.message);
    next(error);
  }
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
      metadata: metadataResponse?.content || null,
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
    next(error);
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
