import Button from "@mui/material/Button";

import { useAppDispatch, useAppSelector } from "src/hooks/useStore";

import { redoChange } from "src/redux/_thunks/curriculumDetailChangeHistory.thunk";

const RedoButton = () => {
  const dispatch = useAppDispatch();

  const commandLogsLength = useAppSelector(
    (store) =>
      store.curriculums.curriculumDetail.changeHistory.commandLogs.length
  );

  const currentIndex = useAppSelector(
    (store) => store.curriculums.curriculumDetail.changeHistory.currentIndex
  );

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
        disabled={currentIndex >= commandLogsLength - 1}
      >
        Redo
      </Button>
    </>
  );
};

export default RedoButton;
