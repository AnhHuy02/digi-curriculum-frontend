import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import ShuffleIcon from "@mui/icons-material/Shuffle";

import { useAppDispatch } from "src/hooks/useStore";

import { initRandomCurriculumDetailPageData } from "src/redux/_thunks/coursesCurriculums.thunk";

const RandomButton = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(initRandomCurriculumDetailPageData());
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
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

export default RandomButton;
