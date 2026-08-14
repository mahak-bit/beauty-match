import type { Metadata } from "next";
import DiscoverClient from "./DiscoverClient";

export const metadata: Metadata = {
  title: "Discover",
  description: "Search and filter the full Beauty Match catalogue by skin type, concern, ingredient, price, and more.",
};

export default function DiscoverPage() {
  return <DiscoverClient />;
}
