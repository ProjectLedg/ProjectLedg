import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AnnualReportPreview } from "./AnnualReportPreview";
import React from "react";
import AnnualReportFeature from "./AnnualReportFeature";


export default function ReportCheck() {




    return (
        <div className="w-full ">
            <Tabs defaultValue="annualReports">
                <TabsList className="flex  justify-start w-full sm:w-min mb-3 dark:bg-darkBackground">
                    <TabsTrigger
                        value="annualReports"
                        className=" text-xs sm:text-sm truncate"
                        title="Generera Årsredovisning"
                    >
                        Ny årsredovisning
                    </TabsTrigger>
                    <TabsTrigger
                        value="edit"
                        className="text-muted-foreground text-xs sm:text-sm truncate"
                        title="Föregående Årsredovisningar"
                    >
                        Föregående årsredovisningar
                    </TabsTrigger>

                </TabsList>

                <TabsContent value="annualReports" className="h-full w-full ">
                    {/* Dots for step indicators */}
                    <Card >
                        <CardContent className="p-0">{

                            <AnnualReportPreview />

                        }</CardContent>
                    </Card>



                </TabsContent>

                <TabsContent value="edit">
                    <Card>
                        <CardContent>
                                <AnnualReportFeature/>
                        </CardContent>
                    </Card>
                </TabsContent>


            </Tabs>
        </div>
    );
}
