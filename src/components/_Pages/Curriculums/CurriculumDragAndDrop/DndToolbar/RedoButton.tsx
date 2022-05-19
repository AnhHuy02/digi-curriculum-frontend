// import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
// import ShuffleIcon from "@mui/icons-material/Shuffle";

import { useAppDispatch } from "src/hooks/useStore";

import { redoChange } from "src/redux/_thunks/curriculumDetailChangeHistory.thunk";

const RedoButton = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(redoChange());
  };

  return (
    <>
      <Button
        size="small"
        color="info"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Redo
      </Button>
    </>
  );
};

export default RedoButton;
