import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

// import SearchForm from "./SearchForm";
import CourseList from "./CourseList";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { addCourses } from "src/redux/courses.slice";
import {
  setModalAddCourse,
  addCurriculumDetailCourses,
} from "src/redux/curriculums.slice";

const ModalAddCourse = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (store) => store.curriculums.modalAddCourse.isOpen
  );
  const yearId = useAppSelector(
    (store) => store.curriculums.modalAddCourse.yearId
  );
  const semId = useAppSelector(
    (store) => store.curriculums.modalAddCourse.semId
  );
  const allCourses = useAppSelector((store) => store.courses.courses);
  const allCourseIds = useAppSelector((store) => store.courses.courseIds);

  const closeModal = () => {
    dispatch(setModalAddCourse({ isOpen: false }));
  };

  const handleConfirm = () => {
    if (yearId && semId) {
      const courseIdsTemp = allCourseIds.filter(
        (courseId) => allCourses[courseId].selectedTemp === true
      );
      closeModal();
      dispatch(
        addCurriculumDetailCourses({ yearId, semId, courseIds: courseIdsTemp })
      );
      dispatch(addCourses());
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      scroll={`paper`}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      keepMounted={true}
    >
      <DialogTitle id="scroll-dialog-title">Add Courses</DialogTitle>
      <DialogContent>
        <Box padding={2} bgcolor={"rgba(255,255,255,0.5)"}>
          Search Box component
        </Box>
        <Box padding={2}>
          <CourseList />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color={`primary`} onClick={closeModal}>
          Cancel
        </Button>
        <Button color={`primary`} onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddCourse;
