import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { setModalCourseDetail } from "src/redux/curriculums.slice";

const ModalCourseDetail = () => {
  const isOpen = useAppSelector(
    (store) => store.curriculums.modalCourseDetail.isOpen
  );
  const courseId = useAppSelector(
    (store) => store.curriculums.modalCourseDetail.courseId
  );
  const courseDetail = useAppSelector((store) =>
    courseId ? store.courses.courses[courseId as string] : null
  );
  const majors = useAppSelector((store) => store.courses.majors);
  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(setModalCourseDetail({ isOpen: false }));
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} keepMounted={true}>
      <DialogTitle>
        <IconButton onClick={closeModal}>
          <CloseIcon />
        </IconButton>
        Course Detail
      </DialogTitle>
      <DialogContent>
        {courseDetail && (
          <Stack spacing={1} direction="column">
            <Box>
              <Typography variant="body1">
                ID: <b>{courseDetail.id}</b>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                Name: <b>{courseDetail.name}</b>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                Major: <b>{majors[courseDetail.majorId].name}</b>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                Type: <b>{courseDetail.type}</b>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">Credit:</Typography>
              <ul>
                <li>
                  <Typography variant="body1">
                    Theory: <b>{courseDetail.credit.theory}</b>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Practice: <b>{courseDetail.credit.practice}</b>
                  </Typography>
                </li>
              </ul>
            </Box>
            <Box>
              <Typography component="legend">Difficulty:</Typography>
              <Box display="flex" alignItems="center">
                <Rating
                  value={courseDetail.difficulty}
                  precision={0.1}
                  readOnly
                />
                <Box sx={{ ml: 2 }}>
                  <b>{courseDetail.difficulty.toFixed(1)} / 5.0</b>
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography component="legend">Rating:</Typography>
              <Box display="flex" alignItems="center">
                <Rating value={courseDetail.rating} precision={0.1} readOnly />
                <Box sx={{ ml: 2 }}>
                  <b>{courseDetail.rating.toFixed(1)} / 5.0</b>
                </Box>
              </Box>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="inherit" onClick={closeModal}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCourseDetail;
