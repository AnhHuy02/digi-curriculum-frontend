import { SyntheticEvent, useState } from "react";
import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";
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
import { useSnackbar } from "notistack";

import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { setModalPreviewCurriculumDetail } from "src/redux/curriculums.slice";
import { getDotDiagramString } from "src/helper/diagramGenerator/dotDiagram";
import CurriculumCompare from "./CurriculumCompare";
import CurriculumChangeLog from "./CurriculumChangeLog";
import DotDiagramPreview from "src/components/_Shared/DotDiagramPreview";
import TabPanel from "src/components/_Shared/TabPanel";

const ModalAddCourseRelationship = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const courses = useAppSelector((store) => store.courses.courses);
  const years = useAppSelector(
    (store) => store.curriculums.curriculumDetail.years
  );

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
      courses,
      years,
    });

    const blob = new Blob([dotString], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, "curriculum.dot");
  };

  const exportToImage = async () => {
    enqueueSnackbar("Generating image...", {
      variant: "default",
    });

    const dotString = await getDotDiagramString({
      courses,
      years,
    });

    const viz = new Viz({ Module, render });

    viz
      .renderImageElement(dotString)
      .then(function (element) {
        const link = element.src;

        var a = document.createElement("a");

        a.setAttribute("href", link);
        a.setAttribute("download", "curriculum.png");

        document.body.append(a);

        enqueueSnackbar("Generated successfully", {
          variant: "success",
        });

        a.click();
        a.remove();
      })
      .catch((err) => {
        enqueueSnackbar("Something went wrong, please try again", {
          variant: "error",
        });
      });
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} keepMounted={true} fullScreen>
      <DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndex}
            onChange={changeTab}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Preview Dot Diagram" />
            <Tab label="Compare Curriculum" />
            {/* <Tab label="Side-by-Side Diffs" /> */}
            <Tab label="Preview Change Logs" />
          </Tabs>
        </Box>
      </DialogTitle>
      <DialogContent ref={squareRef} sx={{ py: 0 }}>
        <TabPanel value={tabIndex} index={0}>
          <DotDiagramPreview width={width - 24 * 2} height={height} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <CurriculumCompare width={width - 24 * 2} height={height} />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <CurriculumChangeLog />
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={exportToDot}>
          Export To DOT
        </Button>
        <Button variant="contained" color="primary" onClick={exportToImage}>
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
