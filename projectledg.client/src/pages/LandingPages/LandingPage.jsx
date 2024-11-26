import React, { useEffect } from "react";
import Navbar from "./LandingPageComp/Navbar";
import Content from "./LandingPageComp/Content";
import CardShow from "./LandingPageComp/Problems";
import FooterSection from "./LandingPageComp/FooterSection";
import NewsletterSignup from "./LandingPageComp/NewsletterSignup";
import CallToAction from "./LandingPageComp/CallToAction";
import { useTheme } from "@/components/ThemeProvider";

export default function LandingPage() {

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        window.scrollTo(0, 0);
        setTheme(theme === "light")
    }, [])



    return (
        <div className="">
            <Navbar />
            <div className="w-[100vw] flex flex-col items-center justify-center">
                <Content />
            </div>
            <div className="w-[100vw] overflow-auto">
                <CardShow />
            </div>
            <div className="flex flex-col items-center">
                <section id="why" className="scroll-mt-2">
                    <CallToAction />
                </section>
            </div>
            <div className="flex flex-col items-center px-4 md:px-6 m-auto  pb-14 sm:pb-36 ">
                <NewsletterSignup />
            </div>
            <div className="mt-24">
      <FooterSection />
      </div>
        </div>

    );
}
