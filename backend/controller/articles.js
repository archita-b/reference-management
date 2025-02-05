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

    const urlParser = "https://late3-0-scraper.onrender.com/sitemap/medium";

    const xmlResponse = await fetch(`${urlParser}?url=${url}`);

    const xmls = await xmlResponse.json();

    const limitedXmls = xmls.slice(0, 20);

    let urls = [];

    for (let i = 0; i < limitedXmls.length; i++) {
      if (limitedXmls[i].endsWith(".xml")) {
        const urlResponse = await fetch(`${urlParser}?url=${limitedXmls[i]}`);
        const url = await urlResponse.json();
        urls.push(...url);
      }
    }

    res.status(200).json(urls);
  } catch (error) {
    console.log("Error in fetchUrlsFromSitemap controller: ", error.message);
    next(error);
  }
}

export async function createArticle(req, res, next) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required." });
    }

    const webScraperURL = "https://late3-0-scraper.onrender.com";

    Promise.allSettled([
      fetch(`${webScraperURL}/metadata?url=${encodeURIComponent(url)}`),
      fetch(`${webScraperURL}/content?url=${encodeURIComponent(url)}`),
    ]).then(async (results) => {
      let metadataResponse, contentResponse;

      if (results[0].status === "fulfilled") {
        metadataResponse = results[0].value.json();
      }

      if (results[1].status === "fulfilled") {
        contentResponse = results[1].value.json();
      }
      const { metadata } = await metadataResponse;
      const { content } = await contentResponse;

      const newArticle = await createArticleDB(
        url,
        metadata.title,
        metadata.author || null,
        content,
        content.images || null,
        metadata.dateOfPublication || null
      );

      res.status(201).json(newArticle);
    });
  } catch (error) {
    console.log("Error in createArticle controller: ", error.message);

    next(error);
  }
}
