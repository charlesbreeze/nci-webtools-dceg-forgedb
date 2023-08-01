"use client";
import { RecoilRoot } from "recoil";
import GoogleAnalytics from "@/components/analytics";
import Header from "@/components/header";
import AppNavbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import "./styles/main.scss";

export default function RootLayout({ children }) {
  const routes = [
    { title: "Home", path: "/"},
    { title: "Explore", path: "/explore" },
    { title: "API Access", path: "/api-access" },
    { title: "About", path: "/about" },
  ]

  return (
    <RecoilRoot>
      <html lang="en">
        <head>
          <title>FORGEdb - Functional SNP</title>
          <meta name="keywords" content="FORGEdb" />
          <link rel="icon" href={`${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.ico`} sizes="any" />
          <GoogleAnalytics id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        </head>
        <body className="d-flex flex-column vh-100">
          <Header routes={routes} />
          <main className="position-relative d-flex flex-column flex-grow-1 align-items-stretch bg-black cover-image" style={{backgroundImage: `url('${process.env.NEXT_PUBLIC_BASE_PATH}/assets/forgedb-background.png')`}}>
            <AppNavbar routes={routes} />
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </RecoilRoot>
  );
}
