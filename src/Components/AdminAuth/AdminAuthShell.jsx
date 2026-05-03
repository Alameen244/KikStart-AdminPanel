import { Box, Container } from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import { theme as frontendTheme } from "../../../../frontEnd/src/theme";
import SignUpPic from "../../../../frontEnd/src/Components/Auth/signUpPic/SignUpPic";

const AuthShellWrapper = styled(Box)({
  minHeight: "100vh",
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#FFF8F8",
  "& .LoginForm": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  "& .imageBox": {
    maxWidth: "204px",
    maxHeight: "89px",
    marginBottom: "45px",
  },
  "& .Headings": {
    display: "flex",
    flexDirection: "column",
    marginBottom: "30px",
  },
  "& .forgotText": {
    display: "block",
    fontFamily: "Noto Sans",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 15,
    color: "#ED1C24",
    width: "500px",
    textAlign: "left",
    margin: "17px 0 24px",
    textDecoration: "none",
  },
});

const ContainerBox = styled(Container)({
  paddingLeft: "30px",
  paddingRight: "30px",
  paddingTop: "30px",
  display: "flex",
  alignItems: "center",
  gap: "145px",
  "@media (max-width: 1199px)": {
    gap: "64px",
  },
  "@media (max-width: 959px)": {
    paddingTop: "40px",
    paddingBottom: "40px",
    justifyContent: "center",
  },
});

export default function AdminAuthShell({
  children,
  showIllustration = true,
  bottomNote,
}) {
  return (
    <ThemeProvider theme={frontendTheme}>
      <AuthShellWrapper>
        <ContainerBox maxWidth="xl" disableGutters>
          {showIllustration && (
            <Box sx={{ flexShrink: 0, display: { xs: "none", md: "block" } }}>
              <SignUpPic bottomNote={bottomNote} />
            </Box>
          )}
          <Box sx={{ width: "620px", maxWidth: "100%", flexShrink: 0, mx: { xs: "auto", md: 0 } }}>
            {children}
          </Box>
        </ContainerBox>
      </AuthShellWrapper>
    </ThemeProvider>
  );
}
