import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// MUI Imports
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

// Icon Imports
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BiotechIcon from "@mui/icons-material/Biotech"; // Tests
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"; // Doctors
import BookOnlineIcon from "@mui/icons-material/BookOnline"; // My Bookings
import DescriptionIcon from "@mui/icons-material/Description"; // Reports

// Width for the mobile drawer
const DRAWER_WIDTH = 240;

// Navigation items
const navItems = [
  { text: "Tests", path: "/tests", icon: <BiotechIcon /> },
  { text: "Doctors", path: "/doctors", icon: <MedicalServicesIcon /> },
  { text: "My Bookings", path: "/my-bookings", icon: <BookOnlineIcon /> },
  { text: "Reports", path: "/reports", icon: <DescriptionIcon /> },
];

function NavBar(props) {
  const { content } = props;
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Toggle for mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // Logout handler
  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  // Content for the mobile drawer
  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      {/* Mobile Logo */}
      <Typography
        variant="h6"
        sx={{ my: 2, fontWeight: "bold" }}
        component={Link}
        to="/"
        color="inherit"
        style={{ textDecoration: "none" }}
      >
        InfiniteClinic
      </Typography>

      <List>
        {/* Page links */}
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Profile Link */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/home">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>

        {/* Logout Button */}
        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Application Bar */}
      <AppBar
        component="nav"
        position="fixed"
        sx={{
          bgcolor: "#fff", // White background
          color: "#000", // Black text/icons
          borderBottom: "1px solid #e0e0e0", // Subtle border
          boxShadow: "none", // Modern flat look
        }}
      >
        <Toolbar>
          {/* Mobile Hamburger Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Left Side Logo (visible on all sizes) */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            InfiniteClinic
          </Typography>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  color: "inherit",
                  textTransform: "none",
                  fontSize: "1rem",
                  mx: 1,
                }}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            ))}

            {/* Desktop Profile & Logout */}
            <IconButton component={Link} to="/home" color="inherit">
              <AccountCircleIcon />
            </IconButton>

            {user && (
              <IconButton onClick={handleLogout} color="inherit">
                <LogoutIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation component (for mobile drawer) */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MiuDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
        {/* This Toolbar adds the necessary space to push content below the AppBar */}
        <Toolbar />

        {/* Your page content (e.g., <CTS />) will be rendered here */}
        {content}
      </Box>
    </Box>
  );
}

export default NavBar;
