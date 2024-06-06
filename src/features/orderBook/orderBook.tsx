// OrderBook.tsx
import type { SelectChangeEvent } from "@mui/material"
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import type React from "react"
import { Virtuoso } from "react-virtuoso"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import type { RootState } from "../../app/store"
import type { AskAggregates, BidAggregates } from "./orderBook.types"
import { setAggregate } from "./orderBookSlice"
import cssClasses from "./orderbook.module.css"

const renderAggregates = (
  aggregates: BidAggregates | AskAggregates,
  type: "bids" | "asks",
) => {
  const keys =
    type === "bids"
      ? Object.keys(aggregates.bids)
      : Object.keys(aggregates.asks)
  return (
    <ul className={cssClasses.lists}>
      <Virtuoso
        style={{ height: "300px", overflowX: "hidden" }}
        totalCount={keys.length}
        itemContent={index => {
          const key = keys[index]
          const item = aggregates[type][key]
          return (
            <li key={index}>
              <span>{item}</span>
              <span
                className={
                  type === "bids" ? cssClasses.bidItem : cssClasses.askItem
                }
              >
                $ {key}
              </span>
              <span>-</span>
            </li>
          )
        }}
        endReached={() => {}}
      />
    </ul>
  )
}
const OrderBook: React.FC = () => {
  const dispatch = useAppDispatch()
  const { allAsksObj, allBidsObj, aggregate } = useAppSelector(
    (state: RootState) => state.orderBook,
  )
  const handleAggregateChange = (event: SelectChangeEvent<Number>) => {
    dispatch(setAggregate(Number(event.target.value)))
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
        {renderAggregates(allBidsObj, "bids")}
        <div className={cssClasses.orderBookAggregate}>
          <div>Aggregation</div>
          <FormControl sx={{ m: 1, minWidth: 75 }} size="small">
            <InputLabel id="demo-select-small-label">Aggr.</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={aggregate}
              label="Aggregate"
              onChange={handleAggregateChange}
            >
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="0.1">0.1</MenuItem>
              <MenuItem value="0.01">0.01</MenuItem>
            </Select>
          </FormControl>
        </div>
        {renderAggregates(allAsksObj, "asks")}
      </div>
    </div>
  )
}

export default OrderBook
