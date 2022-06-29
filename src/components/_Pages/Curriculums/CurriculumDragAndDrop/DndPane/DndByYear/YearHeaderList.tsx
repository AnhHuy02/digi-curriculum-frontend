import { memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";
import { useAppSelector } from "src/hooks/useStore";

const configYear = style.year;
// const configSemester = config.semester;
const configCourseTile = style.courseTile;

const YearHeaderList = () => {
  const yearCount = useAppSelector(
    (state) => state.curriculums.curriculumDetail.years.allIds.length
  );
  const allYears = Array.from({ length: yearCount });

  return (
    <Box display="flex" flexDirection="row" alignItems="flex-start">
      {allYears.map((element, index) => (
        <Box
          key={"year-header" + index}
          sx={(theme) => ({
            padding: theme.spacing(configYear.padding),
            paddingBottom: 0,
            margin: theme.spacing(configYear.margin),
            marginBottom: 0,
            minWidth: () => {
              const courseTileFullSize =
                configCourseTile.width +
                configCourseTile.padding * 2 +
                configCourseTile.margin;

              return theme.spacing(
                courseTileFullSize * 3 + configYear.padding * 2
              );
            },
          })}
        >
          <Typography
            variant={`body1`}
            fontSize={24}
            fontWeight={500}
            align={`center`}
          >
            Year {index + 1}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default memo(YearHeaderList);
