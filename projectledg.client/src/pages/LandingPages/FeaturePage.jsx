import React from "react";
import Navbar from "./LandingPageComp/Navbar";
import FeatureContent from "./FeaturePageComp/FeatureContent";

export default function FeaturePage() {
    return (
        <>
            <Navbar />
            <div className="w-[100vw] flex flex-row justify-center">
                <FeatureContent />
            </div>
            <div className="w-[100vw] overflow-auto">
            </div>
        </>
    )
}