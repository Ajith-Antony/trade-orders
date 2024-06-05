import type React from "react"
import { useEffect, useRef, memo } from "react"

interface TradingViewWidgetProps {
  coinPair?: string
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  coinPair = "BTC-USD",
}) => {
  coinPair = coinPair.replace(/-/g, "") // Remove hyphens from coinPair

  const container = useRef<HTMLDivElement>(null)

  const addScript = () => {
    const graphScript = document.getElementById("tradingViewScript")
    if (graphScript) graphScript.remove()

    const script = document.createElement("script")
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.id = "tradingViewScript"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: coinPair,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_legend: true,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
    })
    container.current?.appendChild(script)
  }

  useEffect(() => {
    addScript()
  }, [coinPair])

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ minHeight: "500px", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
    </div>
  )
}

export default memo(TradingViewWidget)
