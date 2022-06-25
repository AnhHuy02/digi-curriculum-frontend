import { useState } from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { setShowCourseRelationship } from "src/redux/curriculums.slice";

const PreviewButton = () => {
  const dispatch = useAppDispatch();
  const showCourseRelationship = useAppSelector(
    (store) => store.curriculums.showCourseRelationship
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleChange = (checked: boolean) => {
    dispatch(setShowCourseRelationship(checked));
  };

  return (
    <>
      <FormControlLabel
        control={<Switch />}
        label="Show Relationship"
        defaultChecked={false}
        checked={showCourseRelationship}
        onChange={(_event, checked) => handleChange(checked)}
        labelPlacement="start"
      />
    </>
  );
};

export default PreviewButton;
