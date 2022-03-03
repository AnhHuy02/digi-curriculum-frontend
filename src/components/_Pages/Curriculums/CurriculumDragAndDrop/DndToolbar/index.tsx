import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";

import ViewButton from "./ViewButton";
import ExportButton from "./ExportButton";
import SaveButton from "./SaveButton";
import RandomButton from "./RandomButton";
import ResetButton from "./ResetButton";

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
      <Box className="toolbar--left" flexGrow={0}></Box>
      <Box mr={0.5}>
        <RandomButton />
      </Box>
      <Box>
        <ViewButton />
      </Box>

      <Box className="toolbar--right" flexGrow={1}></Box>
      <Box>
        <ExportButton />
      </Box>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Box mr={0.5}>
        <ResetButton />
      </Box>
      <Box>
        <SaveButton />
      </Box>
    </Toolbar>
  );
};

export default DndToolbar;
