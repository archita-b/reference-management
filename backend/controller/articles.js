import { getArticlesDB } from "../model/articles.js";

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

    // const urlObj = new URL(url);

    const response = await fetch(url);

    const { title, author, content, images } = await response.json();

    const newArticle = await createArticleDB(
      url,
      title,
      author,
      content,
      images
    );

    res.status(201).json(newArticle);
  } catch (error) {
    console.log("Error in createArticle controller: ", error.message);
    next(error);
  }
}
