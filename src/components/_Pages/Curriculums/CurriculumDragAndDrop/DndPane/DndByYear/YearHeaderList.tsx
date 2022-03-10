import type { FC } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  createTheme,
  ThemeProvider,
  styled,
  makeStyles,
} from "@mui/material/styles";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";

const configYear = style.year;
// const configSemester = config.semester;
const configCourseTile = style.courseTile;

const asd = createTheme(
  {},
  {
    year: {},
  }
);

// const useStyles = createTheme((theme) => ({
//   yearList: {
//     // padding: theme.spacing(2),
//   },
//   year: {
//     padding: theme.spacing(configYear.padding),
//     paddingBottom: 0,
//     margin: theme.spacing(configYear.margin),
//     marginBottom: 0,
//     minWidth: () => {
//       const courseTileFullSize =
//         theme.spacing(configCourseTile.width) +
//         theme.spacing(configCourseTile.padding) * 2 +
//         theme.spacing(configCourseTile.margin);
//       // console.log(theme.spacing(configCourseTile.width), theme.spacing(configCourseTile.padding), theme.spacing(configCourseTile.margin));
//       // console.log(courseTileFullSize);
//       // console.log(courseTileFullSize * 3);
//       // console.log(courseTileFullSize * 3 + theme.spacing(configYear.padding) * 2);
//       // console.log('');
//       return courseTileFullSize * 3 + theme.spacing(configYear.padding) * 2;
//     },
//   },
// }));

// console.log(theme.spacing())

interface YearHeaderProps {
  yearCount: number;
}

const YearHeaderList: FC<YearHeaderProps> = ({ yearCount }) => {
  // const classes = useStyles();
  // const { yearCount } = props;
  const allYears = Array.from({ length: yearCount });

  return (
    <Box display={`flex`} flexDirection={`row`} alignItems={`flex-start`}>
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
      {/* Header for YearAdd */}
      {/* <Box className={classes.year}>
        <Typography variant={`h5`} align={`center`}>
          Year {yearCount + 1}
        </Typography>
      </Box> */}
    </Box>
  );
};

export default YearHeaderList;
