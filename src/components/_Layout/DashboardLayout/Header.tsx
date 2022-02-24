import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import Link from "src/components/_Shared/Link";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Link href="/" underline="none" color="white">
          <Typography variant="h6" noWrap component="div">
            Digi Curriculum
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
