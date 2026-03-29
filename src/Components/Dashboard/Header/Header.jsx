import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import kikstartLogo from "../../../assets/KIKSTART.png";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: alpha(theme.palette.common.black, 0.03),
  border: `1px solid ${alpha(theme.palette.common.black, 0.1)}`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.05),
  },
  marginLeft: "auto",
  width: "200px",
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

export default function Header() {
  return (
    <HeaderWrapper position="fixed">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
          <img
            src={kikstartLogo}
            alt="KikStart"
            style={{ height: "50px", cursor: "pointer" }}
          />
        </Box>

        <Search>
          <SearchIconWrapper>
            <SearchIcon fontSize="small" />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
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
