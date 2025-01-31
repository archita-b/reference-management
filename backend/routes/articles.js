import express from "express";

import {
  createArticle,
  getArticle,
  getArticles,
} from "../controller/articles.js";

const router = express.Router();

router.get("/articles", getArticles);
router.get("/articles/:id", getArticle);
router.post("/articles", createArticle);

export default router;
