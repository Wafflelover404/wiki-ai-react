"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TestSelectPage() {
  const [selectedPeriod, setSelectedPeriod] = useState(7)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Select Component</h1>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Current selected period: {selectedPeriod} days
          </p>
          
          <Select 
            value={selectedPeriod.toString()} 
            onValueChange={(value) => {
              console.log('Period changed to:', value);
              setSelectedPeriod(Number(value));
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="p-4 bg-muted rounded-md">
          <h3 className="font-medium mb-2">Debug Info:</h3>
          <p>selectedPeriod state: {selectedPeriod}</p>
          <p>selectedPeriod type: {typeof selectedPeriod}</p>
          <p>selectedPeriod toString: {selectedPeriod.toString()}</p>
        </div>
      </div>
    </div>
  )
}
