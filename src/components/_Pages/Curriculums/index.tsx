import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import Link from "src/components/_Shared/Link";

const Curriculums = () => {
  return (
    <Box>
      <Toolbar disableGutters>
        <Link href="curriculums/new" type="button">
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            color="success"
            size="large"
          >
            New
          </Button>
        </Link>
        <Link href="curriculums/:id/edit" type="button">
          <Button
            variant="contained"
            endIcon={<EditIcon />}
            color="info"
            size="large"
          >
            Edit
          </Button>
        </Link>
      </Toolbar>
      <Box>
        <Typography paragraph>Curriculum page content</Typography>
      </Box>
    </Box>
  );
};

export default Curriculums;
