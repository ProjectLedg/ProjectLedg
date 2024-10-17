import React from "react";
import Navbar from "./LandingPageComp/Navbar";
import FeatureContentTitle from "./FeaturePageComp/FeatureContentTitle";
import FeatureContentBody from "./FeaturePageComp/FeatureContentBody";
import FeatureContentImage from "./FeaturePageComp/FeatureContentImage";
import Footer from "./LandingPageComp/FooterSection"

export default function FeaturePage() {
    return (
        <>
            <Navbar />
            <div className="w-[100vw] flex flex-col justify-center px-8 md:px-12 lg:px-24">
                <FeatureContentTitle />
                <FeatureContentImage />
                <FeatureContentBody />
            </div>
            <Footer />
        </>
    )
}