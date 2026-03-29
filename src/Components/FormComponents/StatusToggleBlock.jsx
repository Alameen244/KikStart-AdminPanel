import { FormControlLabel, Switch } from "@mui/material";

export default function StatusToggleBlock({ checked, onChange }) {
  return (
    <FormControlLabel
      control={
        <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />
      }
      label={checked ? "Active" : "Inactive"}
    />
  );
}
