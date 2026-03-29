import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export default function CenteredCell({ children }) {
  return <CellCenterBox>{children}</CellCenterBox>;
}

const CellCenterBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  height: "100%",
});
