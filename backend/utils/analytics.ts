import { Document, Model } from "mongoose";
import { IAnalytics } from "../@types/analytics";

export async function generateLast12MonthData<T extends Document>(
  model: Model<T>
): Promise<{ last12MonthData: IAnalytics[] }> {
  const last12MonthData = <IAnalytics[]>[];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    );
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28
    );
    const monthYear = endDate.toLocaleString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    last12MonthData.push({
      month: monthYear,
      count,
    });
  }
  return { last12MonthData };
}
