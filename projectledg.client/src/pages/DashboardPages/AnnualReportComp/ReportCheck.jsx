import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AnnualReportPreview } from "./AnnualReportPreview";
import React, { useState } from "react";
import AnnualReportSign from "./AnnualReportSign";

export default function ReportCheck() {
    

    

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
                    <Card>
                        <CardContent>{
                                    
                            <AnnualReportPreview/>        
                                    
                                    
                                    
                                    
                        }</CardContent>
                    </Card>
                    

                    
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
