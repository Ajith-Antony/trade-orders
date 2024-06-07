import { IconButton } from "@mui/material"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
interface ThemeSwitchProps {
  darkTheme: Boolean
  setDarkTheme: React.Dispatch<React.SetStateAction<Boolean>>
}
const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  darkTheme,
  setDarkTheme,
}) => {
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
    setDarkTheme((prv: any) => !prv)
  }
  return (
    <IconButton sx={{ ml: 1 }} onClick={onThemeClick} color="inherit">
      {darkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  )
}
export default ThemeSwitch
