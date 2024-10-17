import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

// const FeatureContentBody = () => {
//     return (
//         <div>

//         </div>
//     )
// }

export default function FeatureContentBody() {
    const steps = [
        {
            number: "01",
            title: "Idea Generate",
            description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the printing and typesetting industry."
        },
        {
            number: "02",
            title: "Plan & Design",
            description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the printing and typesetting industry."
        },
        {
            number: "03",
            title: "Got Results",
            description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the printing and typesetting industry."
        },
        {
            number: "04",
            title: "Project Testing",
            description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the printing and typesetting industry."
        }
    ]

    return (
        <div className="w-full bg-blue-500 pb-10">
            <div className=" mx-auto  bg-green-500">
                <h1 className="text-4xl font-bold mb-8 text-center bg-pink-500">
                    Simple Step Follow To Complete Your Work
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-red-500">
                    {steps.map((step, index) => (
                        <Card key={index} className="border-0 shadow-none bg-yellow-500">
                            <CardContent className="p-3 ">
                                <div className="flex flex-col space-y-2">
                                    <span className="text-4xl font-bold text-sage-600">{step.number}</span>
                                    <h2 className="text-2xl font-semibold">{step.title}</h2>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
