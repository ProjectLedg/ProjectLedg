import React from "react";
import Navbar from "./LandingPageComp/Navbar";
import Content from "./LandingPageComp/Content";
import CardShow from "./LandingPageComp/CardShow";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="w-[100vw] flex flex-row justify-center">
        <Content />
      </div>
      <div className="w-[100vw] overflow-auto">
        <CardShow />
      </div>
    </>
  );
}
