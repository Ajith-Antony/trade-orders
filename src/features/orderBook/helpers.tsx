import { Virtuoso } from "react-virtuoso"
import Layout1 from "../../assets/layout1.png"
import Layout2 from "../../assets/layout2.png"
import Layout3 from "../../assets/layout3.png"
import type { AskAggregates, BidAggregates } from "./orderBook.types"
import cssClasses from "./orderbook.module.css"
import type { SelectChangeEvent } from "@mui/material"
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"
import type { ReactNode } from "react"
export const layoutData = [
  {
    id: 1,
    img: Layout1,
  },
  {
    id: 2,
    img: Layout2,
  },
  {
    id: 3,
    img: Layout3,
  },
]
export const renderAggregates = (
  aggregates: BidAggregates | AskAggregates,
  type: "bids" | "asks",
  fullHeight: Boolean = false,
  loading: Boolean = false,
) => {
  const keys =
    type === "bids"
      ? Object.keys(aggregates.bids)
      : Object.keys(aggregates.asks)
  return (
    <ul
      className={`${cssClasses.lists} ${fullHeight ? cssClasses.listsFull : ""} ${loading ? cssClasses.listsLoading : ""}`}
    >
      {loading ? (
        <CircularProgress color="secondary" />
      ) : (
        <Virtuoso
          style={{
            height: fullHeight ? "100%" : "252.5px",
            overflowX: "hidden",
          }}
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
                  $ {String(key)}
                </span>
                <span>-</span>
              </li>
            )
          }}
          endReached={() => {}}
        />
      )}
    </ul>
  )
}
export const getAggregation = (
  aggregate: any,
  handleAggregateChange:
    | ((event: SelectChangeEvent<any>, child: ReactNode) => void)
    | undefined,
) => (
  <div className={cssClasses.orderBookAggregate}>
    <div>Aggregation</div>
    <FormControl sx={{ m: 1, minWidth: 75 }} size="small" id="select-wrap">
      <InputLabel>Aggr.</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={aggregate}
        label="Aggregate"
        onChange={handleAggregateChange}
      >
        <MenuItem value="10">10</MenuItem>
        <MenuItem value="1">1</MenuItem>
        <MenuItem value="0.1">0.1</MenuItem>
        <MenuItem value="0.01">0.01</MenuItem>
      </Select>
    </FormControl>
  </div>
)
