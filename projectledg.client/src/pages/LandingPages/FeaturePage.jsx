import React, { useEffect, useState } from "react";
import Navbar from "./LandingPageComp/Navbar";
import FeatureContentTitle from "./FeaturePageComp/FeatureContentTitle";
import FeatureContentBody from "./FeaturePageComp/FeatureContentBody";
import FeatureContentImage from "./FeaturePageComp/FeatureContentImage";
import { Navigate } from "react-router-dom";
import FooterSection from "./LandingPageComp/FooterSection"

export default function FeaturePage() {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const bottomOffset = document.body.scrollHeight - window.innerHeight;

            if (scrollY >= bottomOffset) {
                setShowNavbar(false);
            } else if (scrollY < lastScrollY) {
                setShowNavbar(true);
            }
            setLastScrollY(scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);



export default function FeaturePage() {

    const isMobile = window.innerWidth <= 768;

    if(isMobile){
        return <Navigate to="/"/>;
    }
    
    return (
        <>
            <div
                className={`fixed top-0 w-full z-50 transition-opacity duration-500 ${showNavbar ? "opacity-100" : "opacity-0"
                    }`}
            >
                <Navbar />
            </div>
            <div className="w-full h-[2500px] flex flex-col bg-gradient-to-t from-blue-700/30">
                <FeatureContentTitle />
                <FeatureContentImage />
            </div>
            <div className="bg-gradient-to-b from-blue-700/30 mb-1 transition-colors duration-1000 ease-in-out">
                <FeatureContentBody />
            </div>
            <div className="mt-24">
      <FooterSection />
      </div>
        </>
    );
}
