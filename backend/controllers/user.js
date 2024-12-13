const bcrypt = require("bcrypt");
const User = require("../models/user");
const sequelize = require("../util/database");

const jwt = require("jsonwebtoken");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const Recipe = require("../models/recipe");
const Favorite = require("../models/favorite");
const { Sequelize } = require("sequelize");
const Review = require("../models/reviews");
const AWS = require("aws-sdk");
const FileType = require("file-type");
// const ForgotPasswordRequest = require("../models/forgot-password");

// const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
// const apiKey = SibApiV3Sdk.ApiClient.instance.authentications["api-key"];
// apiKey.apiKey = process.env.BREVO_API_KEY;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

const uploadToS3 = async (base64Data, filename) => {
  const buffer = Buffer.from(base64Data.split(",")[1], "base64");

  const fileTypeResult = await FileType.fromBuffer(buffer);

  const contentType = fileTypeResult?.mime || "application/octet-stream";

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ACL: "public-read",
    ContentType: contentType,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading to S3:", err);
        reject(err);
      } else {
        console.log("File uploaded successfully:", data.Location);
        resolve(data.Location);
      }
    });
  });
};

exports.postAddUser = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { name, username, email, phoneno, password } = req.body;

    const existingUser = await User.findOne(
      {
        where: {
          email: email,
        },
      },
      { transaction: t }
    );

    if (existingUser) {
      t.rollback();
      return res.status(403).json({
        message: "User already exists",
      });
    }

    if (!name || !username || !email || !password || !phoneno) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(
      { name, username, email, password: hashedPassword, phoneno },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({
      message: "User created successfully",
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        phoneno: user.phoneno,
      },
    });
  } catch (err) {
    await t.rollback();
    console.error("Error creating User:", err);

    res.status(500).json({
      message: "An error occurred while creating the user",
      error: err.message,
    });
    next(err);
  }
};

exports.postLoginUser = async (req, res, next) => {
  const t = await sequelize.transaction();
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne(
      { where: { email: emailOrPhone } },
      { transaction: t }
    );

    if (!user) {
      await t.rollback();
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await t.rollback();
      return res
        .status(401)
        .json({ message: "Authentication failed. Incorrect password." });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        phoneno: user.phoneno,
      },
      "b2a76f7c3e5f8d1a9c3b2e5d7f6a8c9b1e2d3f4a6b7c9e8d7f6b9c1a3e5d7f6b",
      { expiresIn: "3h" }
    );
    await t.commit();
    return res.status(200).json({
      token,
      userId: user.id,
      name: user.name,
      username: user.username,
      usermail: user.email,
      phoneno: user.phoneno,
      profilePicture: user.profilePicture || null,
      bio: user.bio || null,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error during user login:", error);
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.findAll({
      where: { userId: userId },
      attributes: ["recipeId"],
    });

    if (!favorites || favorites.length === 0) {
      return res.status(404).json({ message: "No favorites found." });
    }

    const favoriteRecipeIds = favorites.map((fav) => fav.recipeId);

    res.status(200).json({ favoriteRecipeIds });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Failed to fetch favorites." });
  }
};

// exports.postForgotPassword = async (req, res, next) => {
//   const { email } = req.body;
//   const t = await sequelize.transaction();

//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   const user = await User.findOne(
//     { where: { email: email } },
//     { transaction: t }
//   );

//   if (!user) {
//     await t.rollback();
//     return res.status(404).json({ message: "User not found" });
//   }

//   const forgotpasswordrequest = await ForgotPasswordRequest.create(
//     {
//       isActive: true,
//       userId: user.id,
//       expiresAt: new Date(Date.now() + 60 * 60 * 1000),
//     },
//     { transaction: t }
//   );

//   if (!forgotpasswordrequest) {
//     await t.rollback();
//     return res
//       .status(500)
//       .json({ message: "Error creating forgot password request" });
//   }

//   await t.commit();

//   const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
//   sendSmtpEmail.subject = "Reset Password Request";
//   sendSmtpEmail.templateId = 1;
//   sendSmtpEmail.params = {
//     link: `http://localhost:5173/resetpassword/${forgotpasswordrequest.id}`,
//   };

//   sendSmtpEmail.sender = { name: "Your App", email: "divygupta208@gmail.com" };
//   sendSmtpEmail.to = [{ email: email }];

//   try {
//     const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     console.log("Email sent successfully:", data);
//     return res
//       .status(200)
//       .json({ message: "Password reset email sent successfully" });
//   } catch (error) {
//     console.error("Error while sending email:", error);
//     return res.status(500).json({ error: "Error sending the email" });
//   }
// };

// exports.postResetPassword = async (req, res, next) => {
//   const { newPassword } = req.body;
//   const { id } = req.params;

//   try {
//     const resetRequest = await ForgotPasswordRequest.findOne({
//       where: { id: id },
//     });

//     if (!resetRequest) {
//       return res.status(404).json({ message: "Invalid reset token" });
//     }

//     if (!resetRequest.isActive) {
//       return res
//         .status(400)
//         .json({ message: "Reset token has already been used" });
//     }

//     const currentTime = new Date();
//     if (currentTime > resetRequest.expiresAt) {
//       return res.status(400).json({ message: "Reset token has expired" });
//     }

//     const user = await User.findOne({ where: { id: resetRequest.userId } });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     user.password = hashedPassword;
//     await user.save();

//     resetRequest.isActive = false;
//     await resetRequest.save();

//     return res.status(200).json({ message: "Password updated successfully" });
//   } catch (error) {
//     console.error("Error updating password:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching users.",
      error: error.message,
    });
  }
};

exports.postUpdateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { username, bio, profilePicture } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let profilePictureUrl = null;
    if (profilePicture) {
      const fileName = `profile-${Date.now()}-${userId}`;

      profilePictureUrl = await uploadToS3(profilePicture, fileName);
    }

    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profilePicture = profilePictureUrl || user.profilePicture;
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
