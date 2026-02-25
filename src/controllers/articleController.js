const db = require("../config/db");

const createArticle = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, content and category are required",
      });
    }

    const summary = content.substring(0, 150) + "...";

    const [result] = await db.query(
      `INSERT INTO articles 
       (title, content, summary, category, tags, author_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, content, summary, category, tags, req.user.id],
    );

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      articleId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllArticles = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, u.username 
       FROM articles a
       JOIN users u ON a.author_id = u.id
       ORDER BY a.created_at DESC`,
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================
// GET SINGLE ARTICLE
// ==========================
const getArticleById = async (req, res) => {
  try {
    const articleId = req.params.id;

    const [rows] = await db.query(
      `SELECT a.*, u.username, u.email
       FROM articles a
       JOIN users u ON a.author_id = u.id
       WHERE a.id = ?`,
      [articleId],
    );

    // If no article found
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE ARTICLE
const updateArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, content and category are required",
      });
    }

    const summary = content.substring(0, 150) + "...";

    const [result] = await db.query(
      `UPDATE articles 
       SET title = ?, content = ?, summary = ?, category = ?, tags = ?
       WHERE id = ?`,
      [title, content, summary, category, tags, articleId],
    );

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE ARTICLE
const deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.id;

    const [result] = await db.query("DELETE FROM articles WHERE id = ?", [
      articleId,
    ]);

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
