import express from "express";

import {
  createArticle,
  fetchUrlsFromSitemap,
  getArticle,
  getArticles,
  getProcessStatus,
} from "../controller/articles.js";

const router = express.Router();

router.get("/articles", getArticles);
router.get("/articles/:id", getArticle);
router.post("/articles", createArticle);

router.get("/urls", fetchUrlsFromSitemap);
router.get("/processess/:id", getProcessStatus);

export default router;
