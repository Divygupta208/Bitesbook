const express = require("express");

const router = express.Router();
const socialController = require("../controllers/social");

router.post("/follow/:followedId", socialController.postFollowUser);
router.delete("/unfollow/:followedId", socialController.postUnfollowUser);
router.get("/followers/:userId", socialController.getUserFollowers);
router.get("/following/:userId", socialController.getUserFollowing);
router.get("/feed", socialController.getUserFeed);

module.exports = router;
