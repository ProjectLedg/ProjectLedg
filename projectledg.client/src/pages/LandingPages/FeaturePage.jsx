import React from "react";
import Navbar from "./LandingPageComp/Navbar";
import FeatureContentTitle from "./FeaturePageComp/FeatureContentTitle";
import FeatureContentBody from "./FeaturePageComp/FeatureContentBody";

export default function FeaturePage() {
    return (
        <>
            <Navbar />
            <div className="w-[100vw] flex flex-col justify-center">
                <FeatureContentTitle />
                <FeatureContentBody />
            </div>
            <div className="w-[100vw] overflow-auto">
            </div>
        </>
    )
}