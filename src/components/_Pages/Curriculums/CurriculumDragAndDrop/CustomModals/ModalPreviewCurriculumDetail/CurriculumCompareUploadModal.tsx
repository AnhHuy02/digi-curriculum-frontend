import { ChangeEvent, FC, useEffect } from "react";
import type { ICourseItemSimple } from "src/types/Course.type";

import {  useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";

type Courses = {
  allCourseIds: string[];
  allCourses: Record<string, ICourseItemSimple>;
} | null;

type CurriculumItem = {
  allYears: Record<
    string,
    {
      semesters: Record<string, { courseIds: string[] }>;
      semestersOrder: string[];
    }
  >;
  allYearsOrder: string[];
};

interface CurriculumCompareProps {
  isOpen: boolean;
  onConfirm?(
    newData: Courses & {
      curriculumA: CurriculumItem;
      curriculumB: CurriculumItem;
    }
  ): void;
  onClose?(): void;
}

const Input = styled("input")({
  display: "none",
});

const CurriculumCompare: FC<CurriculumCompareProps> = ({
  isOpen,
  onConfirm,
  onClose,
}) => {
  const [coursesJsonA, setCoursesJsonA] = useState<Courses>(null);
  const [coursesJsonB, setCoursesJsonB] = useState<Courses>(null);
  const [curriculumJsonA, setCurriculumJsonA] = useState<CurriculumItem | null>(
    null
  );
  const [curriculumJsonB, setCurriculumJsonB] = useState<CurriculumItem | null>(
    null
  );

  useEffect(() => {
    return () => {
      setCoursesJsonA(null);
      setCoursesJsonB(null);
      setCurriculumJsonA(null);
      setCurriculumJsonB(null);
    };
  }, []);

  const handleConfirm = () => {
    console.log("curriculumJsonA", curriculumJsonA);
    if (
      onConfirm &&
      coursesJsonA &&
      coursesJsonB &&
      curriculumJsonA &&
      curriculumJsonB
    ) {
      const combinedCourseIds = Array.from(
        new Set([
          ...coursesJsonA.allCourseIds.concat(coursesJsonB.allCourseIds),
        ])
      );
      const combinedAllCourses = {
        ...coursesJsonA.allCourses,
        ...coursesJsonB.allCourses,
      };
      onConfirm({
        allCourseIds: combinedCourseIds,
        allCourses: combinedAllCourses,
        curriculumA: curriculumJsonA,
        curriculumB: curriculumJsonB,
      });
    }
  };

  const closeModal = () => {
    onClose && onClose();
  };

  const handleUploadJsonFile = (
    event: ChangeEvent<HTMLInputElement>,
    stateType:
      | "coursesJsonA"
      | "coursesJsonB"
      | "curriculumJsonA"
      | "curriculumJsonB"
  ) => {
    const fileReader = new FileReader();
    const files = event.target.files as FileList;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (e) => {
      const content = e.target?.result as string;

      switch (stateType) {
        case "coursesJsonA": {
          setCoursesJsonA(JSON.parse(content) as Courses);
          break;
        }
        case "coursesJsonB": {
          setCoursesJsonB(JSON.parse(content) as Courses);
          break;
        }
        case "curriculumJsonA": {
          const newData = JSON.parse(content);
          setCurriculumJsonA({
            allYears: newData.allYears,
            allYearsOrder: newData["allYearIdsOrder"],
          });
          break;
        }
        case "curriculumJsonB": {
          const newData = JSON.parse(content);
          setCurriculumJsonB({
            allYears: newData.allYears,
            allYearsOrder: newData["allYearIdsOrder"],
          });
          break;
        }
        default: {
          break;
        }
      }
    };
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogTitle>Import from JSON file</DialogTitle>
      <DialogContent sx={{ py: 0 }}>
        <Box>
          <Stack direction="column" spacing={1.5} py={1}>
            <Stack direction="row" spacing={1.5}>
              <InputLabel>
                Curriculum A
                <Box component="span" mx={1}>
                  <Input
                    accept="application/JSON"
                    type="file"
                    onChange={(event) =>
                      handleUploadJsonFile(event, "coursesJsonA")
                    }
                  />
                  <Button
                    variant="contained"
                    component="span"
                    color={coursesJsonA ? "success" : "primary"}
                  >
                    Upload Courses
                  </Button>
                </Box>
              </InputLabel>
              <InputLabel>
                <Box component="span" mx={1}>
                  <Input
                    accept="application/JSON"
                    type="file"
                    onChange={(event) =>
                      handleUploadJsonFile(event, "curriculumJsonA")
                    }
                  />
                  <Button
                    variant="contained"
                    component="span"
                    color={curriculumJsonA ? "success" : "primary"}
                  >
                    Upload Syllabus
                  </Button>
                </Box>
              </InputLabel>
            </Stack>
            <Stack direction="row" spacing={1.5}>
              <InputLabel>
                Curriculum B
                <Box component="span" mx={1}>
                  <Input
                    accept="application/JSON"
                    type="file"
                    onChange={(event) =>
                      handleUploadJsonFile(event, "coursesJsonB")
                    }
                  />
                  <Button
                    variant="contained"
                    component="span"
                    color={coursesJsonB ? "success" : "primary"}
                  >
                    Upload Courses
                  </Button>
                </Box>
              </InputLabel>
              <InputLabel>
                <Box component="span" mx={1}>
                  <Input
                    accept="application/JSON"
                    type="file"
                    onChange={(event) =>
                      handleUploadJsonFile(event, "curriculumJsonB")
                    }
                  />
                  <Button
                    variant="contained"
                    component="span"
                    color={curriculumJsonB ? "success" : "primary"}
                  >
                    Upload Syllabus
                  </Button>
                </Box>
              </InputLabel>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          disabled={
            !(
              coursesJsonA &&
              coursesJsonB &&
              curriculumJsonA &&
              curriculumJsonB
            )
          }
          onClick={handleConfirm}
        >
          Confirm and Compare
        </Button>
        <Button variant="contained" color="inherit" onClick={closeModal}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CurriculumCompare;
