import React from "react";
import ReportCheck from "./AnnualReportComp/ReportCheck";
import { useParams } from "react-router-dom";


export default function AnnualReportPage() {
    
    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div className="md:col-span-1 flex flex-col p-0 m-0">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 sm:mb-0">Årsredovisningar</h2>
                    <div className="flex flex-col pt-7 ">
                        <ReportCheck className="w-full" />
                    </div>

                </div>
            </div>
        </div>
    );
}
