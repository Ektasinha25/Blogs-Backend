const db = require('../config/db');

const checkOwnership = async (req, res, next) => {
  try {
    const articleId = req.params.id;

    const [rows] = await db.query(
      'SELECT author_id FROM articles WHERE id = ?',
      [articleId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Compare article owner with logged-in user
    if (rows[0].author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not the author'
      });
    }

    next();

  } catch (error) {
    console.error("Ownership check error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = checkOwnership;