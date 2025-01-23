import express from "express";

import { createArticle, getArticles } from "../controller/articles.js";

const router = express.Router();

router.get("/articles", getArticles);
router.post("/articles", createArticle);

export default router;
