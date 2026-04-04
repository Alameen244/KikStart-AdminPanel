import { Chip } from "@mui/material";
import CenteredCell from "./CenteredCell";
import { styled } from "@mui/material/styles";


export default function StatusChipCell({ value }) {
  return (
    <StatusCenteredCell>
      <Chip
        label={value ? "Active" : "Inactive"}
        color={value ? "success" : "default"}
        size="small"
        variant="filled"
      />
    </StatusCenteredCell>
  );
}
const StatusCenteredCell = styled(CenteredCell)({
  justifyContent:"center"
})
