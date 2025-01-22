import express from "express";

import { getArticles } from "../controller/articles.js";

const router = express.Router();

router.get("/articles", getArticles);

export default router;
