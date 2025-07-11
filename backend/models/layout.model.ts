import mongoose, { Model, Schema } from "mongoose";
import { IBannerImg, ICategoryLayout, IFaq, ILayout } from "../@types/layout";

const faqSchema = new Schema<IFaq>({
  question: { type: String },
  answer: { type: String },
});

const categoryLayoutSchema = new Schema<ICategoryLayout>({
  title: { type: String },
});

const bannerImgSchema = new Schema<IBannerImg>({
  public_id: { type: String },
  url: { type: String },
});

const layoutSchema = new Schema<ILayout>({
  type: { type: String },
  faq: [faqSchema],
  categories: [categoryLayoutSchema],
  banner: {
    img: bannerImgSchema,
    title: { type: String },
    subtitle: { type: String },
  },
});

const layoutModel: Model<ILayout> = mongoose.model("Layout", layoutSchema);

export default layoutModel;
