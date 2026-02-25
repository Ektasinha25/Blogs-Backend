const express = require("express");
const {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");

const checkOwnership = require("../middleware/checkOwnership");

const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.post("/", verifyJWT, createArticle);
router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.put("/:id", verifyJWT, checkOwnership, updateArticle);
router.delete("/:id", verifyJWT, checkOwnership, deleteArticle);

module.exports = router;
