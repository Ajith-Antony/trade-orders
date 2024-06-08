import type { SelectChangeEvent } from "@mui/material"
import type React from "react"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import type { RootState } from "../../app/store"
import { getAggregation, layoutData, renderAggregates } from "./helpers"
import { setAggregate } from "./orderBookSlice"
import cssClasses from "./orderbook.module.css"

const OrderBook: React.FC = () => {
  const dispatch = useAppDispatch()
  const [layout, setlayout] = useState(1)
  const { aggregatedBidsObj, aggregatedAsksObj, aggregate, dataLoading } =
    useAppSelector((state: RootState) => state.orderBook)
  const handleAggregateChange = (event: SelectChangeEvent<Number>) => {
    dispatch(setAggregate(Number(event.target.value)))
  }

  return (
    <div>
      <div className={cssClasses.orderBook}>
        <h3>
          Order Book
          <ul className={cssClasses.layouts}>
            {layoutData.map(item => (
              <li
                key={item.id}
                className={item.id === layout ? cssClasses.selectedList : ""}
              >
                <img
                  src={item.img}
                  alt="layout_img"
                  onClick={() => {
                    setlayout(item.id)
                  }}
                />
              </li>
            ))}
          </ul>
        </h3>
        <div className={cssClasses.orderBookHeader}>
          <span>Market Size</span>
          <span>Price(USD)</span>
          <span>My size</span>
        </div>
        {layout === 3
          ? renderAggregates(aggregatedAsksObj, "asks", true, dataLoading)
          : renderAggregates(
              aggregatedBidsObj,
              "bids",
              layout === 2,
              dataLoading,
            )}
        {getAggregation(aggregate, handleAggregateChange)}
        {layout === 1
          ? renderAggregates(aggregatedAsksObj, "asks", false, dataLoading)
          : null}
      </div>
    </div>
  )
}

export default OrderBook
