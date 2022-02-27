import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import ViewDiagramButton from "./ViewDiagramButton";
import ExportButton from "./ExportButton";

const DndToolbar = () => {
  return (
    <Toolbar variant="dense">
      <Box>
        <ViewDiagramButton />
      </Box>
      <Box>
        <ExportButton />
      </Box>
    </Toolbar>
  );
};

export default DndToolbar;
