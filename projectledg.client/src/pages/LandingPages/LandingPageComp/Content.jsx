import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Content() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-[80vw] h-full justify-center items-center my-36">
      <h1 className="py-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Data till insikter på minuter
      </h1>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Bättre än Visma och Fortnox
      </h3>
      <div className="flex pt-8 flex-row w-[70vw] md:w-[20vw] justify-around">
        <Button className="w-32" onClick={() => navigate("/signup")}>
          Kom igång
        </Button>
        <Button className="w-32">Läs mer</Button>
      </div>
    </div>
  );
}
