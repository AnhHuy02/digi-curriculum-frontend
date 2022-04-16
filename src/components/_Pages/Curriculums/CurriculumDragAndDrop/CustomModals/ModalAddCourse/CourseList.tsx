import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CourseTileCheckbox from "./CourseTileCheckbox";
import { useAppSelector } from "src/hooks/useStore";

const CourseList = () => {
  const allMajorIds = useAppSelector((store) => store.courses.majorIds);
  const allMajors = useAppSelector((store) => store.courses.majors);
  const allCourseIds = useAppSelector((store) => store.courses.courseIds);
  const allCourses = useAppSelector((store) => store.courses.courses);

  return (
    <Box>
      {allMajorIds.map((majorId) => {
        const filteredCourseIds = allCourseIds.filter(
          (courseId) => allCourses[courseId].majorId === majorId
        );
        return (
          <Box key={majorId} marginBottom={3}>
            <Typography variant="h5">{allMajors[majorId].name}</Typography>
            <Box display={`flex`} flexWrap={`wrap`}>
              {filteredCourseIds.map((courseId) => (
                <CourseTileCheckbox key={courseId} courseId={courseId} />
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default CourseList;
