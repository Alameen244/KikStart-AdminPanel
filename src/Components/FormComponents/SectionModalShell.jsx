import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

export default function SectionModalShell({
  open,
  onClose,
  title,
  submitLabel,
  onSubmit,
  isSubmitting = false,
  children,
}) {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <StyledDialogTitle>
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </StyledDialogTitle>

      <StyledDialogContent>{children}</StyledDialogContent>

      <StyledDialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          size="small"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          size="small"
          disabled={isSubmitting}
        >
          {submitLabel}
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
}

const StyledDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    borderRadius: 8,
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: 8,
});

const StyledDialogContent = styled(DialogContent)({
  paddingTop: 16,
  paddingBottom: 16,
});

const StyledDialogActions = styled(DialogActions)({
  paddingLeft: 24,
  paddingRight: 24,
  paddingBottom: 16,
});
