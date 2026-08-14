import type { Metadata } from "next";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare up to four skincare products side by side — price, ingredients, texture, and fit.",
};

export default function ComparePage() {
  return <CompareClient />;
}
