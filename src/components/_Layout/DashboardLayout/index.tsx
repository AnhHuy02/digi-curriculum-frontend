import type { FC } from "react";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface IDashboardLayout {
  children?: JSX.Element;
}

const DashboardLayout: FC<IDashboardLayout> = (props) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
