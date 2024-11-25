import React from 'react';
import { Construction } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function AnnualReportFeature() {
  return (
    <Card className="w-full p-6 mt-4 bg-background/60 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center space-y-4">
        <Construction className="h-12 w-12 text-muted-foreground animate-pulse" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">
            Tjänsten är utveckling
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Vi håller på att bygger denna funktion för att hjälpa dig se över tidigare Årsredovisningar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Under konstruktion
          </Badge>
          <span className="text-xs text-muted-foreground">Kommer snart</span>
        </div>
      </div>
    </Card>
  );
}

export default AnnualReportFeature;

