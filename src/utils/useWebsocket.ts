import { debounce } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import type { RootState } from "../app/store"
import { setChartData } from "../features/chart/chartSlice"
import type { Order } from "../features/orderBook/orderBook.types"
import {
  setAllAsksObj,
  setAllBidsObj,
  setLargestAsk,
  setLargestBid,
  updateOrderBook,
} from "../features/orderBook/orderBookSlice"

interface bidOrAskData {
  [key: string]: string
}

const useWebSocket = (url: string, product_id: string | null) => {
  const { aggregate } = useAppSelector((state: RootState) => state.orderBook)
  const [, setChanges] = useState([])
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

  const debouncedDispatchChanges = useCallback(
    debounce(data => dispatch(updateOrderBook(data)), 200),
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
        let bidsTotal = 0,
          asksTotal = 0,
          asksData: bidOrAskData = {},
          bidsData: bidOrAskData = {}
        bids.forEach((element: [string, string]) => {
          const bidPrice = element[0]
          bidsData[bidPrice] = element[1]
          bidsTotal += Number(element[1])
        })
        asks.forEach((element: [string, string]) => {
          const askPrice = element[0]
          asksData[askPrice] = element[1]
          asksTotal += Number(element[1])
        })

        dispatch(setAllBidsObj({ bids: bidsData, total: bidsTotal }))
        dispatch(setAllAsksObj({ asks: asksData, total: asksTotal }))
      }

      if (message.type === "l2update") {
        const { changes } = message
        setChanges(prv => {
          const tempData = [...prv, ...changes]
          debouncedDispatchChanges(tempData)
          return tempData
        })
      }
      if (message.type === "ticker") {
        const { best_ask, best_bid, best_bid_size, best_ask_size, time } =
          message

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
      debouncedDispatchChanges.cancel()
      debouncedLargestAsk.cancel()
      debouncedLargestBid.cancel()
    }
  }, [
    dispatch,
    url,
    product_id,
    debouncedSetChartData,
    debouncedLargestAsk,
    debouncedLargestBid,
    debouncedDispatchChanges,
  ])
}

export default useWebSocket
