import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../@types/model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//? RegEx for email pattern
const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//! User Model
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (val: string) {
          return emailPattern.test(val);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

//! Auth(Login/Signup)
//? Sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "");
};
//? Sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "");
};

//? Secure the password before saving in db with hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const genSalt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, genSalt); //?encrypt the passsword
  next();
});

//? Compare the password
userSchema.methods.comparePassword = async function (
  enteredPass: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPass, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
