import { styled } from "@mui/material/styles";
import CenteredCell from "./CenteredCell";

export default function PreviewImageCell({ imageUrl, alt }) {
  if (!imageUrl) return "-";

  return (
    <CenteredCell>
      <PreviewImage src={imageUrl} alt={alt} />
    </CenteredCell>
  );
}

const PreviewImage = styled("img")({
  width: "80px",
  height: "80px",
  objectFit: "cover",
  borderRadius: "4px",
});
