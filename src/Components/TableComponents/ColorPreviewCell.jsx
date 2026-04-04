import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CenteredCell from "./CenteredCell";

const FALLBACK_COLOR = "#91d0db";

const normalizeColor = (value) => {
  const trimmedValue = `${value || ""}`.trim();
  const isHexColor = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
    trimmedValue,
  );

  return isHexColor ? trimmedValue.toUpperCase() : FALLBACK_COLOR;
};

export default function ColorPreviewCell({ value }) {
  const colorValue = normalizeColor(value);

  return (
    <ColorCell>
      <Swatch style={{ backgroundColor: colorValue }} />
      <ColorCode variant="body2">{colorValue}</ColorCode>
    </ColorCell>
  );
}

const ColorCell = styled(CenteredCell)({
  gap: 10,
  justifyContent: "center",
});

const Swatch = styled(Box)({
  width: 28,
  height: 28,
  borderRadius: "999px",
  border: "2px solid     rgba(15, 23, 42, 0.06)",
  flexShrink: 0,
});

const ColorCode = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: 0.3,
  color: theme.palette.text.primary,
}));
