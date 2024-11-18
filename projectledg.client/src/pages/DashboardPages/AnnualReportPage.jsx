import React from "react";
import ReportCheck from "./AnnualReportComp/ReportCheck";
import { useParams } from "react-router-dom";


export default function AnnualReportPage() {
    
    return (
        <div className="space-y-4 p-4">
            <div >
                <h2 className="text-3xl font-bold">Årsredovisningar</h2>
                <div className="md:col-span-1 flex flex-col">
                
                    <div className="flex flex-col pt-7 ">
                        <ReportCheck className="w-full" />
                    </div>

                </div>
            </div>
        </div>
    );
}
