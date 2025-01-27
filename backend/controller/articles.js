import { createArticleDB, getArticlesDB } from "../model/articles.js";

export async function getArticles(req, res, next) {
  try {
    const { author, title } = req.query;

    const articles = await getArticlesDB(author, title);

    res.status(200).json(articles);
  } catch (error) {
    console.log("Error in getArticle controller: ", error.message);
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

    const metadataResponse = await fetch(
      `${webScraperURL}/metadata?url=${encodeURIComponent(url)}`
    );

    if (!metadataResponse.ok) {
      return res.json({
        error: "Failed to fetch metadata for web page.",
      }); // status?
    }

    const contentResponse = await fetch(
      `${webScraperURL}/content?url=${encodeURIComponent(url)}`
    );

    if (!contentResponse.ok) {
      return res.json({ error: "Failed to fetch content from web page." }); //status?
    }

    const { metadata } = await metadataResponse.json();
    const { content } = await contentResponse.json();
    // console.log(content);

    const author = metadata.author || null;

    const newArticle = await createArticleDB(
      url,
      metadata.title,
      author,
      content
    );

    res.status(201).json(newArticle);
  } catch (error) {
    console.log("Error in createArticle controller: ", error.message);

    next(error);
  }
}
