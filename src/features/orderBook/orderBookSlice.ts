// orderBookSlice.ts
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Order, OrderBookState } from "./orderBook.types";



const initialState: OrderBookState = {
  allBids: [],
  allAsks: [],
  largestBid: null,
  largestAsk: null,
  aggregate:0
}

const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    setAggregate(state, action: PayloadAction<Number>) {
      state.aggregate = action.payload
    },
    setAllBids(state, action: PayloadAction<Order[]>) {
      state.allBids = action.payload
      state.largestBid = state.allBids[0] || null
    },
    setAllAsks(state, action: PayloadAction<Order[]>) {
      state.allAsks = action.payload
      state.largestAsk = state.allAsks[0] || null
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
  setAllBids,
  setAllAsks,
  setLargestBid,
  setLargestAsk,
  setAggregate
} = orderBookSlice.actions

export default orderBookSlice.reducer

