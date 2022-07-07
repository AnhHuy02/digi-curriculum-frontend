import type { FC } from "react";
import type { ButtonProps } from "@mui/material/Button";

import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";

import { useAppDispatch } from "src/hooks/useStore";

import { loadSampleCoursesAndCurriculums } from "src/redux/_thunks/coursesCurriculums.thunk";

const ButtonLoadSampleData: FC<ButtonProps> = (props) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(loadSampleCoursesAndCurriculums());
  };

  return (
    <>
      <Button
        {...props}
        size={props.size || "small"}
        variant={props.variant || "outlined"}
        sx={(theme) => ({
          borderColor: grey["A200"],
          bgcolor: grey["A200"],
          color: "black",
          ":hover": {
            borderColor: grey["A400"],
            bgcolor: grey["A400"],
            // color: "white",
          },
        })}
        aria-haspopup="true"
        startIcon={<TaskOutlinedIcon />}
        onClick={handleClick}
      >
        Load Sample Data
      </Button>
    </>
  );
};

export default ButtonLoadSampleData;
