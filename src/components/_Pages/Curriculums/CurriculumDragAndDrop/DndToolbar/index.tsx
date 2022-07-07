import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";

import ViewButton from "./ButtonView";
import ButtonSave from "./ButtonSave";
import ButtonReset from "./ButtonReset";
import ButtonAddYear from "./ButtonAddYear";
import ButtonPreview from "./ButtonPreview";
import ButtonManageYears from "./ButtonManageYears";
import SwitchShowCourseRelationship from "./SwitchShowCourseRelationship";
import { useAppSelector } from "src/hooks/useStore";
import { CurriculumDndType } from "src/constants/curriculum.const";
import ButtonUndo from "./ButtonUndo";
import ButtonRedo from "./ButtonRedo";

const DndToolbar = () => {
  const dndViewMode = useAppSelector((store) => store.curriculums.dndViewMode);

  return (
    <Toolbar
      variant="dense"
      sx={{
        display: "flex",
        gap: 0.5,
        "& hr": {
          mx: 0.5,
        },
      }}
    >
      <Box className="toolbar--left" flexGrow={0}></Box>
      <ViewButton />

      {dndViewMode === CurriculumDndType.DND_BY_COURSE_RELATIONSHIP && (
        <>
          <Divider orientation="vertical" variant="middle" flexItem />
          <ButtonAddYear />
          <ButtonManageYears />
          <SwitchShowCourseRelationship />
        </>
      )}

      <Box className="toolbar--right" flexGrow={1}></Box>
      <ButtonUndo />
      <ButtonRedo />

      <Divider orientation="vertical" variant="middle" flexItem />
      <ButtonPreview />

      <Divider orientation="vertical" variant="middle" flexItem />
      <ButtonReset />
      <ButtonSave />
    </Toolbar>
  );
};

export default DndToolbar;
