import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { Order, OrderBookState } from "./orderBook.types"

const initialState: OrderBookState = {
  allBidsObj: { total: 0, bids: {} },
  allAsksObj: { total: 0, asks: {} },
  aggregatedBidsObj: { total: 0, bids: {} },
  aggregatedAsksObj: { total: 0, asks: {} },
  largestBid: null,
  largestAsk: null,
  aggregate: 0.01,
  dataLoading: false,
}

const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    updateOrderBook: (state: OrderBookState, action): void => {
      const changes = action.payload
      const newAsks = { ...state.allAsksObj.asks }
      const newBids = { ...state.allBidsObj.bids }
      const newAggregatedAsks = { ...state.aggregatedAsksObj.asks }
      const newAggregatedBids = { ...state.aggregatedBidsObj.bids }
      const { aggregate } = state

      changes.forEach((item: [any, any, any]) => {
        const [type, price, size] = item
        const aggregatedPrice = (
          Math.floor(parseFloat(price) / aggregate) * aggregate
        ).toFixed(2)
        if (type === "sell") {
          if (size <= 0) {
            delete newAggregatedAsks[aggregatedPrice]
            delete newAsks[price]
            state.allAsksObj.total = state.allAsksObj.total - Number(size)
            state.aggregatedAsksObj.total =
              state.aggregatedAsksObj.total - Number(size)
          } else {
            state.allAsksObj.total = state.allAsksObj.total + Number(size)
            state.aggregatedAsksObj.total =
              state.aggregatedAsksObj.total + Number(size)
            newAsks[price] = newAsks[price]
              ? (Number(newAsks[price]) + Number(size)).toFixed(8)
              : Number(size).toFixed(8)
            newAggregatedAsks[aggregatedPrice] = newAggregatedAsks[
              aggregatedPrice
            ]
              ? (
                  Number(newAggregatedAsks[aggregatedPrice]) + Number(size)
                ).toFixed(8)
              : Number(size).toFixed(8)
          }
        } else if (type === "buy") {
          if (size <= 0) {
            delete newBids[price]
            delete newAggregatedBids[aggregatedPrice]
            state.allBidsObj.total = state.allBidsObj.total - Number(size)
            state.aggregatedBidsObj.total =
              state.aggregatedBidsObj.total - Number(size)
          } else {
            state.aggregatedBidsObj.total =
              state.aggregatedBidsObj.total + Number(size)
            state.allBidsObj.total = state.allBidsObj.total + Number(size)
            newAggregatedBids[aggregatedPrice] = newAggregatedBids[
              aggregatedPrice
            ]
              ? (
                  Number(newAggregatedBids[aggregatedPrice]) + Number(size)
                ).toFixed(8)
              : Number(size).toFixed(8)
            newBids[price] = newBids[price]
              ? (Number(newBids[price]) + Number(size)).toFixed(8)
              : Number(size).toFixed(8)
          }
        }
      })

      state.aggregatedAsksObj.asks = newAggregatedAsks
      state.aggregatedBidsObj.bids = newAggregatedBids
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
      state.aggregatedAsksObj.asks = aggregatedAsks
      const aggregatedBids: { [key: string]: string } = {}
      Object.entries(state.allBidsObj.bids).forEach(([price, size]) => {
        const aggregatedPrice = (
          Math.floor(parseFloat(price) / newAggregate) * newAggregate
        ).toFixed(2)
        aggregatedBids[aggregatedPrice] = aggregatedBids[aggregatedPrice]
          ? (Number(aggregatedBids[aggregatedPrice]) + Number(size)).toFixed(8)
          : Number(size).toFixed(8)
      })

      state.aggregatedBidsObj.bids = aggregatedBids
    },
    setAllBidsObj(state, action) {
      state.allBidsObj = action.payload
    },
    setAllAsksObj(state, action) {
      state.allAsksObj = action.payload
    },
    setAggregatedBidsObj(state, action) {
      state.aggregatedBidsObj = action.payload
    },
    setAggregatedAsksObj(state, action) {
      state.aggregatedAsksObj = action.payload
    },
    setLargestBid(state, action: PayloadAction<Order | null>) {
      state.largestBid = action.payload
    },
    setLargestAsk(state, action: PayloadAction<Order | null>) {
      state.largestAsk = action.payload
    },
    setDataLoading(state, action: PayloadAction<Boolean>) {
      state.dataLoading = action.payload
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
  setAggregatedBidsObj,
  setAggregatedAsksObj,
  setDataLoading,
} = orderBookSlice.actions

export default orderBookSlice.reducer
