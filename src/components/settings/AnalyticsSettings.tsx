import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Download, FileText, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const costData = [
  { month: "Jan", cost: 120, forecast: 130 },
  { month: "Feb", cost: 150, forecast: 160 },
  { month: "Mar", cost: 180, forecast: 200 },
  { month: "Apr", cost: 220, forecast: 250 },
  { month: "May", cost: 280, forecast: 300 },
  { month: "Jun", cost: 310, forecast: 350 },
];

const usageData = [
  { service: "Agent Executions", count: 12450, cost: 3200 },
  { service: "API Calls", count: 32800, cost: 1640 },
  { service: "Storage", count: "45 GB", cost: 450 },
  { service: "Data Processing", count: "128 GB", cost: 1280 },
  { service: "Background Tasks", count: 3600, cost: 720 },
];

export function AnalyticsSettings() {
  const [timeframe, setTimeframe] = useState("6m");
  const isMobile = useIsMobile();
  
  const chartConfig = {
    cost: { label: "Actual Cost", color: "#8B5CF6" },
    forecast: { label: "Forecast", color: "#D946EF" }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Cost Analytics</CardTitle>
            <CardDescription>View and analyze your platform costs over time</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Label htmlFor="timeframe" className="text-sm">Timeframe</Label>
              <Select defaultValue="6m" onValueChange={setTimeframe}>
                <SelectTrigger id="timeframe" className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">
              <div className={`${isMobile ? 'h-[250px]' : 'h-[350px]'}`}>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="cost" stroke={chartConfig.cost.color} strokeWidth={2} />
                      <Line type="monotone" dataKey="forecast" stroke={chartConfig.forecast.color} strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
            <TabsContent value="breakdown">
              <div className={`${isMobile ? 'h-[250px]' : 'h-[350px]'}`}>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cost" fill={chartConfig.cost.color} />
                      <Bar dataKey="forecast" fill={chartConfig.forecast.color} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Usage Reports</CardTitle>
            <CardDescription>Generate and export detailed usage reports</CardDescription>
          </div>
          <Button className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="text-right">Cost ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageData.map((item) => (
                  <TableRow key={item.service}>
                    <TableCell className="font-medium">{item.service}</TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell className="text-right">${item.cost.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-bold">
                    ${usageData.reduce((total, item) => total + item.cost, 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-medium">Available Reports</h3>
              <Select defaultValue="monthly">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Summary</SelectItem>
                  <SelectItem value="detailed">Detailed Usage</SelectItem>
                  <SelectItem value="forecast">Cost Forecast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {["Monthly Report", "Usage Breakdown", "Cost Forecast"].map((report) => (
                <Card key={report} className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                  <FileText className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium">{report}</h4>
                    <p className="text-sm text-muted-foreground">Last generated: Apr 10, 2025</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
