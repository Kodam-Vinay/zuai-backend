const express = require("express");
const multer = require("multer");

const {
  uploadPost,
  getAllPosts,
  getPostDetails,
  updatePost,
  deletePost,
  uploadImage,
} = require("../controllers/postController");
const { authorizeUser, STORAGE } = require("../utils/constants");
const router = express.Router();
const upload = multer({ storage: STORAGE });

router.post(
  "/upload-image",
  upload.single("image"),
  authorizeUser,
  uploadImage
);
router.post("/", authorizeUser, uploadPost);
router.get("/", getAllPosts);
router.get("/:id", getPostDetails);
router.put("/:id", authorizeUser, updatePost);
router.delete("/:id", authorizeUser, deletePost);

module.exports = router;
