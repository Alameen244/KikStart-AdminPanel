import { ThemeProvider } from "@mui/material/styles";
import OTP from "../../Components/AdminAuth/OTP/OTP";
import { theme as frontendTheme } from "../../../../frontEnd/src/theme";

export default function AdminOtp() {
  return (
    <ThemeProvider theme={frontendTheme}>
      <OTP />
    </ThemeProvider>
  );
}
