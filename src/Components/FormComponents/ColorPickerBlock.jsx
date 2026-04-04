import { useMemo, useState } from "react";
import { Box, Button, Collapse, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SketchPicker } from "react-color";
import FormCardBlock from "./FormCardBlock";

const normalizeColor = (value) => {
  const trimmedValue = `${value || ""}`.trim();
  const isHexColor = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(
    trimmedValue,
  );
  if (!trimmedValue) return "#91d0db";
  return isHexColor ? trimmedValue : "#91d0db";
};

export default function ColorPickerBlock({
  title,
  value,
  onChange,
  placeholder = "#91d0db",
}) {
  const [openPicker, setOpenPicker] = useState(false);
  const colorValue = useMemo(() => normalizeColor(value), [value]);

  return (
    <FormCardBlock title={title}>
      <Stack spacing={2}>
        <ColorPreviewRow>
          <ColorSwatch sx={{ backgroundColor: colorValue }} />
          <ColorMeta>
            <Typography variant="body2" fontWeight={600}>
              Selected Color
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {colorValue}
            </Typography>
          </ColorMeta>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpenPicker((prev) => !prev)}
          >
            {openPicker ? "Close Picker" : "Pick Color"}
          </Button>
        </ColorPreviewRow>

        <TextField
          fullWidth
          size="small"
          label="Color Value"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <Collapse in={openPicker} unmountOnExit>
          <PickerWrapper>
            <SketchPicker
              color={colorValue}
              onChangeComplete={(color) => onChange(color.hex)}
            />
          </PickerWrapper>
        </Collapse>
      </Stack>
    </FormCardBlock>
  );
}

const ColorPreviewRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 12,
});

const ColorSwatch = styled(Box)({
  width: 48,
  height: 48,
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.14)",
  flexShrink: 0,
});

const ColorMeta = styled(Box)({
  flex: 1,
  minWidth: 0,
});

const PickerWrapper = styled(Box)({
  "& .sketch-picker": {
    width: "100% !important",
    maxWidth: 252,
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  },
});
