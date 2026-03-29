import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CenteredCell from "./CenteredCell";

export default function PreviewButtonCell({ text }) {
  if (!text) return "-";

  return (
    <CenteredCell>
      <PreviewButton variant="contained" color="primary" size="small">
        {text}
      </PreviewButton>
    </CenteredCell>
  );
}

const PreviewButton = styled(Button)({
  borderRadius: "50px",
  fontSize: "11px",
  textTransform: "none",
});
