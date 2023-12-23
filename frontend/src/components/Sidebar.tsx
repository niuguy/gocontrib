import {
  ExploreOutlined,
  TaskOutlined
} from "@mui/icons-material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Box from "@mui/joy/Box";
import GlobalStyles from "@mui/joy/GlobalStyles";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

import { NavLink } from "react-router-dom";
import { closeSidebar } from "../utils";

export default function SideBar() {
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: {
          xs: "fixed",
          md: "sticky",
        },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "180px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "200px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          marginTop: "20px",
          marginLeft: "20px",
        }}
      >
        {/* <IconButton variant="soft" color="neutral" size="md">
          <WorkspacePremiumOutlined />
        </IconButton> */}
        <Typography level="title-lg" fontFamily="Anton">
          ContribPlus
        </Typography>
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <NavLink to="/repos">
              <ListItemButton>
                <ExploreOutlined />
                <ListItemContent>
                  <Typography level="title-sm">Explore</Typography>
                </ListItemContent>
              </ListItemButton>
            </NavLink>
          </ListItem>

          <ListItem>
            <NavLink to="/tasks">
              <ListItemButton>
                <TaskOutlined />
                <ListItemContent>
                  <Typography level="title-sm">Tasks</Typography>
                </ListItemContent>
              </ListItemButton>
            </NavLink>
          </ListItem>
        </List>

        <List
          size="sm"
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            "--List-gap": "8px",
            mb: 2,
          }}
        >
          <ListItem>
            <NavLink to="/setting">
              <ListItemButton>
                <SettingsRoundedIcon />
                Settings
              </ListItemButton>
            </NavLink>
          </ListItem>
        </List>
      </Box>
    </Sheet>
  );
}
