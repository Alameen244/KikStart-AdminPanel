import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export default function CenteredCell({ children, className, ...props }) {
  return (
    <CellCenterBox className={className} {...props}>
      {children}
    </CellCenterBox>
  );
}

const CellCenterBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  height: "100%",
});
