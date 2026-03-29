import { Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

export default function FormColumnLayout({ leftContent, rightContent }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <LeftColumnBox>{leftContent}</LeftColumnBox>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 6 }}>{rightContent}</Grid>
    </Grid>
  );
}

const LeftColumnBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 20,
});
