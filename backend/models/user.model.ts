import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/model.types";

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
  return await bcrypt.compare(enteredPass, this.passsword);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
