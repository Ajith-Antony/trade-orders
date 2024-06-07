import ChartComponent from "./chart"
import TradinViewWidget from "./tradinViewWidget"

interface chartProps {
  productId: string
  darkTheme: Boolean
}
const Charts: React.FC<chartProps> = ({ productId, darkTheme }) => {
  return (
    <div className="charts">
      <ChartComponent />
      <TradinViewWidget
        coinPair={productId}
        theme={darkTheme ? "dark" : "light"}
      />
    </div>
  )
}
export default Charts
