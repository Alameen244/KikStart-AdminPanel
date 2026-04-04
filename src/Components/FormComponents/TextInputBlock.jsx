import { TextField } from "@mui/material";
import FormCardBlock from "./FormCardBlock";

export default function TextInputBlock({
  title,
  value,
  onChange,
  placeholder,
  label,
  multiline = false,
  minRows,
  type = "text",
  inputProps,
}) {
  return (
    <FormCardBlock title={title}>
      <TextField
        fullWidth
        size="small"
        type={type}
        multiline={multiline}
        minRows={minRows}
        inputProps={inputProps}
        placeholder={placeholder}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormCardBlock>
  );
}
