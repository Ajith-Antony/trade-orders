// App.tsx
import type React from "react";
import { useState } from "react"
import { Provider } from "react-redux"
import { store } from "./app/store"
import OrderBook from "./features/orderBook/orderBook"
import useWebSocket from "./utils/useWebsocket"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select"
import TopBidAndAsk from "./features/topBidAndAsk/topBidAndAsk";
import "./App.css"
import Chart from "./features/chart/chart";
import { useAppDispatch } from "./app/hooks";
import { resetChartData, setChartData } from "./features/chart/chartSlice";
import TradinViewWidget from "./features/chart/tradinViewWidget";

const App: React.FC = () => {
  const [productId, setProductId] = useState<string>("BTC-USD")
  const dispatch = useAppDispatch()

  const handleProductChange = (event: SelectChangeEvent) => {
    dispatch(resetChartData())
    setProductId(event.target.value)
  }

  useWebSocket("wss://ws-feed.exchange.coinbase.com", productId) // Replace with actual WebSocket URL

  return (
    <Provider store={store}>
      <div className="topWrap">
        <h1>Trade</h1>
        <FormControl sx={{ m: 1, minWidth: 250 }}>
          <InputLabel id="demo-select-small-label">Coin Pairs</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={productId}
            label="Coin Pairs"
            onChange={handleProductChange}
          >
            <MenuItem value="BTC-USD">BTC-USD</MenuItem>
            <MenuItem value="ETH-USD">ETH-USD</MenuItem>
            <MenuItem value="LTC-USD">LTC-USD</MenuItem>
            <MenuItem value="BCH-USD">BCH-USD</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="wrapper">
        <div className="leftChild">
          <TopBidAndAsk />
          <div className="charts">
            <Chart />
            <TradinViewWidget coinPair={productId} />
          </div>
        </div>
        <OrderBook />
      </div>
    </Provider>
  )
}

export default App
