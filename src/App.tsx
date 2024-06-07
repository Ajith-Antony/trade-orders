import type React from "react"
import { useState } from "react"
import { Provider } from "react-redux"
import "./App.css"
import { store } from "./app/store"
import Charts from "./features/chart"
import CoinPairSelect from "./features/coinPairSelect"
import OrderBook from "./features/orderBook/orderBook"
import ThemeSwitch from "./features/themeSwitch"
import TopBidAndAsk from "./features/topBidAndAsk/topBidAndAsk"
import useWebSocket from "./utils/useWebsocket"

const App: React.FC = () => {
  const [productId, setProductId] = useState<string>("BTC-USD")
  const [darkTheme, setDarkTheme] = useState<Boolean>(true)

  useWebSocket("wss://ws-feed.exchange.coinbase.com", productId)

  return (
    <Provider store={store}>
      <div className="topWrap">
        <h1>Trade</h1>
        <h2>{productId}</h2>
        <div>
          <CoinPairSelect productId={productId} setProductId={setProductId} />
          <ThemeSwitch darkTheme={darkTheme} setDarkTheme={setDarkTheme} />
        </div>
      </div>
      <div className="wrapper">
        <div className="leftChild">
          <TopBidAndAsk />
          <Charts productId={productId} darkTheme={darkTheme} />
        </div>
        <OrderBook />
      </div>
    </Provider>
  )
}

export default App
