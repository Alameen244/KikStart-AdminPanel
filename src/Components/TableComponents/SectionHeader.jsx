import { Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export default function SectionHeader({
  title,
  createLabel,
  createIcon,
  onCreate,
  selectedCount = 0,
  deleteLabel = "Delete Selected",
  deleteIcon,
  onDeleteSelected,
}) {
  return (
    <HeaderStack direction="row" justifyContent="space-between" alignItems="center">
      <SectionTitle variant="h6">{title}</SectionTitle>

      <HeaderActionStack direction="row" alignItems="center">
        <CreateButton
          variant="contained"
          startIcon={createIcon}
          onClick={onCreate}
        >
          {createLabel}
        </CreateButton>

        {selectedCount > 0 && (
          <DeleteSelectedButton
            variant="outlined"
            color="error"
            startIcon={deleteIcon}
            onClick={onDeleteSelected}
          >
            {deleteLabel}
          </DeleteSelectedButton>
        )}
      </HeaderActionStack>
    </HeaderStack>
  );
}

const HeaderStack = styled(Stack)({
  marginBottom: "16px",
});

const HeaderActionStack = styled(Stack)({
  gap: "12px",
});

const SectionTitle = styled(Typography)({
  fontWeight: 600,
});

const CreateButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.myRed.main,
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.myRed.dark,
  },
}));

const DeleteSelectedButton = styled(Button)({
  textTransform: "none",
});
