import { useState } from "react";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";

import { useAppDispatch } from "src/hooks/useStore";
import { setModalManageYears } from "src/redux/curriculums.slice";

const ButtonManageYears = () => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    dispatch(setModalManageYears({ isOpen: true }));
  };
  const handleClose = () => {
    setAnchorEl(null);
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
          },
        })}
        aria-haspopup="true"
        onClick={handleClick}
      >
        Manage Years
      </Button>
    </>
  );
};

export default ButtonManageYears;
