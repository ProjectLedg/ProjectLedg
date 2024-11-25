import { Spinner } from "@/components/ui/spinner"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"



export default function ReloadButton({isLoading, onClick}) {


    return (
        <Button
            className="bg-green-500 hover:bg-green-600 dark:text-white space-x-1"
            onClick={onClick}
        >
            {isLoading ? 
                <Spinner size={"xsmall"} className="text-white" /> : 
                <RotateCcw className="dark:text-white" size={16} />} 
            <span>{isLoading ? "Laddar..." : "Ladda om"}</span>
        </Button>
    )
}