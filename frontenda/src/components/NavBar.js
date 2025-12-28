import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import InfoIcon from "@mui/icons-material/Info";
import CreateIcon from "@mui/icons-material/Create";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../context/useAuth";

function NavBar(props) {
  const { drawerWidth, content } = props;
  const location = useLocation();
  const path = location.pathname;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const changeOpenStatus = () => setOpen(!open);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const myDrawer = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/" selected={"/" === path}>
              <ListItemIcon>
                <HomeFilledIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          {user?.role === "admin" && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/tests/"
                  selected={"/tests/" === path}
                >
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tests" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/patients"
                  selected={"/patients" === path}
                >
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary="Users" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/consultations"
                  selected={"/consultations" === path}
                >
                  <ListItemIcon>
                    <CreateIcon />
                  </ListItemIcon>
                  <ListItemText primary="Consultations" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/bookings"
                  selected={"/bookings" === path}
                >
                  <ListItemIcon>
                    <CreateIcon />
                  </ListItemIcon>
                  <ListItemText primary="Bookings" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/available-slots"
                  selected={"/available-slots" === path}
                >
                  <ListItemIcon>
                    <CreateIcon />
                  </ListItemIcon>
                  <ListItemText primary="Time Slots" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {user?.role === "patient" && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/my-bookings"
                  selected={"/my-bookings" === path}
                >
                  <ListItemIcon>
                    <CreateIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Bookings" />
                </ListItemButton>
              </ListItem>
            </>
          )}

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
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={changeOpenStatus}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {myDrawer}
      </Drawer>

      <Drawer
        variant="temporary"
        open={open}
        onClose={changeOpenStatus}
        sx={{
          display: { xs: "block", sm: "none" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {myDrawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}

export default NavBar;
