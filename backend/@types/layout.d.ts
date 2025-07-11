import { Document } from "mongoose";

interface IFaq extends Document {
  question: string;
  answer: string;
  //   course: ICourse["_id"];
  //   user: IUser["_id"];
  //   createdAt: Date;
  //   updatedAt: Date;
}

interface ICategoryLayout extends Document {
  title: string;
}

interface IBannerImg extends Document {
  public_id: string;
  url: string;
}

export interface ILayout extends Document {
  type: string;
  faq: IFaq[];
  categories: ICategoryLayout[];
  banner: {
    img: IBannerImg;
    title: string;
    subtitle: string;
  };
}
