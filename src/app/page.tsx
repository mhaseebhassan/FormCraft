import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "FormCraft | Build the future of forms",
  description:
    "The high-performance visual editor for engineering teams. Design stunning interactive experiences that output production-ready React components.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FormCraft | Build the future of forms",
    description: "The high-performance visual editor for engineering teams.",
    url: "/",
    siteName: "FormCraft",
    type: "website",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
