import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { setModalRandomCurriculums } from "src/redux/curriculums.slice";

const NUMBER_OF_YEARS = Array.from({ length: 8 }, (_, index) => ({
  value: index,
  label: String(index),
}));

const ModalRandomCurriculums = () => {
  const isOpen = useAppSelector(
    (store) => store.curriculums.modalRandomCurriculums.isOpen
  );

  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(setModalRandomCurriculums({ isOpen: false }));
  };

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    // console.log(newValue);
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} keepMounted={true}>
      <DialogTitle>
        <IconButton onClick={closeModal}>
          <CloseIcon />
        </IconButton>
        Random Configuration
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={6} sx={{ pt: 5 }}>
          {/* <Box>
            <Slider
              aria-label="Number of years"
              getAriaValueText={(value: number, index: number) =>
                `asdasd-${value}`
              }
              defaultValue={[1, 4]}
              valueLabelDisplay="auto"
              marks={NUMBER_OF_YEARS}
              step={1}
              min={0}
              max={NUMBER_OF_YEARS.length - 1}
              onChange={handleChange}
            />
          </Box>
          <Box>
            <Slider
              aria-label="Number of years"
              getAriaValueText={(value: number, index: number) =>
                `asdasd-${value}`
              }
              defaultValue={[1, 4]}
              valueLabelDisplay="auto"
              marks={NUMBER_OF_YEARS}
              step={1}
              min={0}
              max={NUMBER_OF_YEARS.length - 1}
              onChange={handleChange}
            />
          </Box> */}
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

export default ModalRandomCurriculums;
