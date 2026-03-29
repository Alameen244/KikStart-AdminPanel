import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export default function FormCardBlock({ title, children, cardSx, contentSx }) {
  return (
    <StyledCard variant="outlined" sx={cardSx}>
      <StyledCardContent sx={contentSx}>
        <StyledTitle variant="subtitle2">{title}</StyledTitle>
        {children}
      </StyledCardContent>
    </StyledCard>
  );
}

const StyledCard = styled(Card)({});

const StyledCardContent = styled(CardContent)({
  padding: 16,
});

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: 12,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));
