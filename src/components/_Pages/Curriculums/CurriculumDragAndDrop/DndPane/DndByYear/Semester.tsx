import type { FC } from "react";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Droppable } from "react-beautiful-dnd";

import CourseTile from "./CourseTile";
import CourseTileAdd from "./CourseTileAdd";
import { useAppSelector } from "src/hooks/useStore";

interface ICourseListContainerProps {
  isdraggingover: boolean;
  [otherProps: string]: any;
}

const CourseListContainer = forwardRef(
  (props: ICourseListContainerProps, ref) => {
    return (
      <Box
        {...props}
        ref={ref}
        display={`flex`}
        justifyContent="center"
        flexDirection={`column`}
        sx={{
          transition: "background-color 0.2s ease",
          backgroundColor: () =>
            props.isdraggingover.toString() === "true" ? "dimgray" : "inherit",
          "&:hover": {
            backgroundColor: "lightslategrey",
          },
        }}
      >
        {props.children}
      </Box>
    );
  }
);

interface ISemesterProps {
  yearId: string;
  semId: string;
  index: number;
}
const Semester: FC<ISemesterProps> = ({ yearId, semId, index }) => {
  const { allYears } = useAppSelector(
    (state) => state.curriculums.curriculumDetail
  );
  const { courses } = useAppSelector((state) => state.courses);

  const { courseIds, creditLimit } = allYears[yearId].semesters[semId];

  const getCreditCount = (): number => {
    let creditCount: number = 0;
    courseIds.forEach((courseId) => {
      creditCount += courses[courseId].credit.theory;
      creditCount += courses[courseId].credit.practice;
    });
    return creditCount;
  };

  const showDialog = ({ yearId, semId }: any) => {
    // const { openDialog } = this.props;
    // openDialog({ yearId, semId });
  };

  // const handleRemoveCourse = ({ yearId, semId, courseId }) => {
  //   const { removeCourseFromCurriculum, removeSelectedCourseFromCourseList } =
  //     this.props;
  //   const filteredSemId = semId.split(" ")[1];
  //   removeCourseFromCurriculum({ yearId, semId: filteredSemId, courseId });
  //   removeSelectedCourseFromCourseList(courseId);
  // };

  return (
    <Box>
      <Typography variant="body1" align="center">
        Sem {index + 1}
      </Typography>
      <Droppable
        droppableId={`${yearId} ${semId}`}
        type={`move-semester-course`}
      >
        {(provided, snapshot) => {
          return (
            <CourseListContainer
              ref={provided.innerRef}
              {...provided.droppableProps}
              // I don't know why the warning console forces me to set "isDraggingOver"
              // to lowercase and convert boolean to string. Weird.
              isdraggingover={snapshot.isDraggingOver}
            >
              {courseIds.map((courseId, index) => {
                return (
                  <CourseTile
                    key={courseId}
                    courseId={courseId}
                    index={index}
                    yearId={yearId}
                    semId={semId}
                  />
                );
              })}
              {provided.placeholder}
              <CourseTileAdd onClick={() => showDialog({ yearId, semId })} />
            </CourseListContainer>
          );
        }}
      </Droppable>
      <Typography
        variant={`body2`}
        align={`center`}
        component={`div`}
        sx={(theme) => ({
          color:
            getCreditCount() <= creditLimit
              ? theme.palette.success.light
              : theme.palette.error.light,
        })}
      >
        <Box fontWeight="fontWeightBold">{`${getCreditCount()} / ${creditLimit}`}</Box>
      </Typography>
    </Box>
  );
};

export default Semester;
