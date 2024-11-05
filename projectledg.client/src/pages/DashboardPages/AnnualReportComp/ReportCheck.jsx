import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AnnualReportPreview } from "./AnnualReportPreview";
import React, { useState } from "react";
import AnnualReportSign from "./AnnualReportSign";

export default function ReportCheck() {
    const [currentStep, setCurrentStep] = useState(0);
    const maxSteps = 4;

    const handleNext = () => {
        if (currentStep < maxSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="w-full">
            <Tabs defaultValue="annualReports" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="annualReports" className="font-semibold">
                        Förhandsvisning
                    </TabsTrigger>
                    <TabsTrigger value="edit" className="text-muted-foreground">
                        Redigera
                    </TabsTrigger>
                    <TabsTrigger value="previousYears" className="text-muted-foreground">
                        Föregående år
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="annualReports" className="h-full w-full">
                    {/* Dots for step indicators */}
                    <TabsList className="annualSteps grid w-full grid-cols-4 justify-items-center rounded-b-none ">
                        {[...Array(maxSteps)].map((_, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-full ${index === currentStep ? "bg-green-500" : "bg-gray-400"
                                    }`}
                            ></div>
                        ))}
                    </TabsList>

                    {/* Card content changes with steps */}
                    <Card className="h-full w-full rounded-t-none">
                        <CardContent className="w-full ">
                            {currentStep === 0 && <div className="pt-0">
                                <AnnualReportPreview />
                            </div>}
                            {currentStep === 1 && <div className="py-8 ">
                                <AnnualReportSign />
                            </div>}
                            {currentStep === 2 && <div>Step 3 Content</div>}
                            {currentStep === 3 && <div>Step 4 Content</div>}
                        </CardContent>
                    </Card>

                    {/* Preview and Next Buttons */}
                    <div className="flex justify-between my-4">
                        {currentStep > 0 ? (
                            <button
                                onClick={handlePrevious}
                                className="px-2 py-1 bg-white border rounded-md text-green-500 font-semibold shadow-sm hover:bg-gray-100"
                            >
                                Föregående
                            </button>
                        ) : (
                            <div /> // Empty div to keep spacing
                        )}

                        {currentStep < maxSteps - 1 ? (
                            <button
                                onClick={handleNext}
                                className="px-2 py-1 bg-white border rounded-md text-green-500 font-semibold shadow-sm hover:bg-gray-100"
                            >
                                Nästa
                            </button>
                        ) : (
                            <div /> // Empty div to keep spacing
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="edit">
                    <Card>
                        <CardContent>{/* Add Kund content here */}</CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="previousYears">
                    <Card>
                        <CardContent>{/* Add previous years' content here */}</CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
