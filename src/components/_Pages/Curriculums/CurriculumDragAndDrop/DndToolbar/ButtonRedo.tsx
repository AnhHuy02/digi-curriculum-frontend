import Button from "@mui/material/Button";

import { useAppDispatch, useAppSelector } from "src/hooks/useStore";

import { redoChange } from "src/redux/curriculumChangeHistory.slice";

const ButtonRedo = () => {
  const dispatch = useAppDispatch();

  const commandLogsLength = useAppSelector(
    (store) => store.curriculumChangeHistory.changeHistory.commandLogs.length
  );

  const currentIndex = useAppSelector(
    (store) => store.curriculumChangeHistory.changeHistory.currentIndex
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

export default ButtonRedo;
