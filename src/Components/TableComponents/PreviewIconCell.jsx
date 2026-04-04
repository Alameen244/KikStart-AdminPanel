import { styled } from "@mui/material/styles";
import CenteredCell from "./CenteredCell";

export default function PreviewIconCell({ imageUrl, alt }) {
  if (!imageUrl) return "-";

  return (
    <IconCenteredCell>
      <IconFrame>
        <PreviewIcon src={imageUrl} alt={alt} />
      </IconFrame>
    </IconCenteredCell>
  );
}

const IconCenteredCell = styled(CenteredCell)({
  justifyContent: "center",
});

const IconFrame = styled("div")({
  width: 56,
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 12,
  backgroundColor: "#fff",
});

const PreviewIcon = styled("img")({
  width: 40,
  height: 40,
  objectFit: "contain",
  imageRendering: "auto",
});
