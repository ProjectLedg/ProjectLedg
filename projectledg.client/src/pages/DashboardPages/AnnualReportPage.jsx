import React from "react";
import ReportCheck from "./AnnualReportComp/ReportCheck";
import YearTag from "./AnnualReportComp/YearTag";

export default function AnnualReportPage() {
    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-6">
                <div className="md:col-span-1 flex flex-col p-0 m-0">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 sm:mb-0 pb-4 ">
                        Årsredovisning
                    </h1>
                    <div className="flex flex-col ">
                        <ReportCheck className="w-full" />
                    </div>

                </div>
            </div>
        </div>
    );
}
