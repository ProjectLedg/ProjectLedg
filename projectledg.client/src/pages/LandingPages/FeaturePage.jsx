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
            <div className="w-full h-[2500px] sticky bottom-0  flex flex-col 
            bg-gradient-to-t from-blue-700/30 mb-1">
                <FeatureContentTitle />
                
                <FeatureContentImage />
            </div>
             <FeatureContentBody /> 
     
           <Footer /> 
        </>
    )
}