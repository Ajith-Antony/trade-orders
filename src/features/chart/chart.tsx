import type React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useAppSelector } from "../../app/hooks"
import type { RootState } from "../../app/store"
import { CircularProgress } from "@mui/material"

const ChartComponent: React.FC = () => {
  const { chartData } = useAppSelector((state: RootState) => state.chart)

  const tickFormatter = (tick: string, index: number) => {
    const totalTicks = chartData.length
    const numberOfTicksToShow = 4
    const tickInterval = Math.ceil(totalTicks / numberOfTicksToShow)
    if (index % tickInterval === 0) {
      const date = new Date(tick)
      return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
    return ""
  }

  const yAxisTickFormatter = (tick: number) => {
    return tick.toFixed(0)
  }

  const diff = Math.abs(Number(chartData[0]?.ask) - Number(chartData[1]?.ask))

  return chartData.length ? (
    <>
      <ResponsiveContainer width="95%" height={480} className="bidAskChart">
        <LineChart data={chartData}>
          <XAxis dataKey="time" tickFormatter={tickFormatter} />
          <YAxis
            domain={[
              Number(chartData[0]?.ask) - 10 * diff - 1,
              Number(chartData[0]?.ask) + 10 * diff + 1,
            ]}
            tickFormatter={yAxisTickFormatter}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ask"
            stroke="#db5151"
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="bid"
            stroke="#51db58"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  ) : (
    <div className="chart-palceHolder">
      <CircularProgress color="secondary" />
    </div>
  )
}

export default ChartComponent
