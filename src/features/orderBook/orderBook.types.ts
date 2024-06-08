export interface Order {
  price: string
  size: string
}

export interface Change {
  side: string
  price: string
  size: string
}

export interface OrderBookState {
  largestBid: Order | null
  largestAsk: Order | null
  aggregate: Number
  allBidsObj: BidAggregates
  allAsksObj: AskAggregates
  aggregatedBidsObj: BidAggregates
  aggregatedAsksObj: AskAggregates
  dataLoading: Boolean
}
export interface AggregateData {
  [price: string]: string
}

export interface BidAggregates {
  bids: AggregateData
  total: number
}
export interface AskAggregates {
  asks: AggregateData
  total: number
}
export type Aggregates = BidAggregates | AskAggregates
