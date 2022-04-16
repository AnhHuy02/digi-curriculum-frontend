import type { FC } from "react";

import { memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { selectCourse } from "src/redux/courses.slice";

const configCourseTile = style.courseTile;

interface CourseTileCheckboxProps {
  courseId: string;
}

const CourseTileCheckbox: FC<CourseTileCheckboxProps> = ({ courseId }) => {
  const dispatch = useAppDispatch();
  const course = useAppSelector((store) => store.courses.courses[courseId]);
  const { name, credit, selected, selectedTemp } = course;

  const handleSelect = () => {
    dispatch(selectCourse(courseId));
  };

  return (
    <Button
      variant={selected ? "contained" : undefined}
      disabled={selected}
      onClick={handleSelect}
      sx={(theme) => ({
        margin: theme.spacing(configCourseTile.margin),
        padding: theme.spacing(0),
        textTransform: "none",
      })}
    >
      <Paper
        sx={(theme) => ({
          width: theme.spacing(configCourseTile.width),
          padding: theme.spacing(configCourseTile.padding),
          backgroundColor: "inherit",
        })}
      >
        <Box
          display={`flex`}
          justifyContent={`flex-end`}
          alignItems={`flex-start`}
        >
          <Checkbox
            inputProps={{ "aria-label": "primary checkbox" }}
            size={`small`}
            checked={selected || selectedTemp}
            disabled={selected}
            sx={(theme) => ({
              margin: theme.spacing(0),
              padding: theme.spacing(0),
              height: theme.spacing(2),
            })}
          />
        </Box>
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
            })}
          >
            {name}
          </Typography>
        </Box>
        <Box
          sx={(theme) => ({
            padding: theme.spacing(0.25),
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
            })}
          >
            {`${credit.theory + credit.practice} CR`}
          </Typography>
        </Box>
      </Paper>
    </Button>
  );
};

export default memo(CourseTileCheckbox);
