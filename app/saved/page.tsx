import type { Metadata } from "next";
import SavedClient from "./SavedClient";

export const metadata: Metadata = {
  title: "My Beauty Shelf",
  description: "Your saved products, saved routines, and recently viewed items.",
};

export default function SavedPage() {
  return <SavedClient />;
}
