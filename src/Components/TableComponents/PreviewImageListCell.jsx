import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CenteredCell from "./CenteredCell";

export default function PreviewImageListCell({ images = [], altPrefix = "preview" }) {
  if (!Array.isArray(images) || images.length === 0) {
    return "-";
  }

  return (
    <CenteredCell sx={{ justifyContent: "flex-start" }}>
      <ImageListColumn>
        {images.slice(0, 5).map((image, index) => (
          <ImageRow key={`${image?.url || "image"}-${index}`}>
            <OrderBadge variant="caption">{index + 1}</OrderBadge>
            <PreviewImage
              src={image?.url}
              alt={`${altPrefix} ${index + 1}`}
            />
          </ImageRow>
        ))}
      </ImageListColumn>
    </CenteredCell>
  );
}

const ImageListColumn = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: "8px 0",
});

const ImageRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

const OrderBadge = styled(Typography)(({ theme }) => ({
  minWidth: 18,
  fontWeight: 700,
  color: theme.palette.text.secondary,
}));

const PreviewImage = styled("img")({
  width: 34,
  height: 34,
  objectFit: "cover",
  borderRadius: 6,
  border: "1px solid rgba(0,0,0,0.12)",
});
