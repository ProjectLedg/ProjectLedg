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
            <div className="w-full flex flex-col justify-center 
            bg-gradient-to-t from-blue-700/30">
                <FeatureContentTitle />
                <FeatureContentImage />

             <FeatureContentBody /> 
            </div>
           <Footer /> 
        </>
    )
}