import { Button } from "@/components/ui/button"
export default function Content() {
    return(
        <div className="flex flex-col w-[80vw] h-full justify-center items-center">
        <h1 className="py-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Data till insikter på minuter</h1>
        <p>Bättre än Visma och Fortnox</p>
        <div className="flex pt-4 flex-row w-[20vw] justify-between ">
            <Button>Kom igång</Button>
            <Button>Läs mer</Button>
        </div>
        
        
        </div>
    )

}