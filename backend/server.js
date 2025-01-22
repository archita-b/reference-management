import express from "express";

import articlesRouter from "./routes/articles.js";

const app = express();

const port = process.env.PORT || 5000;

app.use("/api", articlesRouter);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${5000}`);
});
