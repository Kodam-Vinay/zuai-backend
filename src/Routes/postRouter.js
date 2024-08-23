const express = require("express");
const {
  uploadPost,
  getAllPosts,
  getPostDetails,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { authorizeUser } = require("../utils/constants");
const router = express.Router();

router.post("/", authorizeUser, uploadPost);
router.get("/", getAllPosts);
router.get("/:id", getPostDetails);
router.put("/:id", authorizeUser, updatePost);
router.delete("/:id", authorizeUser, deletePost);

module.exports = router;
