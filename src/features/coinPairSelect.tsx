import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import type { SelectChangeEvent } from "@mui/material/Select"
import Select from "@mui/material/Select"
import { resetChartData } from "./chart/chartSlice"
import { useAppDispatch } from "../app/hooks"
import { setAggregate } from "./orderBook/orderBookSlice"

interface CoinPairSelectProps {
  productId: string
  setProductId: React.Dispatch<React.SetStateAction<string>>
}

const CoinPairSelect: React.FC<CoinPairSelectProps> = ({
  productId,
  setProductId,
}) => {
  const dispatch = useAppDispatch()
  const handleProductChange = (event: SelectChangeEvent) => {
    dispatch(resetChartData())
    dispatch(setAggregate(0.01))
    setProductId(event.target.value)
  }
  return (
    <FormControl sx={{ m: 1, minWidth: 200 }}>
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
  )
}

export default CoinPairSelect
