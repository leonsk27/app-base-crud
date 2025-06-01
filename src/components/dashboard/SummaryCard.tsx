
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, className }) => {
  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {/* Optional: Add a description or percentage change here */}
        {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
