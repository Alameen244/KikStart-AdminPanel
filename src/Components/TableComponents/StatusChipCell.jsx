import { Chip } from "@mui/material";
import CenteredCell from "./CenteredCell";

export default function StatusChipCell({ value }) {
  return (
    <CenteredCell>
      <Chip
        label={value ? "Active" : "Inactive"}
        color={value ? "success" : "default"}
        size="small"
        variant="filled"
      />
    </CenteredCell>
  );
}
