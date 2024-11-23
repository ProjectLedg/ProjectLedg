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
            <div className="w-full h-[2500px]  flex flex-col 
            bg-gradient-to-t from-blue-700/30 after: ">
                <FeatureContentTitle />

                <FeatureContentImage />
            </div>
            <div className="bg-gradient-to-b from-blue-700/30 mb-1 transition-colors duration-1000 ease-in-out">

                <FeatureContentBody />
            </div>

            <Footer />
        </>
    )
}