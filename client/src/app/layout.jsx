"use client";
import { RecoilRoot } from "recoil";
import { useRouter } from "next/router";
import { basePath } from "@/../next.config.js";
import GoogleAnalytics from "@/components/analytics";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./styles/main.scss";

export default function RootLayout({ children }) {
  const routes = [
    { title: "Home", path: "/"},
    { title: "Explore", path: "/explore" },
    { title: "About", path: "/about" },
  ]

  return (
    <RecoilRoot>
      <html lang="en">
        <head>
          <title>FORGEdb - Functional SNP</title>
          <meta name="keywords" content="FORGEdb" />
          <link rel="icon" href={`${basePath}/favicon.ico`} sizes="any" />
          <GoogleAnalytics id={process.env.GOOGLE_ANALYTICS_ID} />
        </head>
        <body className="d-flex flex-column vh-100">
          <Header routes={routes} />
          <main className="position-relative d-flex flex-column flex-grow-1 align-items-stretch bg-light">{children}</main>
          <Footer />
        </body>
      </html>
    </RecoilRoot>
  );
}
