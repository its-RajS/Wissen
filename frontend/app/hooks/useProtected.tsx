import { redirect } from "next/navigation";
import userAuth from "./userAuth";

export default function Protected({ children }: { children: React.ReactNode }) {
  const user = userAuth();
  if (!user) {
    redirect("/");
  }
  return children;
}
