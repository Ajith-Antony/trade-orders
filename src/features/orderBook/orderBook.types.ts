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
  allBids: Order[]
  allAsks: Order[]
  largestBid: Order | null
  largestAsk: Order | null
  aggregate: Number
}
