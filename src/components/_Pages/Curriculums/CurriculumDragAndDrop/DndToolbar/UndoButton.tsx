// import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
// import ShuffleIcon from "@mui/icons-material/Shuffle";

import { useAppDispatch } from "src/hooks/useStore";

import { undoChange } from "src/redux/_thunks/curriculumDetailChangeHistory.thunk";

const UndoButton = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(undoChange());
  };

  return (
    <>
      <Button
        size="small"
        color="info"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Undo
      </Button>
    </>
  );
};

export default UndoButton;
