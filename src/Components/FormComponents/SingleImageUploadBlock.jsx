import { Box, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import FormCardBlock from "./FormCardBlock";

export default function SingleImageUploadBlock({
  title,
  image,
  altText,
  onChange,
  disabled = false,
  previewHeight = "100px",
}) {
  return (
    <FormCardBlock title={title}>
      {image && (
        <PreviewWrapper>
          <PreviewImage
            src={typeof image === "string" ? image : URL.createObjectURL(image)}
            alt={altText}
            style={{ height: previewHeight }}
          />
        </PreviewWrapper>
      )}
      <UploadTextField
        type="file"
        accept="image/*"
        fullWidth
        size="small"
        onChange={(e) => onChange(e.target.files[0])}
        disabled={disabled}
      />
    </FormCardBlock>
  );
}

const PreviewWrapper = styled(Box)({
  marginBottom: 12,
});

const PreviewImage = styled("img")({
  width: "100%",
  objectFit: "cover",
  borderRadius: "8px",
  border: "1px solid rgba(0,0,0,0.12)",
});

const UploadTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    paddingTop: 8,
    paddingBottom: 8,
  },
});
