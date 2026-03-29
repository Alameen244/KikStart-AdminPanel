import { Box, Button, IconButton, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FormCardBlock from "./FormCardBlock";

export default function HeadingListBlock({
  headings,
  onChange,
  onAdd,
  onRemove,
}) {
  return (
    <FormCardBlock title="Headings">
      <HeadingListWrapper>
        {headings.map((heading, index) => (
          <HeadingRow key={index}>
            <TextField
              fullWidth
              size="small"
              placeholder={`Heading ${index + 1}`}
              value={heading}
              onChange={(e) => onChange(index, e.target.value)}
            />
            {headings.length > 1 && (
              <IconButton
                color="error"
                size="small"
                onClick={() => onRemove(index)}
                sx={{ p: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </HeadingRow>
        ))}
      </HeadingListWrapper>
      <AddHeadingButton
        startIcon={<AddIcon />}
        onClick={onAdd}
        variant="outlined"
        size="small"
      >
        Add Heading
      </AddHeadingButton>
    </FormCardBlock>
  );
}

const HeadingListWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

const HeadingRow = styled(Box)({
  display: "flex",
  gap: 8,
  alignItems: "center",
});

const AddHeadingButton = styled(Button)({
  marginTop: 12,
  alignSelf: "flex-start",
});
