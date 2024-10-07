import { Card, CardContent, CardHeader } from "@/components/ui/card"


export default function CompanySelectPage() {
    return(
        <>
            <section className="">
                <h1>Select comapny</h1>
                <Card className="w-40">
                    <CardHeader>ProjectLedge AB</CardHeader>
                    <CardContent>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, beatae?</p>
                    </CardContent>
                </Card>

                <Card className="w-40">
                    <CardHeader>ProjectLedge AB</CardHeader>
                    <CardContent>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid, beatae?</p>
                    </CardContent>
                </Card>
            </section>
        </>
    )   

}