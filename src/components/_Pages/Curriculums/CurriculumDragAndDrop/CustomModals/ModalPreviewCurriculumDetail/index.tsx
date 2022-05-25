import { SyntheticEvent, useState } from "react";
// import { Canvg } from "canvg";
import FileSaver from "file-saver";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useElementSize } from "usehooks-ts";

import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { setModalPreviewCurriculumDetail } from "src/redux/curriculums.slice";
import { getDotDiagramString } from "src/helper/diagramGenerator/dotDiagram";
import CurriculumSimpleDiff from "./CurriculumSimpleDiff";
import CurriculumSideBySideDiff from "./CurriculumSideBySideDiff";
import DiagramDot from "../../DiagramPane/DiagramDot";
import TabPanel from "src/components/_Shared/TabPanel";

const ModalAddCourseRelationship = () => {
  const dispatch = useAppDispatch();
  const curriculumDetail = useAppSelector(
    (store) => store.curriculums.curriculumDetail
  );
  const courses = useAppSelector((store) => store.courses.courses);
  const { allYears, allYearsOrder } = curriculumDetail;

  const isOpen = useAppSelector(
    (store) => store.curriculums.modalPreviewCurriculumDetail.isOpen
  );
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [squareRef, { width, height }] = useElementSize();

  const closeModal = () => {
    dispatch(setModalPreviewCurriculumDetail({ isOpen: false }));
  };

  const changeTab = (
    event: SyntheticEvent<Element, Event>,
    value: string | number
  ) => {
    setTabIndex(Number(value));
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

  const exportToImage = () => {};

  return (
    <Dialog open={isOpen} onClose={closeModal} keepMounted={true} fullScreen>
      <DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndex}
            onChange={changeTab}
            variant="fullWidth"
            scrollButtons="auto"
          >
            <Tab label="Preview Dot Diagram" />
            <Tab label="Simple Diffs" />
            <Tab label="Side-by-Side Diffs" />
            <Tab label="Preview Change Logs" />
          </Tabs>
        </Box>
      </DialogTitle>
      <DialogContent ref={squareRef} sx={{ py: 0 }}>
        <TabPanel value={tabIndex} index={0}>
          <DiagramDot width={width - 24 * 2} height={height} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <CurriculumSimpleDiff width={width - 24 * 2} height={height} />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <CurriculumSideBySideDiff width={width - 24 * 2} height={height} />
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          Change Logs
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={exportToDot}>
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
