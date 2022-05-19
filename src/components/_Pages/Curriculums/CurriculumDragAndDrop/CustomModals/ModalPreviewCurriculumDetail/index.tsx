import { useRef, forwardRef } from "react";
import { ReflexContainer, ReflexElement } from "react-reflex";
import { useElementSize } from "usehooks-ts";
// import { Canvg } from "canvg";
import FileSaver from "file-saver";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";

import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
// import { addCourseRelationship } from "src/redux/courses.slice";
import { setModalPreviewCurriculumDetail } from "src/redux/curriculums.slice";
import { getDotDiagramString } from "src/helper/diagramGenerator/dotDiagram";
import CurriculumAfter from "./CurriculumAfter";
import DiagramDot from "../../DiagramPane/DiagramDot";
// import { CourseRelationship } from "src/constants/course.const";

const ModalAddCourseRelationship = () => {
  const curriculumDetail = useAppSelector(
    (store) => store.curriculums.curriculumDetail
  );
  const courses = useAppSelector((store) => store.courses.courses);
  const { allYears, allYearsOrder } = curriculumDetail;

  const [squareRef, { width, height }] = useElementSize();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (store) => store.curriculums.modalPreviewCurriculumDetail.isOpen
  );

  const closeModal = () => {
    dispatch(setModalPreviewCurriculumDetail({ isOpen: false }));
  };

  const exportToDot = async () => {
    const dotString = await getDotDiagramString({
      allCourses: courses,
      allYears,
      allYearIdsOrder: allYearsOrder,
    });

    const blob = new Blob([dotString], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, "curriculum.dot");
  };

  const exportToImage = () => {
    // if (
    //   document &&
    //   document.getElementById("curriculum-detail-preview") !== null
    // ) {
    //   console.log(
    //     document
    //       .getElementById("curriculum-detail-preview")
    //       .getElementsByTagName("svg")[0]
    //   );
    //   // saveSvgAsPng(
    //   //   document
    //   //     .getElementById("curriculum-detail-preview")
    //   //     .getElementsByTagName("svg")[0],
    //   //   "diagram.png",
    //   //   { scale: 1.0 }
    //   // );
    // }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      keepMounted={true}
      fullScreen

      // fullWidth
    >
      <DialogTitle>
        <IconButton onClick={closeModal}>
          <CloseIcon />
        </IconButton>
        Preview
      </DialogTitle>
      <DialogContent ref={squareRef}>
        {/* <ReflexContainer orientation="vertical">
          <ReflexElement className="left-pane" minSize={300}>
            <CurriculumAfter  />
          </ReflexElement>
          <ReflexElement className="right-pane" minSize={300}>
            <CurriculumAfter />
          </ReflexElement>
        </ReflexContainer> */}
        <DiagramDot />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          // disabled={true}
          onClick={exportToDot}
        >
          Export To DOT
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={true}
          onClick={exportToImage}
        >
          Export To Image
        </Button>
        <Button variant="contained" color="inherit" onClick={closeModal}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddCourseRelationship;
