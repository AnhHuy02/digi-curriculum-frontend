import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import Link from "src/components/_Shared/Link";

const Header = () => {
  return (
    <AppBar position="static" elevation={0} className={"page-layout__header"}>
      <Toolbar variant="dense">
        <Typography variant="h6" noWrap component="div" flexGrow={1}>
          <Link href="/" underline="none" color="white">
            Digital Curriculum
          </Link>
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
