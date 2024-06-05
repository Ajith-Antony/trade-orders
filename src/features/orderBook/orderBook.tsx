// OrderBook.tsx
import type React from "react"
import { Virtuoso } from "react-virtuoso"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import type { RootState } from "../../app/store"
import { setAggregate } from "./orderBookSlice"
import cssClasses from './orderbook.module.css'
  const renderAggregates = (
    aggregates: { price: string; size: string }[],
    type: "bid" | "ask",
  ) => (
    <ul className={cssClasses.lists}>
      <Virtuoso
        style={{ height: "300px", overflowX: "hidden" }} // Set height as per your design
        totalCount={aggregates.length}
        itemContent={index => {
          const item = aggregates[index]
          return (
            <li key={index}>
              <span>{item[1]}</span>
              <span
                className={
                  type === "bid" ? cssClasses.bidItem : cssClasses.askItem
                }
              >
                $ {item[0]}
              </span>
              <span>-</span>
            </li>
          )
        }}
        endReached={() => {}}
      />
    </ul>
  )
const OrderBook: React.FC = () => {
  const dispatch = useAppDispatch()
  const { allAsks ,allBids,aggregate} = useAppSelector((state: RootState) => state.orderBook)
  console.log("render")
  const onButtonClick = (type: "add"|"sub") =>{
    switch (type) {
      case "add":
        const data=(aggregate+0.1).toFixed(1)
        dispatch(setAggregate(Number(data)))
        break
      case "sub":
        const agg = aggregate===0?0:(aggregate - 0.1).toFixed(1)
        dispatch(setAggregate(Number(agg)))
        break

      default:
        break
    }
  }

  return (
    <div>
      <div className={cssClasses.orderBook}>
        <h3>Order Book</h3>
        <div className={cssClasses.orderBookHeader}>
          <span>Market Size</span>
          <span>Price(USD)</span>
          <span>My size</span>
        </div>
        {renderAggregates(allBids,"bid")}
        <div className={cssClasses.orderBookAggregate}>
          <div>Aggregation</div>
          <span>{aggregate}</span>
          <div>
            <button onClick={() => onButtonClick("sub")}>-</button>
            <button onClick={() => onButtonClick("add")}>+</button>
          </div>
        </div>
        {renderAggregates(allAsks,"ask")}
      </div>
    </div>
  )
}

export default OrderBook
