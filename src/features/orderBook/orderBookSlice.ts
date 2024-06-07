import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { Order, OrderBookState } from "./orderBook.types"

const initialState: OrderBookState = {
  allBidsObj: { total: 0, bids: {} },
  allAsksObj: { total: 0, asks: {} },
  largestBid: null,
  largestAsk: null,
  aggregate: 0.01,
}

const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    updateOrderBook: (state: OrderBookState, action): void => {
      const changes = action.payload
      const newAsks = { ...state.allAsksObj.asks }
      const newBids = { ...state.allBidsObj.bids }
      const { aggregate } = state

      changes.forEach((item: [any, any, any]) => {
        const [type, price, size] = item
        const aggregatedPrice = (
          Math.floor(parseFloat(price) / aggregate) * aggregate
        ).toFixed(2)
        if (type === "sell") {
          if (size <= 0) {
            delete newAsks[aggregatedPrice]
            state.allAsksObj.total = state.allAsksObj.total - Number(size)
          } else {
            state.allAsksObj.total = state.allAsksObj.total + Number(size)
            newAsks[aggregatedPrice] = newAsks[aggregatedPrice]
              ? (Number(newAsks[aggregatedPrice]) + Number(size)).toFixed(8)
              : Number(size).toFixed(8)
          }
        } else if (type === "buy") {
          if (size <= 0) {
            delete newBids[aggregatedPrice]
            state.allBidsObj.total = state.allBidsObj.total - Number(size)
          } else {
            state.allBidsObj.total = state.allBidsObj.total + Number(size)
            newBids[aggregatedPrice] = newBids[aggregatedPrice]
              ? (Number(newBids[aggregatedPrice]) + Number(size)).toFixed(8)
              : Number(size).toFixed(8)
          }
        }
      })

      state.allAsksObj.asks = newAsks
      state.allBidsObj.bids = newBids
    },
    setAggregate(state, action: PayloadAction<Number>) {
      state.aggregate = action.payload
      let newAggregate = action.payload
      const aggregatedAsks: { [key: string]: string } = {}
      Object.entries(state.allAsksObj.asks).forEach(([price, size]) => {
        const aggregatedPrice = (
          Math.floor(parseFloat(price) / newAggregate) * newAggregate
        ).toFixed(2)
        aggregatedAsks[aggregatedPrice] = aggregatedAsks[aggregatedPrice]
          ? (Number(aggregatedAsks[aggregatedPrice]) + Number(size)).toFixed(8)
          : Number(size).toFixed(8)
      })
      state.allAsksObj.asks = aggregatedAsks
      const aggregatedBids: { [key: string]: string } = {}
      Object.entries(state.allBidsObj.bids).forEach(([price, size]) => {
        const aggregatedPrice = (
          Math.floor(parseFloat(price) / newAggregate) * newAggregate
        ).toFixed(2)
        aggregatedBids[aggregatedPrice] = aggregatedBids[aggregatedPrice]
          ? (Number(aggregatedBids[aggregatedPrice]) + Number(size)).toFixed(8)
          : Number(size).toFixed(8)
      })
      state.allBidsObj.bids = aggregatedBids
    },
    setAllBidsObj(state, action) {
      state.allBidsObj = action.payload
    },
    setAllAsksObj(state, action) {
      state.allAsksObj = action.payload
    },
    setLargestBid(state, action: PayloadAction<Order | null>) {
      state.largestBid = action.payload
    },
    setLargestAsk(state, action: PayloadAction<Order | null>) {
      state.largestAsk = action.payload
    },
  },
})

export const {
  setLargestBid,
  setLargestAsk,
  setAggregate,
  setAllBidsObj,
  setAllAsksObj,
  updateOrderBook,
} = orderBookSlice.actions

export default orderBookSlice.reducer
