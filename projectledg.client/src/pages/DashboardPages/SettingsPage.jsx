import React, { useState } from "react";
import { Plus } from "lucide-react";
import ThemeToggle from "@/services/ThemeToggle"; // Importera ThemeToggle
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosConfig } from '/axiosconfig'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SettingsPage() {
  const [currentPlan, setCurrentPlan] = useState("free");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosConfig.post("/User/ChangePassword", formData);
      setMessage({ type: "Klart", text: "Lösenord är nu bytt!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Ett fel uppstog...",
      });
    }
  };

 

  const handlePlanChange = (plan) => {
    setCurrentPlan(plan);
    
  };

  

  return (
    <div className="space-y-4 p-4">
      <div className="flex-none bg-transparent">
        <h1 className="text-3xl font-bold text-black dark:text-white">Inställningar</h1>
      </div>
      <ScrollArea className="flex-grow">
        <div className="max-w mx-auto space-y-6">
          {/* Card for Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-500 dark:text-white">Byt lösenord</CardTitle>
              <CardDescription className="dark:text-darkSecondary">
                Uppdatera ditt lösenord för att hålla ditt konto säkert
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Nuvarande lösenord</Label>
                  <Input
                    className="max-w-sm"
                    id="currentPassword"
                    type="text"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nytt lösenord</Label>
                  <Input
                    className="max-w-sm"
                    id="newPassword"
                    type="text"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Bekräfta nytt lösenord</Label>
                  <Input
                    className="max-w-sm"
                    id="confirmPassword"
                    type="text"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="bg-green-500 hover:bg-green-600 dark:text-white">
                  Byt Lösenord
                </Button>
              </form>
              {message && (
                <div
                  className={`mt-4 text-sm ${
                    message.type === "Klart" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appearance Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-500 dark:text-white">Utseende</CardTitle>
              <CardDescription className="dark:text-darkSecondary">
                Anpassa utseendet och känslan för ditt gränssnitt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label className="flex items-center cursor-pointer">
                  <ThemeToggle />
                  <div className="ml-3 text-gray-700 dark:text-white font-medium">Dark Mode</div>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Billing Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-500 dark:text-white">Betalningsplan</CardTitle>
              <CardDescription className="dark:text-darkSecondary">
                Hantera dina prenumerationer och faktureringsinställningar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={currentPlan} onValueChange={handlePlanChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj ett paket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
