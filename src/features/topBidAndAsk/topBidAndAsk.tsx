import type React from "react"
import { useAppSelector } from "../../app/hooks"
import type { RootState } from "../../app/store"
import cssClasses from "./styles.module.css"

const TopBidAndAsk: React.FC = () => {
  const { largestAsk, largestBid } = useAppSelector(
    (state: RootState) => state.orderBook,
  )

  const renderItem = (type: "Bid" | "Ask") => {
    let item = type === "Bid" ? largestBid : largestAsk
    return (
      <div className={cssClasses.itemsWrap}>
        <h4 className={type === "Bid" ? "" : cssClasses.askHeader}>
          Best {type}
        </h4>
        <div>
          <div>
            <span>{item ? item[0] : "-"}</span>
            <h6>{type} Price</h6>
          </div>
          <div>
            <span>{item ? item[1] : "-"}</span>
            <h6>{type} Quantity</h6>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={cssClasses.wrapper}>
      {renderItem("Bid")}
      {renderItem("Ask")}
      <div className={cssClasses.ask}></div>
    </div>
  )
}

export default TopBidAndAsk
