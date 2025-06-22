import { Document } from "mongoose";

//? Comments
interface IComments extends Document {
  user: object;
  comment: string;
  commentReplies: IComments[];
}

//? Review
interface IReview extends Document {
  user: object;
  rating: number;
  comment: string;
  commentReplies: IComments[];
}

//? Links for videos
interface ILinks extends Document {
  title: string;
  url: string;
}

//? Course data
interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoDuration: number;
  videoPlayer: string;
  videoSection: string;
  videoThumbnail: object;
  links: ILinks[];
  suggestion: string;
  question: IComments[];
}

//? Course
interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  actualPrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequistes: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  rating?: number;
  purchased?: number;
}
