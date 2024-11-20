import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Content() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    window.location.hash = "#why";
  };

  return (
    <div className="flex flex-col w-[80vw] h-full justify-center items-center mt-24  ">
      <h1 className="py-10 scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl text-center ">
        Data till insikter på <span className="text-green-500">minuter</span>
      </h1>

      <h3 className="scroll-m-20 text-2xl font-normal text-center tracking-tight">
        Få full kontroll över ditt företags ekonomi med Ledge
      </h3>

      <div className="flex pt-8 flex-row w-[70vw] md:w-[20vw] justify-around">
        <Button className="w-32" onClick={handleNavigate}>
          Läs mer
        </Button>
        <button
          className="group relative inline-flex items-center justify-center overflow-hidden w-32 text-sm font-medium text-slate-800 transition-colors duration-700 ease-out hover:text-green-500 focus:outline-none focus:ring active:bg-green-800 active:text-white rounded-full"
          onClick={() => navigate("/signup")}
        >
          <span className="absolute inset-0 rounded-full border-2 border-transparent transition-all duration-700 ease-out group-hover:border-green-500"></span>
          <span className="absolute left-0 top-0 h-[2px] w-0 bg-green-500 transition-all duration-700 ease-out group-hover:w-full"></span>
          <span className="absolute right-0 top-0 h-0 w-[2px] bg-green-500 transition-all duration-700 ease-out group-hover:h-full"></span>
          <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-green-500 transition-all duration-700 ease-out group-hover:w-full"></span>
          <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-green-500 transition-all duration-700 ease-out group-hover:h-full"></span>
          <span className="relative z-10">Kom igång</span>
        </button>
      </div>

      <div className="my-24">
        <img className="border-2 rounded-md shadow-even" src="src\assets\LoadingPageDashboardPlaceholder.jpg" alt="Image of dashboard" />
      </div>
    </div>
  );
}
