import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { addCourseRelationship } from "src/redux/courses.slice";
import { setModalAddCourseRelationship } from "src/redux/courses.slice";
import { CourseRelationship } from "src/constants/course.const";

const ModalAddCourseRelationship = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (store) => store.courses.modalAddCourseRelationship.isOpen
  );
  const courseSourceId = useAppSelector(
    (store) => store.courses.modalAddCourseRelationship.courseSourceId
  );
  const courseTargetId = useAppSelector(
    (store) => store.courses.modalAddCourseRelationship.courseTargetId
  );

  const closeModal = () => {
    dispatch(setModalAddCourseRelationship({ isOpen: false }));
  };

  const handleAddCourseRelationship = (relationship: CourseRelationship) => {
    if (courseSourceId !== null && courseTargetId !== null) {
      dispatch(
        addCourseRelationship({
          courseSourceId,
          courseTargetId,
          relationship,
        })
      );
    }
    closeModal();
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} keepMounted={true}>
      <DialogTitle>Add Courses Relationship</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          <ListItem
            button
            onClick={() =>
              handleAddCourseRelationship(CourseRelationship.PREREQUISITE)
            }
          >
            <ListItemText primary="Prerequisite" />
          </ListItem>
          <ListItem
            button
            onClick={() =>
              handleAddCourseRelationship(CourseRelationship.COREQUISITE)
            }
          >
            <ListItemText primary="Corequisite" />
          </ListItem>
          <ListItem
            button
            onClick={() =>
              handleAddCourseRelationship(CourseRelationship.PREVIOUS)
            }
          >
            <ListItemText primary="Previous" />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddCourseRelationship;
