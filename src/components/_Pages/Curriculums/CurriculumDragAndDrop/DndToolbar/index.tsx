import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";

import ViewButton from "./ButtonView";
import ExportButton from "./ButtonExport";
import SaveButton from "./ButtonSave";
import RandomButton from "./ButtonRandom";
import ResetButton from "./ButtonReset";
import AddYearButton from "./ButtonAddYear";
import PreviewButton from "./ButtonPreview";
import ButtonManageYears from "./ButtonManageYears";
import SwitchShowCourseRelationship from "./SwitchShowCourseRelationship";
import { useAppSelector } from "src/hooks/useStore";
import { CurriculumDndType } from "src/constants/curriculum.const";
import UndoButton from "./ButtonUndo";
import RedoButton from "./ButtonRedo";

const DndToolbar = () => {
  const dndViewMode = useAppSelector((store) => store.curriculums.dndViewMode);

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
      {/* <Box>
        <ViewButton />
      </Box> */}

      {dndViewMode === CurriculumDndType.DND_BY_COURSE_RELATIONSHIP && (
        <>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Box mr={0.5}>
            <AddYearButton />
          </Box>
          <Box mr={0.5}>
            <ButtonManageYears />
          </Box>
          <Box mr={0.5}>
            <SwitchShowCourseRelationship />
          </Box>
        </>
      )}

      <Box className="toolbar--right" flexGrow={1}></Box>
      <Box>
        <UndoButton />
      </Box>
      <Box>
        <RedoButton />
      </Box>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Box>
        {/* <ExportButton /> */}
        <PreviewButton />
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
