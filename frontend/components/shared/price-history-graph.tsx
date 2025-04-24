import React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';

type PriceChartProps = {
  prices: string[];
};

const PriceChart: React.FC<PriceChartProps> = ({ prices }) => {
  const numericPrices = prices.map((price) => {
    const numericValue = parseFloat(price.replace(/[^0-9.]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  });

  const chartData = numericPrices.map((price, index) => ({
    price,
    point: index + 1,
  }));

  const chartConfig: ChartConfig = {};

  return (
    <ChartContainer config={chartConfig} className="border rounded-md p-5">
      <LineChart data={chartData} margin={{ left: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-muted/50"
          vertical={false}
        />
        <XAxis
          dataKey="point"
          className="text-xs text-muted-foreground"
          tickLine={false}
          axisLine={false}
          padding={{ left: 0, right: 0 }}
        />
        <YAxis
          className="text-xs text-muted-foreground"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `£${value}`}
          width={25}
          dx={-5}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          cursor={{ strokeDasharray: '3 3' }}
        />
        <Line
          type="monotone"
          dataKey="price"
          strokeWidth={2}
          activeDot={{
            r: 4,
            className: 'fill-primary stroke-background stroke-2',
          }}
          className="stroke-primary fill-primary/10"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default PriceChart;
