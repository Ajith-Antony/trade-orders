import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import type { SelectChangeEvent } from "@mui/material/Select"
import Select from "@mui/material/Select"
import type React from "react"
import { useState } from "react"
import { Provider } from "react-redux"
import "./App.css"
import { useAppDispatch } from "./app/hooks"
import { store } from "./app/store"
import Chart from "./features/chart/chart"
import { resetChartData } from "./features/chart/chartSlice"
import TradinViewWidget from "./features/chart/tradinViewWidget"
import OrderBook from "./features/orderBook/orderBook"
import TopBidAndAsk from "./features/topBidAndAsk/topBidAndAsk"
import useWebSocket from "./utils/useWebsocket"
import { IconButton } from "@mui/material"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"

const App: React.FC = () => {
  const [productId, setProductId] = useState<string>("BTC-USD")
  const [darkTheme, setDarkTheme] = useState<Boolean>(true)
  const dispatch = useAppDispatch()

  const handleProductChange = (event: SelectChangeEvent) => {
    dispatch(resetChartData())
    setProductId(event.target.value)
  }

  useWebSocket("wss://ws-feed.exchange.coinbase.com", productId)
  const onThemeClick = () => {
    if (darkTheme) {
      document.documentElement.style.setProperty("--primary-color", "#ffffff")
      document.documentElement.style.setProperty("--text-color", "#000000")
      document.documentElement.style.setProperty("--primary-dark", "#00000029")
      document.documentElement.style.setProperty(
        "--secondary-color",
        "#00000010",
      )
    } else {
      document.documentElement.style.setProperty("--primary-color", "#131722")
      document.documentElement.style.setProperty("--text-color", "#ffffff")
      document.documentElement.style.setProperty("--primary-dark", "#0d0f16")
      document.documentElement.style.setProperty("--secondary-color", "#2a2e39")
    }
    setDarkTheme(prv => !prv)
  }
  return (
    <Provider store={store}>
      <div className="topWrap">
        <h1>Trade</h1>
        <h2>{productId}</h2>
        <div>
          <FormControl sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="coin-select-label">Coin Pairs</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="coin-select"
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
          <IconButton sx={{ ml: 1 }} onClick={onThemeClick} color="inherit">
            {darkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>
      </div>
      <div className="wrapper">
        <div className="leftChild">
          <TopBidAndAsk />
          <div className="charts">
            <Chart />
            <TradinViewWidget
              coinPair={productId}
              theme={darkTheme ? "dark" : "light"}
            />
          </div>
        </div>
        <OrderBook />
      </div>
    </Provider>
  )
}

export default App
