import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";

import Link from "src/components/_Shared/Link";

const drawerWidth = 240;

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <Link href="/" underline="none">
            <ListItem button key={"dashboard"}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <Link href="/courses" underline="none">
            <ListItem button key={"courses"}>
              <ListItemIcon>
                <LocalLibraryIcon />
              </ListItemIcon>
              <ListItemText primary={"Courses"} />
            </ListItem>
          </Link>
          <Link href="/faculties" underline="none">
            <ListItem button key={"courses"}>
              <ListItemIcon>
                <WorkOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={"Faculty"} />
            </ListItem>
          </Link>
          <Link href="/curriculums" underline="none">
            <ListItem button key={"curriculums"}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Curriculums"} />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <Link href="/statistics" underline="none">
            <ListItem button key={"statistics"}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary={"Statistics"} />
            </ListItem>
          </Link>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
