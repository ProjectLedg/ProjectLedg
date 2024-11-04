import React from "react";
import Navbar from "./LandingPageComp/Navbar";
import Content from "./LandingPageComp/Content";
import CardShow from "./LandingPageComp/Problems";
import FooterSection from "./LandingPageComp/FooterSection";
import NewsletterSignup from "./LandingPageComp/NewsletterSignup";
import CallToAction from "./LandingPageComp/CallToAction";

export default function LandingPage() {
return (
    <>
        
        <Navbar />
        <div className="w-[100vw] flex flex-col items-center justify-center space-y-5">
            <Content />
        </div>
        <div className="w-[100vw] overflow-auto">
            <section id="why" className="scroll-mt-32">
                <CardShow />
            </section>     
        </div>
        <div className="flex flex-col items-center pb-36">
            <CallToAction />
        </div>
        <div className="flex flex-col items-center pb-36">
            <NewsletterSignup />
        </div>   
        <FooterSection />
       
    </>
);
}
