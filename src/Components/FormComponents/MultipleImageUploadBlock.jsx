import { useEffect, useId, useMemo, useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FormCardBlock from "./FormCardBlock";

const MAX_IMAGES = 5;

export default function MultipleImageUploadBlock({
  title,
  images = [],
  onChange,
  onClear,
  disabled = false,
  previewHeight = "220px",
  altText = "gallery preview",
  helperText = "Upload up to 5 images",
}) {
  const inputId = useId();
  const normalizedImages = Array.isArray(images) ? images.slice(0, MAX_IMAGES) : [];

  const previewItems = useMemo(
    () =>
      normalizedImages.map((image, index) => {
        if (image instanceof File) {
          return {
            id: `${image.name}-${index}`,
            name: image.name,
            src: URL.createObjectURL(image),
          };
        }

        if (typeof image === "string" && image.trim() !== "") {
          return {
            id: `${image}-${index}`,
            name: `Image ${index + 1}`,
            src: image.trim(),
          };
        }

        return null;
      }).filter(Boolean),
    [normalizedImages]
  );

  useEffect(() => {
    return () => {
      previewItems.forEach((item) => {
        if (item?.src?.startsWith("blob:")) {
          URL.revokeObjectURL(item.src);
        }
      });
    };
  }, [previewItems]);

  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);

  useEffect(() => {
    if (!previewItems.length) {
      setSelectedPreviewIndex(0);
      return;
    }

    if (selectedPreviewIndex > previewItems.length - 1) {
      setSelectedPreviewIndex(0);
    }
  }, [previewItems, selectedPreviewIndex]);

  const activePreview = previewItems[selectedPreviewIndex] || null;
  const remainingSlots = Math.max(0, MAX_IMAGES - normalizedImages.length);
  const isFileInputDisabled = disabled || remainingSlots === 0;

  const handleFileChange = (event) => {
    const pickedFiles = Array.from(event.target.files || []);

    if (!pickedFiles.length) {
      return;
    }

    const nextImages = [...normalizedImages, ...pickedFiles].slice(0, MAX_IMAGES);
    onChange?.(nextImages);
    event.target.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    const nextImages = normalizedImages.filter((_, index) => index !== indexToRemove);
    onChange?.(nextImages);

    if (!nextImages.length) {
      onClear?.();
    }
  };

  return (
    <FormCardBlock title={title}>
      {activePreview && (
        <PreviewWrapper>
          <PreviewImage
            src={activePreview.src}
            alt={altText}
            style={{ height: previewHeight }}
          />
        </PreviewWrapper>
      )}

      {previewItems.length > 0 && (
        <ThumbnailRow>
          {previewItems.map((item, index) => (
            <ThumbnailCard
              key={item.id}
              type="button"
              isActive={index === selectedPreviewIndex}
              onClick={() => setSelectedPreviewIndex(index)}
              disabled={disabled}
            >
              <ThumbnailImage src={item.src} alt={`${altText} ${index + 1}`} />
              {!disabled && (
                <RemoveButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveImage(index);
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 16 }} />
                </RemoveButton>
              )}
            </ThumbnailCard>
          ))}
        </ThumbnailRow>
      )}

      <UploadPanel>
        <HiddenFileInput
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={isFileInputDisabled}
        />

        <UploadLabel htmlFor={inputId}>
          <UploadButton
            component="span"
            variant="outlined"
            disabled={isFileInputDisabled}
          >
            Add Images
          </UploadButton>
          <FileNameText variant="body2" isPlaceholder={!normalizedImages.length}>
            {normalizedImages.length
              ? `${normalizedImages.length} image${normalizedImages.length > 1 ? "s" : ""} selected`
              : "No images selected"}
          </FileNameText>
        </UploadLabel>

        <HelperRow>
          <HelperText variant="caption">
            {helperText} {remainingSlots ? `(${remainingSlots} slot${remainingSlots > 1 ? "s" : ""} left)` : "(limit reached)"}
          </HelperText>
          <LimitBadge variant="caption">
            {normalizedImages.length}/{MAX_IMAGES}
          </LimitBadge>
        </HelperRow>
      </UploadPanel>

      {normalizedImages.length > 0 && (
        <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onClear}
            disabled={disabled}
            sx={{ textTransform: "none", borderRadius: 2.5 }}
          >
            Clear All
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

const ThumbnailRow = styled(Box)({
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 12,
});

const ThumbnailCard = styled("button", {
  shouldForwardProp: (prop) => prop !== "isActive",
})(({ theme, isActive }) => ({
  position: "relative",
  border: `1px solid ${isActive ? theme.palette.primary.main : "rgba(0,0,0,0.12)"}`,
  boxShadow: isActive ? `0 0 0 2px ${theme.palette.primary.light}` : "none",
  borderRadius: 10,
  padding: 0,
  width: 72,
  height: 72,
  overflow: "hidden",
  backgroundColor: "#fff",
  cursor: "pointer",
}));

const ThumbnailImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
});

const RemoveButton = styled(IconButton)({
  position: "absolute",
  top: 4,
  right: 4,
  backgroundColor: "rgba(255,255,255,0.92)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,1)",
  },
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
  wordBreak: "break-word",
}));

const HelperRow = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginTop: 10,
});

const HelperText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const LimitBadge = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 600,
}));
