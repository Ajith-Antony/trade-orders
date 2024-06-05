// useWebSocket.ts
import { useCallback, useEffect } from "react"
import { useAppDispatch } from "../app/hooks"
import {
  setAllAsks,
  setAllBids,
  setLargestAsk,
  setLargestBid
} from "../features/orderBook/orderBookSlice"
import type { Order } from "../features/orderBook/orderBook.types"
import { setChartData } from "../features/chart/chartSlice"
import { debounce } from "lodash"



const useWebSocket = (url: string, product_id: string | null) => {
  const dispatch = useAppDispatch()
    const debouncedSetChartData = useCallback(
      debounce(data => dispatch(setChartData(data)), 500),
      [dispatch],
    )
     const debouncedLargestAsk = useCallback(
       debounce(data => dispatch(setLargestAsk(data)), 500),
       [dispatch],
     )
      const debouncedLargestBid = useCallback(
        debounce(data => dispatch(setLargestBid(data)), 500),
        [dispatch],
      )
  useEffect(() => {
    if (!product_id) return

    const ws = new WebSocket(url)

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "subscribe",
          channels: ["level2_batch", "ticker"],
          product_ids: [product_id],
        }),
      )
    }

    ws.onmessage = event => {
      const message = JSON.parse(event.data)

      if (message.type === "snapshot") {
        const { bids, asks } = message
        dispatch(setAllBids(bids))
        dispatch(setAllAsks(asks))
      }

      if (message.type === "l2update") {
        const { changes } = message  
      }
      if (message.type === "ticker") {
        const { best_ask, best_bid, best_bid_size, best_ask_size, time } =
          message
        console.log(message);
        
        const largeAsk = [best_ask, best_ask_size] as unknown as Order
        const largeBid = [best_bid, best_bid_size] as unknown as Order

        debouncedLargestAsk(largeAsk)
        debouncedLargestBid(largeBid)
        debouncedSetChartData({ bid: best_bid, ask: best_ask, time })
      }
    }

    return () => {
      ws.close()
        debouncedSetChartData.cancel()
    }
  }, [dispatch, url, product_id, debouncedSetChartData, debouncedLargestAsk, debouncedLargestBid])
}

export default useWebSocket
