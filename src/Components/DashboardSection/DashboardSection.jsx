import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../Dashboard/Sidebar/Sidebar";
import Footer from "../Dashboard/Footer/Footer";
import Header from "../Dashboard/Header/Header";
import { styled } from "@mui/material/styles";

export default function DashboardSection() {
  return (
    <DashboardSectionWrap>
      <Header />
      <Box sx={{ display: "flex" }}>
        <div className="main-sidebar">
          <Sidebar />
        </div>

        <Box sx={{ flex: 1 }} className="main_body">
          <div className="main_content">
            <Outlet />
          </div>
          <div className="footer">
            <Footer />
          </div>
        </Box>
      </Box>
    </DashboardSectionWrap>
  );
}

const DashboardSectionWrap = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,

  ".main_content": {
    width: "100%",
    minHeight: `calc(100vh - 80px - 60px)`,
    padding: "24px",
    overflowY: "auto",
    marginTop: "80px",
  },

  ".main-sidebar": {
    position: "fixed",
    top: "80px",
    left: 0,
    width: "280px",
    height: `calc(100vh - 80px)`,
    zIndex: 1000,
    backgroundColor: theme.palette.sidebar.bg,
  },

  ".footer": {
    height: "60px",
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  ".main_body": {
    marginLeft: "280px",
    width: `calc(100% - 280px)`,
  },
}));
