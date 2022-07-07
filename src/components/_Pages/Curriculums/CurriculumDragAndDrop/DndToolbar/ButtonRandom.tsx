import type { FC } from "react";
import type { ButtonProps } from "@mui/material/Button";

import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import ShuffleIcon from "@mui/icons-material/Shuffle";

import { useAppDispatch } from "src/hooks/useStore";

import { loadRandomCoursesAndCurriculums } from "src/redux/_thunks/coursesCurriculums.thunk";
// import { setModalRandomCurriculums } from "src/redux/curriculums.slice";

const ButtonRandom: FC<ButtonProps> = (props) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(loadRandomCoursesAndCurriculums());
    // dispatch(setModalRandomCurriculums({ isOpen: true }));
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
        startIcon={<ShuffleIcon />}
        onClick={handleClick}
      >
        Random Data
      </Button>
    </>
  );
};

export default ButtonRandom;
