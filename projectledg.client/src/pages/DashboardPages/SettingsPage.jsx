import React, { useState } from "react";
import { Plus } from "lucide-react";
import ThemeToggle from "@/services/ThemeToggle"; // Importera ThemeToggle
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log("Password change requested");
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    console.log("Email change requested");
  };

  const handlePlanChange = (plan) => {
    setCurrentPlan(plan);
    console.log("Plan changed to:", plan);
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    console.log("New company addition requested");
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    console.log("New user addition requested");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-4 bg-transparent border-b">
        <h1 className=" md:pl-px sm:pl-px text-2xl font-bold text-green-500">Account Settings</h1>
      </div>
      <ScrollArea className="flex-grow">
        <div className="max-w mx-auto p-4 space-y-6">
          {/* Card for Change Password */}
          <Card className="border-green-500 border-opacity-20">
            <CardHeader>
              <CardTitle className="text-green-500">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input className="max-w-sm" id="current-password" type="password" required />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input className="max-w-sm" id="new-password" type="password" required />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input className="max-w-sm" id="confirm-password" type="password" required />
                </div>
                <Button type="submit" className="bg-green-500 hover:bg-green-600">Change Password</Button>
              </form>
            </CardContent>
          </Card>

          {/* Appearance Settings Card */}
          <Card className="border-green-500 border-opacity-20">
            <CardHeader>
              <CardTitle className="text-green-500">Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your interface</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label className="flex items-center cursor-pointer">
                  <ThemeToggle />
                  <div className="ml-3 text-gray-700 font-medium">Dark Mode</div>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Billing Plan Card */}
          <Card className="border-green-500 border-opacity-20">
            <CardHeader>
              <CardTitle className="text-green-500">Billing Plan</CardTitle>
              <CardDescription>Manage your subscription and billing preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={currentPlan} onValueChange={handlePlanChange}>
                <SelectTrigger className="border-green-500 border-opacity-50">
                  <SelectValue placeholder="Select a plan" />
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
