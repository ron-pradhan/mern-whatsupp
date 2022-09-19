const express = require("express");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeGroup,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChat);
router.route("/creategroup").post(protect, createGroupChat);
router.route("/renamegroup").put(protect, renameGroup);
router.route("/addusers").put(protect, addToGroup);
router.route("/removeusers").put(protect, removeGroup);

module.exports = router;
