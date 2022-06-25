import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";

import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { setModalManageYears } from "src/redux/curriculums.slice";
import { commitChangeToHistory } from "src/redux/curriculumChangeHistory.slice";
import { CurriculumCommandType } from "src/constants/curriculum.const";

const ModalManageYears = () => {
  const isOpen = useAppSelector(
    (store) => store.curriculums.modalManageYears.isOpen
  );
  const allYears = useAppSelector(
    (state) => state.curriculums.curriculumDetail.allYears
  );
  const allYearsOrder = useAppSelector(
    (store) => store.curriculums.curriculumDetail.allYearsOrder
  );
  const dispatch = useAppDispatch();

  const [yearsOrderTemp, setYearsOrderTemp] = useState<number[]>([]);

  useMemo(() => {
    setYearsOrderTemp(allYearsOrder.map((yearId, yearIndex) => yearIndex));
  }, [allYearsOrder.length, isOpen]);

  const closeModal = () => {
    dispatch(setModalManageYears({ isOpen: false }));
  };

  const handleMoveUpYear = (yearId: string, yearIndex: number) => {
    dispatch(
      commitChangeToHistory({
        type: CurriculumCommandType.CHANGE_YEAR_ORDER,
        patch: {
          yearId,
          sourceTakeoutIndex: yearIndex,
          targetInsertIndex: yearIndex - 1,
        },
      })
    );

    let newYearsOrderTemp = [...yearsOrderTemp];
    let temp = newYearsOrderTemp[yearIndex];
    newYearsOrderTemp[yearIndex] = newYearsOrderTemp[yearIndex - 1];
    newYearsOrderTemp[yearIndex - 1] = temp;
    setYearsOrderTemp([...newYearsOrderTemp]);
  };

  const handleMoveDownYear = (yearId: string, yearIndex: number) => {
    dispatch(
      commitChangeToHistory({
        type: CurriculumCommandType.CHANGE_YEAR_ORDER,
        patch: {
          yearId,
          sourceTakeoutIndex: yearIndex,
          targetInsertIndex: yearIndex + 1,
        },
      })
    );

    let newYearsOrderTemp = [...yearsOrderTemp];
    let temp = newYearsOrderTemp[yearIndex];
    newYearsOrderTemp[yearIndex] = newYearsOrderTemp[yearIndex + 1];
    newYearsOrderTemp[yearIndex + 1] = temp;
    setYearsOrderTemp([...newYearsOrderTemp]);
  };

  const handleRemoveYear = (yearId: string, yearIndex: number) => {
    dispatch(
      commitChangeToHistory({
        type: CurriculumCommandType.REMOVE_YEAR,
        patch: {
          yearId,
          yearIndex,
          yearDetail: allYears[yearId],
        },
      })
    );
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} keepMounted={true}>
      <DialogTitle>
        <IconButton onClick={closeModal}>
          <CloseIcon />
        </IconButton>
        Manage Years
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1} direction="column">
          {yearsOrderTemp.map((yearId, yearIndex) => (
            <Box display="flex" alignItems="center" key={yearId}>
              <Typography fontWeight="bold">#{yearIndex + 1}</Typography>
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mx: (theme) => theme.spacing(2),
                  px: (theme) => theme.spacing(2),
                  width: (theme) => theme.spacing(32),
                }}
              >
                <Typography> Year {yearsOrderTemp[yearIndex] + 1}</Typography>
                <Box>
                  <IconButton
                    aria-label="move-up"
                    disabled={yearIndex === 0}
                    onClick={() =>
                      handleMoveUpYear(allYearsOrder[yearIndex], yearIndex)
                    }
                  >
                    <KeyboardArrowUpIcon />
                  </IconButton>
                  <IconButton
                    aria-label="move-down"
                    disabled={yearIndex === allYearsOrder.length - 1}
                    onClick={() =>
                      handleMoveDownYear(allYearsOrder[yearIndex], yearIndex)
                    }
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() =>
                      handleRemoveYear(allYearsOrder[yearIndex], yearIndex)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="inherit" onClick={closeModal}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalManageYears;
