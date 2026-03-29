import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export default function RichTextPreviewCell({ value, formatter }) {
  return (
    <FullHeightBox>
      <Typography
        component="div"
        sx={descriptionPreviewSx}
        dangerouslySetInnerHTML={{
          __html: formatter(value),
        }}
      />
    </FullHeightBox>
  );
}

const descriptionPreviewSx = {
  fontSize: "12px",
  lineHeight: 1.6,
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 5,
  WebkitBoxOrient: "vertical",
  whiteSpace: "normal",
  wordBreak: "break-word",
  "& span, & strong, & b, & em, & i, & u, & s, & a": {
    display: "inline",
    margin: 0,
    padding: 0,
  },
  "& a": {
    color: "inherit",
    textDecoration: "underline",
  },
  "& img, & video, & iframe": {
    display: "none",
  },
};

const FullHeightBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  height: "100%",
  width: "100%",
});
