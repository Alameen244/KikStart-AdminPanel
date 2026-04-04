import { Box, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export default function NumberFieldBlock({
  title,
  value,
  onChange,
  placeholder,
  label,
  min = 0,
  step = 1,
}) {
  return (
    <FieldCard>
      <FieldTitle variant="subtitle2">{title}</FieldTitle>

      <TextField
        size="small"
        type="number"
        placeholder={placeholder}
        label={label}
        value={value}
        sx={{ width: 140 }}
        inputProps={{ min, step }}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldCard>
  );
}

const FieldCard = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  flexDirection: "column",
  gap: 6,
  padding: "8px 10px",
  borderRadius: 7,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const FieldTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  margin: 0,
}));
