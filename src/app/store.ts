import { configureStore } from "@reduxjs/toolkit"
import orderBookReducer from "../features/orderBook/orderBookSlice"
import chartSlice from "../features/chart/chartSlice"

export const store = configureStore({
  reducer: {
    orderBook: orderBookReducer,
    chart: chartSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
