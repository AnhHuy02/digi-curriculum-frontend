import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";

import ViewDiagramButton from "./ViewDiagramButton";
import ExportButton from "./ExportButton";

const DndToolbar = () => {
  return (
    <Toolbar
      variant="dense"
      sx={{
        display: "flex",
        "& hr": {
          mx: 1,
        },
      }}
    >
      <Box>
        <ViewDiagramButton />
      </Box>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Box>
        <ExportButton />
      </Box>
    </Toolbar>
  );
};

export default DndToolbar;
