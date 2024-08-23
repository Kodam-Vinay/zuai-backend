const PostModel = require("../db/models/postModel");
const { v4: uniqueId } = require("uuid");

const uploadPost = async (req, res) => {
  try {
    const { userDetails } = req.user;
    console.log(userDetails);
    const { title, content, image } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .send({ status: false, message: "Please fill in all fields" });
    }
    await PostModel.create({
      title,
      content,
      author: userDetails?.user_id,
      image: image ? image : "DUMMY_POST_LOGO",
      post_id: uniqueId(),
    });
    res
      .status(201)
      .send({ status: true, message: "Post created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ status: false, message: "Something Went Wrong" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { search_q = "" } = req.query;
    const posts = await PostModel.find({
      $or: [
        { title: { $regex: search_q, $options: "i" } }, //"i" is for case insensitivity,
        { content: { $regex: search_q, $options: "i" } },
      ],
    }); //search query
    res.status(200).send({
      status: true,
      message: "Posts Retrived Successful",
      data: {
        posts,
      },
    });
  } catch (error) {
    res.status(400).send({ status: false, message: "Something Went Wrong" });
  }
};

const getPostDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await PostModel.findOne({
      post_id: id,
    });
    res.status(200).send({
      status: true,
      message: "Posts Retrived Successful",
      data: {
        posts,
      },
    });
  } catch (error) {
    res.status(400).send({ status: false, message: "Something Went Wrong" });
  }
};

const updatePost = async (req, res) => {
  try {
    const requests = req.body;
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .send({ status: false, message: "Post id not found" });
    }
    const findPost = await PostModel.findOne({
      post_id: id,
    });
    if (!findPost) {
      return res.status(404).send({ status: false, message: "Post Not Found" });
    }

    //checking the post is created by perticular user(only the creator can update the post)
    const checkUserAuthorized = findPost?.author === userDetails?.user_id;
    if (!checkUserAuthorized) {
      return res
        .status(403)
        .send({ status: false, message: "You are not Allowed to update post" });
    }

    // checking request are empty
    if (Object.keys(requests)?.length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Fields Should Not Be Empty" });
    }

    //checking request properties are valid
    const result = Object.keys(requests).some((key) => {
      //if key is not exist it shows error
      return findPost[key] === undefined || findPost[key] === null;
    });
    if (result) {
      return res.status(400).send({
        status: false,
        message: "Your trying to update the property which not exist",
      });
    }
    const changesInPost = {
      ...findPost._doc,
      ...requests,
    };
    const checkAnyChangesMade =
      JSON.stringify(changesInPost) !== JSON.stringify(findPost);
    if (checkAnyChangesMade) {
      //updating post
      await PostModel.findOneAndUpdate(
        { post_id: id },
        {
          $set: changesInPost,
        },
        {
          new: true,
        }
      );
      return res
        .status(200)
        .send({ status: true, message: "Post Updated Successfully" });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "No Changes Made in the post" });
    }
  } catch (error) {
    res.status(400).send({ status: false, message: "Something Went Wrong" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { userDetails } = req.user;
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .send({ status: false, message: "Post id not found" });
    }
    const findPost = await PostModel.findOne({ post_id: id });
    if (!findPost) {
      return res.status(404).send({ status: false, message: "Post Not Found" });
    }

    //checking the post is created by perticular user(only the creator can delete the post)
    const checkUserAuthorized = findPost?.author === userDetails?.user_id;
    if (!checkUserAuthorized) {
      return res
        .status(403)
        .send({ status: false, message: "You are not Allowed to delete post" });
    }

    // deleting post from database
    await PostModel.findOneAndDelete({ post_id: id });
    res
      .status(200)
      .send({ status: true, message: "Post Deleted Successfully" });
  } catch (error) {
    res.status(400).send({ status: false, message: "Something Went Wrong" });
  }
};

module.exports = {
  uploadPost,
  getAllPosts,
  getPostDetails,
  updatePost,
  deletePost,
};
