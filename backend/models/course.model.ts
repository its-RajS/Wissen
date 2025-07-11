import mongoose, { Model, Schema } from "mongoose";
import {
  IComments,
  ICourse,
  ICourseData,
  ILinks,
  IReview,
} from "../@types/course";

const commentSchema = new Schema<IComments>({
  user: Object,
  comment: String,
  commentReplies: [Object],
});

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
});

const linkSchema = new Schema<ILinks>({
  title: String,
  url: String,
});

const courseDataSchema = new Schema<ICourseData>({
  title: String,
  description: String,
  videoUrl: String,
  videoDuration: Number,
  videoPlayer: String,
  videoSection: String,
  links: [linkSchema],
  suggestion: String,
  comment: [commentSchema],
});

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    actualPrice: {
      type: Number,
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }],
    prerequistes: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    rating: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const courseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default courseModel;
