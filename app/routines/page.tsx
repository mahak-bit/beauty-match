import type { Metadata } from "next";
import RoutinesClient from "./RoutinesClient";

export const metadata: Metadata = {
  title: "Routine Builder",
  description: "Build an AM/PM skincare routine and check it for commonly conflicting actives.",
};

export default function RoutinesPage() {
  return <RoutinesClient />;
}
