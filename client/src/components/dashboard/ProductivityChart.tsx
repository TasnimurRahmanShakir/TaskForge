import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { Button } from "@/components/ui/button";

interface ChartDataPoint {
  name: string;
  value: number;
}

const data: ChartDataPoint[] = [
  { name: "Mon", value: 2400 },
  { name: "Tue", value: 1398 },
  { name: "Wed", value: 9800 },
  { name: "Thu", value: 3908 },
  { name: "Fri", value: 4800 },
  { name: "Sat", value: 3800 },
  { name: "Sun", value: 4300 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: ValueType; name: NameType }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d0d1a] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-sm font-bold text-primary">
          Productivity: <span className="text-white">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function ProductivityChart() {
  return (
    <div className="glass-morphism rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Weekly Productivity
        </h3>
        <div className="flex bg-white/5 p-1 rounded-xl">
          <Button
            variant="ghost"
            size="sm"
            className="bg-primary text-primary-foreground text-xs font-bold rounded-lg px-4 hover:bg-primary/90"
          >
            Week
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground text-xs font-bold rounded-lg px-4 hover:text-white transition-colors"
          >
            Month
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.03)"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "rgba(255,255,255,0.3)",
                fontSize: 10,
                fontWeight: 600,
              }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "rgba(255,255,255,0.3)",
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
