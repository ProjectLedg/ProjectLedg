import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "lucide-react"; // Example icon
import { cn } from "@/lib/utils"; // Utility for combining classes

function DatePicker({ id, name, value, onChange }) {
    const [selectedDate, setSelectedDate] = useState(value || "");
  
    const handleDateChange = (e) => {
      setSelectedDate(e.target.value);
      if (onChange) {
        onChange(e); // Notify parent form of changes
      }
    };
  
    return (
      <div className="space-y-2">
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full text-left rounded border bg-white py-2 pl-3 pr-10 shadow-sm dark:bg-darkBackground",
                  "hover:ring focus:outline-none focus:ring-2 focus:ring-offset-2"
                )}
              >
                {selectedDate || "Välj datum"}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent>
            <div className="relative">
                <Input
                    type="date"
                    id={id}
                    name={name}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full appearance-none rounded-md border border-gray-300 bg-gray-50 py-2 pl-3 pr-10 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                
                </div>

            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }
  
  export default DatePicker;
