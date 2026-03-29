import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import FormCardBlock from "./FormCardBlock";

export default function RichTextBlock({
  title,
  value,
  onChange,
  modules,
  placeholder,
}) {
  return (
    <FormCardBlock title={title}>
      <EditorWrapper>
        <QuillBox>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            placeholder={placeholder}
          />
        </QuillBox>
      </EditorWrapper>
    </FormCardBlock>
  );
}

const EditorWrapper = styled(Box)({
  minHeight: "240px",
  "& .ql-container.ql-snow": {
    display: "flex",
    flexDirection: "column",
  },
  "& .ql-toolbar.ql-snow": {
    border: "1px solid rgba(0,0,0,0.23)",
    borderRadius: "4px",
    borderBottom: "none",
  },
  "& .ql-container": {
    fontSize: "0.875rem",
    border: "1px solid rgba(0,0,0,0.23)",
    borderTop: "none",
    minHeight: "240px",
  },
  "& .ql-editor": {
    minHeight: "198px",
    flex: 1,
  },
  "& .ql-editor.ql-blank::before": {
    fontStyle: "italic",
  },
});

const QuillBox = styled(Box)({
  minHeight: "240px",
  "& .quill": {
    minHeight: "240px",
  },
});
