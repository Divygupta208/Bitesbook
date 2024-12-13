const Follow = require("../models/follow");
const Recipe = require("../models/recipe");
const User = require("../models/user");

exports.postFollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id; // Logged-in user
    const followedId = req.params.followedId; // User to be followed

    if (followerId === followedId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const followedUser = await User.findByPk(followedId);

    if (!followedUser) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    const existingFollow = await Follow.findOne({
      where: { followerId, followedId },
    });

    if (existingFollow) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    // Create the follow relationship
    await Follow.create({ followerId, followedId });

    res.status(201).json({ message: "Successfully followed the user" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to follow user", error: error.message });
  }
};

// Unfollow a user
exports.postUnfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id; // Logged-in user
    const followedId = req.params.followedId; // User to be unfollowed

    const existingFollow = await Follow.findOne({
      where: { followerId, followedId },
    });

    if (!existingFollow) {
      return res
        .status(404)
        .json({ message: "You are not following this user" });
    }

    // Remove the follow relationship
    await existingFollow.destroy();

    res.status(200).json({ message: "Successfully unfollowed the user" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to unfollow user", error: error.message });
  }
};

// Get followers of a user
exports.getUserFollowers = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByPk(userId, {
      include: {
        model: User,
        as: "Followers",
        attributes: ["id", "name", "username", "profilepicture"],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Followers fetched successfully",
      followers: user.Followers,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch followers", error: error.message });
  }
};

// Get following users of a user
exports.getUserFollowing = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByPk(userId, {
      include: {
        model: User,
        as: "Following",
        attributes: ["id", "name", "username", "profilepicture"],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Following users fetched successfully",
      following: user.Following,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch following users",
      error: error.message,
    });
  }
};

// Get the feed for the logged-in user
exports.getUserFeed = async (req, res, next) => {
  try {
    const userId = req.user.id; // Logged-in user

    // Get the list of users that the logged-in user is following
    const following = await User.findByPk(userId, {
      include: {
        model: User,
        as: "Following",
        attributes: ["id"],
      },
    });

    if (!following) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingIds = following.Following.map((user) => user.id);

    // Get the feed (e.g., recent recipes from the users the logged-in user is following)
    // Assuming a Recipe model exists and has a `userId` field to track the creator
    const feed = await Recipe.findAll({
      where: {
        userId: followingIds,
      },
      include: {
        model: User,
        as: "author",
        attributes: ["id", "name", "username"],
      },
      order: [["createdAt", "DESC"]], // Example sorting by most recent first
    });

    res.status(200).json({
      message: "Feed fetched successfully",
      feed,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch feed", error: error.message });
  }
};

exports.getUserFeed = async (req, res) => {
  const userId = req.user.id;
  try {
    const followedUsers = await Follow.findAll({
      where: { followerId: userId },
      attributes: ["followedId"],
    });

    const followingIds = followedUsers.map((follow) => follow.followingId);

    const recentRecipes = await Recipe.findAll({
      where: {
        userId: followingIds,
      },
      include: [{ model: User, attributes: ["id", "name", "profilePicture"] }],
      order: [["createdAt", "DESC"]],
      limit: 3,
    });

    res.status(200).json(recentRecipes);
  } catch (error) {
    console.error("Error fetching user feed:", error);
    res.status(500).json({ error: "Failed to fetch user feed" });
  }
};
