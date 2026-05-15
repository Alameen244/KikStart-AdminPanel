import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../../frontEnd/src/Context/AuthContext";
import kikstartLogo from "../../../assets/KIKSTART.png";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: alpha(theme.palette.common.black, 0.03),
  border: `1px solid ${alpha(theme.palette.common.black, 0.1)}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.05),
  },
  width: "220px",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.semiDark,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.semiDark,
  width: "100%",
  fontSize: "0.875rem",
  "& .MuiInputBase-input": {
    padding: "6px 6px 6px 0",
    paddingLeft: `calc(1em + ${theme.spacing(2)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    "&:focus": {
      width: "100%",
    },
  },
}));

const RightSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginLeft: "auto",
});

const AccountCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "8px 12px",
  borderRadius: "16px",
  textDecoration: "none",
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.06)",
  transition: "all 0.25s ease",
  cursor: "pointer",

  "&:hover": {
    background: "#fafafa",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    transform: "translateY(-1px)",
  },
}));

const AccountMeta = styled(Box)({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
});

const getInitials = (name = "", email = "") => {
  const source = name || email || "A";
  const parts = source.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
};

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const displayName = user?.name || "Admin";
  const displayRole =
    user?.role === "superAdmin"
      ? "Super Admin"
      : user?.role === "subAdmin"
        ? "Sub Admin"
        : "Administrator";
  const isGoogleUser = user?.profileImage?.public_id === "google-oauth";

  const profileImage = isGoogleUser ? user?.profileImage?.url : undefined;
  return (
    <HeaderWrapper position="fixed">
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <img
            src={kikstartLogo}
            alt="KikStart"
            style={{ height: "50px", cursor: "pointer" }}
          />
        </Box>

        <RightSection>
          <Search>
            <SearchIconWrapper>
              <SearchIcon fontSize="small" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          {isAuthenticated && user ? (
            <>
              <AccountCard component={Link} to="/">
                <Avatar
                  src={profileImage || undefined}
                  alt={displayName}
                  sx={{
                    width: 48,
                    height: 48,
                    border: "2px solid #ED1C24",
                    boxShadow: "0 4px 12px rgba(237, 28, 36, 0.18)",
                    fontWeight: 700,
                    bgcolor: "#111",
                  }}
                >
                  {getInitials(displayName, user?.email)}
                </Avatar>

                <AccountMeta>
                  <Typography
                    sx={{
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      color: "#ED1C24",
                      textTransform: "uppercase",
                      lineHeight: 1,
                    }}
                  >
                    Account
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      lineHeight: 1.2,
                    }}
                  >
                    {displayName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "#777",
                      fontWeight: 500,
                    }}
                  >
                    {displayRole}
                  </Typography>
                </AccountMeta>
              </AccountCard>
            </>
          ) : (
            <AccountCard component={Link} to="/login">
              <Avatar
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: alpha("#ED1C24", 0.12),
                  color: "#ED1C24",
                  fontWeight: 800,
                }}
              >
                {isLoading ? "..." : "?"}
              </Avatar>

              <AccountMeta>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    color: "error.main",
                  }}
                >
                  YOUR ACCOUNT
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1.2,
                  }}
                >
                  {isLoading ? "Checking session..." : "Sign in to continue"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    color: "text.secondary",
                  }}
                >
                  {isLoading
                    ? "Fetching your profile"
                    : "Access your dashboard, roles and permissions"}
                </Typography>
              </AccountMeta>
            </AccountCard>
          )}
        </RightSection>
      </Toolbar>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  height: "80px",
  zIndex: 1100,
}));
