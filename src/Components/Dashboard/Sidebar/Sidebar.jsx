import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import {
  Dashboard,
  ExpandLess,
  ExpandMore,
  Article,
  People,
  Home,
  Info,
  School,
  Sports,
  Help,
  Quiz,
  Business,
  Login,
  AdminPanelSettings,
  ManageAccounts,
  CreditScore,
  QueryStats
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useAuth } from "../../../Context/AuthContext";

const pages = [
  { label: "Home", path: "/content/home", icon: <Home /> },
  { label: "About Us", path: "/content/about", icon: <Info /> },
  { label: "Programs", path: "/content/programs", icon: <School /> },
  { label: "Why Us", path: "/content/why-us", icon: <Help /> },
  { label: "Contact Us", path: "/content/contact-us", icon: <Article /> },
  { label: "Interested Schools", path: "/content/schools", icon: <Business /> },
  {
    label: "Become a Coach",
    path: "/content/become-a-coach",
    icon: <Sports />,
  },
  { label: "Coach's Login", path: "/content/coach-login", icon: <Login /> },
  { label: "FAQs", path: "/content/faqs", icon: <Quiz /> },
];

export default function Sidebar() {
  const [contentOpen, setContentOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const isLoggedIn = Boolean(user);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const isContentActive = () => {
    return location.pathname.startsWith("/content");
  };

  useEffect(() => {
    if (isContentActive()) {
      setContentOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("loginName");
    logout({ redirectTo: "/login", showToast: true });
  };

  return (
    <SidebarWrapper>
      <List sx={{ padding: "16px 0" }}>
        {/* Dashboard */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/"
            className={isActive("/") ? "active" : ""}
          >
            <ListItemIcon
              sx={{ color: isActive("/") ? "activeSidebar" : "white" }}
            >
              <Dashboard />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              sx={{
                "& .MuiListItemText-primary": {
                  color: isActive("/") ? "activeSidebar" : "white",
                  fontWeight: isActive("/") ? 600 : 400,
                },
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Content Management */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setContentOpen(!contentOpen)}
            className={isContentActive() ? "active" : ""}
          >
            <ListItemIcon
              sx={{ color: isContentActive() ? "activeSidebar" : "white" }}
            >
              <Article />
            </ListItemIcon>
            <ListItemText
              primary="CMS management"
              sx={{
                "& .MuiListItemText-primary": {
                  color: isContentActive() ? "activeSidebar" : "white",
                  fontWeight: isContentActive() ? 600 : 400,
                },
              }}
            />
            {contentOpen ? (
              <ExpandLess sx={{ color: "activeSidebar" }} />
            ) : (
              <ExpandMore sx={{ color: "white" }} />
            )}
          </ListItemButton>
        </ListItem>

        {/* Subscription Management */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/subscriptions"
            className={isActive("/subscriptions") ? "active" : ""}
          >
            <ListItemIcon
              sx={{
                color: isActive("/subscriptions") ? "activeSidebar" : "white",
              }}
            >
              <CreditScore />
            </ListItemIcon>
            <ListItemText
              primary="Subscriptions"
              sx={{
                "& .MuiListItemText-primary": {
                  color: isActive("/subscriptions") ? "activeSidebar" : "white",
                  fontWeight: isActive("/subscriptions") ? 600 : 400,
                },
              }}
            />
          </ListItemButton>
        </ListItem>

        <Collapse in={contentOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {pages.map((page) => (
              <ListItem key={page.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={page.path}
                  className={isActive(page.path) ? "active" : ""}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(page.path) ? "activeSidebar" : "white",
                      minWidth: 40,
                    }}
                  >
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={page.label}
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: isActive(page.path) ? "activeSidebar" : "white",
                        fontWeight: isActive(page.path) ? 600 : 400,
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* revenue analytics */}

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/revenue-analytics"
            className={isActive("/revenue-analytics") ? "active" : ""}
          >
            <ListItemIcon
              sx={{
                color: isActive("/revenue-analytics")
                  ? "activeSidebar"
                  : "white",
              }}
            >
              <QueryStats />
            </ListItemIcon>
            <ListItemText
              primary="Revenue Analytics"
              sx={{
                "& .MuiListItemText-primary": {
                  color: isActive("/revenue-analytics")
                    ? "activeSidebar"
                    : "white",
                  fontWeight: isActive("/revenue-analytics") ? 600 : 400,
                },
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* User Management */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/users"
            className={isActive("/users") ? "active" : ""}
          >
            <ListItemIcon
              sx={{ color: isActive("/users") ? "activeSidebar" : "white" }}
            >
              <People />
            </ListItemIcon>
            <ListItemText
              primary="Users"
              sx={{
                "& .MuiListItemText-primary": {
                  color: isActive("/users") ? "activeSidebar" : "white",
                  fontWeight: isActive("/users") ? 600 : 400,
                },
              }}
            />
          </ListItemButton>
        </ListItem>
        {/* // permissions */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/permissions"
            className={isActive("/permissions") ? "active" : ""}
          >
            <ListItemIcon
              sx={{
                color: isActive("/permissions") ? "activeSidebar" : "white",
              }}
            >
              <AdminPanelSettings />
            </ListItemIcon>
            <ListItemText
              primary="Permissions"
              sx={{
                "& .MuiListItemText-primary": {
                  color: isActive("/permissions") ? "activeSidebar" : "white",
                  fontWeight: isActive("/permissions") ? 600 : 400,
                },
              }}
            />
          </ListItemButton>
        </ListItem>
        {/* // role */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/role-management"
            className={isActive("/role-management") ? "active" : ""}
          >
            <ListItemIcon
              sx={{
                color: isActive("/role-management") ? "activeSidebar" : "white",
              }}
            >
              <ManageAccounts />
            </ListItemIcon>
            <ListItemText
              primary="Role Management"
              sx={{
                "& .MuiListItemText-primary": {
                  color: isActive("/role-management")
                    ? "activeSidebar"
                    : "white",
                  fontWeight: isActive("/role-management") ? 600 : 400,
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* admin login */}
      <Box sx={{ padding: "0 20px 20px", marginTop: "auto" }}>
        <ListItemButton
          component={isLoggedIn ? "button" : Link}
          to={isLoggedIn ? undefined : "/login"}
          onClick={isLoggedIn ? handleLogout : undefined}
          className={isActive("/login") ? "active" : ""}
          sx={{
            borderRadius: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive("/login") ? "activeSidebar" : "white",
            }}
          >
            <Login />
          </ListItemIcon>
          <ListItemText
            primary={isLoggedIn ? "Logout" : "Login"}
            sx={{
              "& .MuiListItemText-primary": {
                color: isActive("/login") ? "activeSidebar" : "white",
                fontWeight: isActive("/login") ? 600 : 500,
              },
            }}
          />
        </ListItemButton>
      </Box>
    </SidebarWrapper>
  );
}

const SidebarWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.sidebar.bg,
  overflowY: "auto",
  overflowX: "hidden",
  scrollbarWidth: "thin",
  scrollbarColor: `${theme.palette.activeSidebar} ${theme.palette.sidebar.bg}`,

  "&::-webkit-scrollbar": {
    width: "8px",
  },

  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.sidebar.bg,
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.activeSidebar,
    borderRadius: "999px",
  },

  ".MuiListItemButton-root": {
    padding: "12px 20px",
    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor: theme.palette.sidebar.hover,
    },

    "&.active": {
      backgroundColor: theme.palette.sidebar.active,
      borderLeft: `3px solid ${theme.palette.myRed}`,
    },
  },

  ".MuiListItemIcon-root": {
    minWidth: "40px",
  },
}));
