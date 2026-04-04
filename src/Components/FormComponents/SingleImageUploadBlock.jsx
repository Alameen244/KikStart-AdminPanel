import { Box, Button, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import FormCardBlock from "./FormCardBlock";

export default function SingleImageUploadBlock({
  title,
  image,
  altText,
  onChange,
  imageUrl = "",
  onUrlChange,
  onClear,
  disabled = false,
  previewHeight = "100px",
}) {
  const hasUploadedFile = image instanceof File;
  const hasPastedUrl = typeof imageUrl === "string" && imageUrl.trim() !== "";
  const previewSource = hasUploadedFile
    ? URL.createObjectURL(image)
    : hasPastedUrl
      ? imageUrl.trim()
      : typeof image === "string" && image.trim() !== ""
        ? image
        : null;
  const isFileInputDisabled = disabled || hasPastedUrl;
  const isUrlInputDisabled = disabled || hasUploadedFile;
  const inputId = `${title}-file-upload`;

  return (
    <FormCardBlock title={title}>
      {previewSource && (
        <PreviewWrapper>
          <PreviewImage
            src={previewSource}
            alt={altText}
            style={{ height: previewHeight }}
          />
        </PreviewWrapper>
      )}

      <UploadPanel>
        <HiddenFileInput
          id={inputId}
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files[0])}
          disabled={isFileInputDisabled}
        />

        <UploadLabel htmlFor={inputId}>
          <UploadButton
            component="span"
            variant="outlined"
            disabled={isFileInputDisabled}
          >
            Choose Image
          </UploadButton>
          <FileNameText variant="body2" isPlaceholder={!hasUploadedFile}>
            {hasUploadedFile ? image.name : "No file selected"}
          </FileNameText>
        </UploadLabel>

        <HelperText variant="caption">
          Upload a file or use the image URL field below
        </HelperText>
      </UploadPanel>

      <DividerRow>
        <DividerLine />
        <DividerText variant="caption">OR</DividerText>
        <DividerLine />
      </DividerRow>

      <TextField
        label="Paste Image URL"
        fullWidth
        size="small"
        value={imageUrl}
        disabled={isUrlInputDisabled}
        onChange={(e) => onUrlChange?.(e.target.value)}
      />

      {(hasUploadedFile || hasPastedUrl) && (
        <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onClear}
            disabled={disabled}
            sx={{ textTransform: "none", borderRadius: 2.5 }}
          >
            Clear
          </Button>
        </Box>
      )}
    </FormCardBlock>
  );
}

const PreviewWrapper = styled(Box)({
  marginBottom: 12,
});

const PreviewImage = styled("img")({
  width: "100%",
  objectFit: "cover",
  borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.12)",
});

const UploadPanel = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: 12,
  padding: 14,
  backgroundColor: "#fafafa",
}));

const HiddenFileInput = styled("input")({
  display: "none",
});

const UploadLabel = styled("label")({
  display: "flex",
  alignItems: "center",
  gap: 12,
  cursor: "pointer",
});

const UploadButton = styled(Button)({
  minWidth: 128,
  textTransform: "none",
  borderRadius: 10,
});

const FileNameText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isPlaceholder",
})(({ theme, isPlaceholder }) => ({
  color: isPlaceholder ? theme.palette.text.secondary : theme.palette.text.primary,
  wordBreak: "break-all",
}));

const HelperText = styled(Typography)(({ theme }) => ({
  display: "block",
  marginTop: 10,
  color: theme.palette.text.secondary,
}));

const DividerRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 10,
  margin: "14px 0",
});

const DividerLine = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 1,
  backgroundColor: theme.palette.divider,
}));

const DividerText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 600,
  letterSpacing: 0.8,
}));
