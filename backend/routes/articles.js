import express from "express";

import {
  createArticle,
  fetchUrlsFromSitemap,
  getArticle,
  getArticles,
} from "../controller/articles.js";

const router = express.Router();

router.get("/articles", getArticles);
router.get("/articles/:id", getArticle);
router.post("/articles", createArticle);

router.get("/urls", fetchUrlsFromSitemap);

export default router;
