import type { FC } from "react";

import { memo, useCallback } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

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
        margin: theme.spacing(configCourseTile.margin),
        width: theme.spacing(configCourseTile.width),
        padding: theme.spacing(configCourseTile.padding),
      })}
    >
      <AddIcon />
    </Button>
  );
};

export default memo(AddCourseNode);
