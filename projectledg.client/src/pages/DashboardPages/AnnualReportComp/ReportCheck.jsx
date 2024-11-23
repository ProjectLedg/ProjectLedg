import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AnnualReportPreview } from "./AnnualReportPreview";
import React, { useState } from "react";


export default function ReportCheck() {




    return (
        <div className="w-full">
            <Tabs defaultValue="annualReports">
                <TabsList className="flex  justify-start w-full  dark:bg-darkBackground">
                    <TabsTrigger
                        value="annualReports"
                        className="font-semibold text-xs sm:text-sm truncate"
                        title="Generera Årsredovisning"
                    >
                        Ny årsredovisning
                    </TabsTrigger>
                    <TabsTrigger
                        value="edit"
                        className="text-muted-foreground font-semibold text-xs sm:text-sm truncate"
                        title="Föregående Årsredovisningar"
                    >
                        Föregående årsredovisningar
                    </TabsTrigger>

                </TabsList>

                <TabsContent value="annualReports" className="h-full w-full">
                    {/* Dots for step indicators */}
                    <Card>
                        <CardContent>{

                            <AnnualReportPreview />

                        }</CardContent>
                    </Card>



                </TabsContent>

                <TabsContent value="edit">
                    <Card>
                        <CardContent>{/* Add Kund content here */}</CardContent>
                    </Card>
                </TabsContent>


            </Tabs>
        </div>
    );
}
