import { FC } from "react";

import { memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import _cloneDeep from "lodash/cloneDeep";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";

const configCourseTile = style.courseTile;

interface CourseNodePropsPreview {
  data: {
    name: string;
    courseId: string;
    index: number;
    credit: {
      theory: number;
      practice: number;
    };
    type: "UNCHANGED" | "BEFORE" | "AFTER";
  };
}

const CourseNodePreview: FC<CourseNodePropsPreview> = ({ data }) => {
  const { name, courseId, credit, index, type } = data;

  const getStyleFromType = () => {
    switch (type) {
      case "UNCHANGED": {
        return {
          bgColor: "white",
          color: "initial",
        };
      }
      case "BEFORE": {
        return {
          bgColor: "rgba(224, 67, 67, 1)",
          color: "white",
        };
      }
      case "AFTER": {
        return {
          bgColor: "rgba(25, 123, 25, 1)",
          color: "white",
        };
      }
      default: {
        return {
          bgColor: "white",
          color: "initial",
        };
      }
    }
  };

  return (
    <Paper
      sx={(theme) => ({
        width: theme.spacing(configCourseTile.width),
        height: theme.spacing(configCourseTile.height),
        padding: theme.spacing(configCourseTile.padding),

        backgroundColor: getStyleFromType().bgColor,
      })}
    >
      <Box
        display={`flex`}
        justifyContent={`flex-end`}
        alignItems={`flex-start`}
      ></Box>
      <Box
        display={`flex`}
        justifyContent={`center`}
        alignItems={`center`}
        sx={(theme) => ({
          height: theme.spacing(6),
        })}
      >
        <Typography
          variant={`body2`}
          sx={(theme) => ({
            fontSize: "0.75rem",
            fontWeight: theme.typography.fontWeightBold,
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            lineHeight: "0.75rem",
            color: getStyleFromType().color,
          })}
        >
          {name}
        </Typography>
      </Box>
      <Box sx={(theme) => ({ padding: theme.spacing(0.25) })}>
        <Typography
          variant={`body2`}
          sx={(theme) => ({
            fontSize: "0.75rem",
            fontWeight: theme.typography.fontWeightBold,
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            lineHeight: "0.75rem",
            color: getStyleFromType().color,
          })}
        >{`${credit?.practice || 0 + credit?.theory || 0} CR`}</Typography>
      </Box>
    </Paper>
  );
};

export default memo(CourseNodePreview);
