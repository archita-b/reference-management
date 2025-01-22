import { getArticlesDB } from "../model/articles.js";

export async function getArticles(req, res, next) {
  try {
    const { author } = req.query;

    if (!author) {
      return res.status(400).json({ error: "Invalid author name." });
    }

    const articles = await getArticlesDB(author);

    res.status(200).json(articles);
  } catch (error) {
    console.log("Error in getArticle controller: ", error.message);
    next(error);
  }
}
