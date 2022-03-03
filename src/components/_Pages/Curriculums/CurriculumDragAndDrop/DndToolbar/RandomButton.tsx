import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import ShuffleIcon from "@mui/icons-material/Shuffle";

import { generateRandomCourses } from "src/helper/mockDataGenerator/courses";

const RandomButton = () => {
  const handleClick = () => {
    // console.log(generateRandomCourses());
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
