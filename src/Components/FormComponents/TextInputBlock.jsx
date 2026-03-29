import { TextField } from "@mui/material";
import FormCardBlock from "./FormCardBlock";

export default function TextInputBlock({
  title,
  value,
  onChange,
  placeholder,
  label,
}) {
  return (
    <FormCardBlock title={title}>
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormCardBlock>
  );
}
