import { Button } from "@/components/ui/button"
export default function Content() {
    return(
        <div className="flex flex-col w-[80vw] h-full justify-center items-center my-36">
        <h1 className="py-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Data till insikter på minuter</h1>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Bättre än Visma och Fortnox</h3>
        <div className="flex pt-8 flex-row w-[20vw] justify-between ">
            <Button className="w-32">Kom igång</Button>
            <Button className="w-32">Läs mer</Button>
        </div>
        
        
        </div>
    )

}