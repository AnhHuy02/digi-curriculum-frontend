import { ChangeEvent, FC, useEffect } from "react";
import type { ArrayNormalizer } from "src/types/Normalizer.type";
import type { ICourse } from "src/types/Course.type";
import type { ICurriculumItemYear } from "src/types/Curriculum.type";

import { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import * as d3 from "d3";

// import curriculumCsvFile from "../../../../../../../assets/curriculumn-v3.csv";

interface CurriculumCompareProps {
  isOpen: boolean;
  onConfirm?(newData: {
    courses: ArrayNormalizer<ICourse>;
    curriculumA: ArrayNormalizer<ICurriculumItemYear>;
    curriculumB: ArrayNormalizer<ICurriculumItemYear>;
  }): void;
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
  const [coursesJsonA, setCoursesJsonA] = useState<ArrayNormalizer<ICourse>>({
    allIds: [],
    byId: {},
  });
  const [coursesJsonB, setCoursesJsonB] = useState<ArrayNormalizer<ICourse>>({
    allIds: [],
    byId: {},
  });
  const [curriculumJsonA, setCurriculumJsonA] = useState<
    ArrayNormalizer<ICurriculumItemYear>
  >({
    allIds: [],
    byId: {},
  });
  const [curriculumJsonB, setCurriculumJsonB] = useState<
    ArrayNormalizer<ICurriculumItemYear>
  >({
    allIds: [],
    byId: {},
  });

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
          ...(coursesJsonA.allIds as string[]).concat(
            coursesJsonB.allIds as string[]
          ),
        ])
      );
      const combinedAllCourses = {
        ...coursesJsonA.byId,
        ...coursesJsonB.byId,
      };
      onConfirm({
        courses: {
          allIds: combinedCourseIds,
          byId: combinedAllCourses,
        },
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
      | "curriculumTest"
  ) => {
    const fileReader = new FileReader();
    const files = event.target.files as FileList;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (e) => {
      const content = e.target?.result as string;

      switch (stateType) {
        case "coursesJsonA": {
          setCoursesJsonA(JSON.parse(content) as ArrayNormalizer<ICourse>);
          break;
        }
        case "coursesJsonB": {
          setCoursesJsonB(JSON.parse(content) as ArrayNormalizer<ICourse>);
          break;
        }
        case "curriculumJsonA": {
          const newData = JSON.parse(content);
          setCurriculumJsonA({
            allIds: newData["allYearIdsOrder"],
            byId: newData.allYears,
          });
          break;
        }
        case "curriculumJsonB": {
          const newData = JSON.parse(content);
          setCurriculumJsonB({
            allIds: newData["allYearIdsOrder"],
            byId: newData.allYears,
          });
          break;
        }
        case "curriculumTest": {
          break;
        }
        default: {
          break;
        }
      }
    };
  };

  const handleUploadCsvFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = event.target.files as FileList;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (e) => {
      const content = e.target?.result as string;

      const data = d3.csvParse(content, function (d: any) {
        return d;
      });

      const columns = data.columns;
      const dataSource = data.map((item) => item);

      // #region map data to courses
      const courses = {
        byId: {},
        allIds: [],
      };

      const uniqueCourseIds = Array.from(
        new Set([...dataSource.map((item) => item["id"])])
      );

      const coursesTemp = dataSource.map((item) => {
        const {
          year: year,
          semester: semester,
          program: program,
          english_level: englishLevel,
          version: version,
          Program_fullname: programFullname,
          ...courseItem
        } = item;
        return courseItem;
      });

      uniqueCourseIds.forEach((uniqueId) => {
        const result = coursesTemp.find((item) => item["id"] === uniqueId);

        if (result) {
          (courses as any).byId[uniqueId] = result;
          (courses as any).allIds.push(uniqueId);
        }
      });
      console.log(courses);
      // #endregion

      // #region map data to curriculums
      const curriculums: any = [];

      const uniqueProgramFullnames = Array.from(
        new Set([...dataSource.map((item) => item["Program_fullname"])])
      );

      // const curriculumsTemp = dataSource.map((item) => {
      //   const {
      //     id: id,
      //     "Course Name": courseName,
      //     credit: credit,
      //     Credit_full: creditFull,
      //     ...curriculumItem
      //   } = item;
      //   return curriculumItem;
      // });

      uniqueProgramFullnames.forEach((programName, programIndex) => {
        const result = dataSource.filter(
          (item) => item["Program_fullname"] === programName
        );

        if (result) {
          const curriculumItem = {
            id: `curriculum-${programIndex + 1}`,
            name: String(programName),
            allYears: {},
            allYearIdsOrder: [],
          };

          const uniqueYearIds = Array.from(
            new Set([...result.map((item) => item["year"])])
          );

          uniqueYearIds.forEach((yearId, yearIndex) => {
            const semesterRows = result.filter(
              (item) => item["year"] === yearId
            );
            const uniqueSemesterIds = Array.from(
              new Set([...semesterRows.map((item) => item.semester)])
            ).map(String);

            const newYearId = `year-${yearIndex + 1}`;

            (curriculumItem as any).allYearIdsOrder.push(newYearId);
            (curriculumItem as any).allYears[newYearId] = {
              id: newYearId,
              semesters: {},
              semestersOrder: [],
            };

            uniqueSemesterIds.forEach((semId, semIndex) => {
              const newSemId = `${newYearId}-sem-${semIndex + 1}`;
              const semCourses = semesterRows.filter(
                (item) => item["year"] === yearId && item["semester"] === semId
              );

              (curriculumItem as any).allYears[newYearId].semestersOrder.push(
                newSemId
              );
              (curriculumItem as any).allYears[newYearId].semesters[newSemId] =
                {
                  id: newSemId,
                  courseIds: [],
                };

              if (semCourses) {
                const courseIdsTemp: string[] = [];

                semCourses.forEach((course) => {
                  courseIdsTemp.push(course["id"]);
                });

                (curriculumItem as any).allYears[newYearId].semesters[
                  newSemId
                ].courseIds = [...courseIdsTemp];
              }
            });
          });
          // console.log(curriculumItem);
          curriculums.push(curriculumItem);
        }
      });
      // #endregion

      console.log("CSV FILE", curriculums);
    };

    // const fuck = await d3.csv(await import("../../../../../../../assets/curriculumn-v3.csv"));
    // console.log("fuck", fuck);
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
            <Box>
              <InputLabel>
                <Input
                  accept=".csv"
                  type="file"
                  onChange={(event) => handleUploadCsvFile(event)}
                />
                <Button
                  variant="contained"
                  component="span"
                  // color={curriculumJsonB ? "success" : "primary"}
                >
                  Test Import
                </Button>
              </InputLabel>
            </Box>
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
