import type { FC } from "react";

import { memo, useCallback } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";
import { useAppDispatch } from "src/hooks/useStore";
import { setModalAddCourse } from "src/redux/curriculums.slice";

const configCourseTile = style.courseTile;

interface IAddCourseNodeProps {
  data: {
    yearId: string;
    semId: string;
  };
}

const AddCourseNode: FC<IAddCourseNodeProps> = ({
  data: { yearId, semId },
}) => {
  const dispatch = useAppDispatch();

  // const onChange = useCallback((evt) => {
  //   console.log(evt.target.value);
  // }, []);

  const openModalAddCourse = () => {
    dispatch(
      setModalAddCourse({
        isOpen: true,
        yearId,
        semId,
      })
    );
  };

  return (
    <Button
      variant="contained"
      color="inherit"
      onClick={openModalAddCourse}
      sx={(theme) => ({
        width: theme.spacing(configCourseTile.width),
        // backgroundColor: "rgb(25, 118, 210)",
      })}
    >
      <AddIcon  />
    </Button>
  );
};

export default memo(AddCourseNode);
