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
