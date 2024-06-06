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

      changes.forEach((item: [any, any, any]) => {
        const [type, price, size] = item
        if (type === "sell") {
          if (size <= 0) {
            delete newAsks[price]
            state.allAsksObj.total = state.allAsksObj.total - Number(size)
          } else {
            state.allAsksObj.total = state.allAsksObj.total + Number(size)
            newAsks[price] = newAsks[price]
              ? (Number(newAsks[price]) + Number(size)).toFixed(8)
              : newAsks[price]
          }
        } else if (type === "buy") {
          if (size <= 0) {
            delete newBids[price]
            state.allBidsObj.total = state.allBidsObj.total - Number(size)
          } else {
            state.allBidsObj.total = state.allBidsObj.total + Number(size)
            newBids[price] = newBids[price]
              ? (Number(newBids[price]) + Number(size)).toFixed(8)
              : newBids[price]
          }
        }
      })

      state.allAsksObj.asks = newAsks
      state.allBidsObj.bids = newBids
    },
    setAggregate(state, action: PayloadAction<Number>) {
      state.aggregate = action.payload
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
