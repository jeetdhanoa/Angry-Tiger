import type { Metadata } from "next";
import FormatPage from "@/components/FormatPage";

export const metadata: Metadata = {
  title: "Films — Angry Tiger",
  description:
    "Feature films and short features from Angry Tiger. Our first slate is in development — new films get announced here first.",
};

const FEATURES = [
  { code: "F01", titleBar: "min(340px, 60vw)", genreBar: 72 },
  { code: "F02", titleBar: "min(280px, 52vw)", genreBar: 58 },
];

const SHORTS = [
  { code: "S01", titleBar: "min(240px, 46vw)", genreBar: 64 },
  { code: "S02", titleBar: "min(300px, 54vw)", genreBar: 48 },
];

export default function Films() {
  return (
    <FormatPage
      eyebrow="Films"
      heading="Films."
      lede="Feature films and short features. The first slate is in development — short features head to festivals and our channel, features get announced here first."
      groups={[
        { label: "Features", slates: FEATURES },
        { label: "Short Features", slates: SHORTS },
      ]}
    />
  );
}
