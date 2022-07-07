import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CourseTileCheckbox from "./CourseTileCheckbox";
import { useAppSelector } from "src/hooks/useStore";

const CourseList = () => {
  const majors = useAppSelector((store) => store.courses.majors);
  const courses = useAppSelector((store) => store.courses.courses);

  return (
    <Box>
      {majors.allIds.map((majorId) => {
        const filteredCourseIds = (courses.allIds as string[]).filter(
          (courseId) => courses.byId[courseId].majorId === majorId
        );
        return (
          <Box key={majorId} marginBottom={3}>
            <Typography variant="h5">{majors.byId[majorId].name}</Typography>
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
