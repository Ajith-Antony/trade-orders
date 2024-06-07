import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit"

interface ChartState {
  chartData: { time: string; bid: number,ask:number }[]
}

const initialState: ChartState = {
  chartData: [],
}

interface ChartDataPayload {
  time: string
  bid: number
  ask:number
}

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    setChartData(state, action: PayloadAction<ChartDataPayload>) {
      const chartData =
        state.chartData.length >= 15
          ? state.chartData.slice(8, 15)
          : state.chartData
      state.chartData = [...chartData, action.payload]
    },

    resetChartData(state) {
      state.chartData = []
    },
  },
})

export const { setChartData, resetChartData } = chartSlice.actions

export default chartSlice.reducer
