import type { FC } from "react";

import { memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";

const configYear = style.year;

interface SemesterNodeProps {
  data: {
    width: number;
    height: number;
    creditCount: number;
    creditLimit: number;
  };
}

const SemesterNode: FC<SemesterNodeProps> = ({ data }) => {
  const { width, height, creditCount, creditLimit } = data;

  return (
    <Paper
      sx={(theme) => ({
        width,
        height,
        backgroundColor: "rgba(230, 230, 230, 0.6)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: theme.spacing(configYear.padding),
      })}
    >
      <Typography
        variant={`body2`}
        align={`center`}
        component={`div`}
        sx={(theme) => ({
          color:
            creditCount <= creditLimit
              ? theme.palette.success.light
              : theme.palette.error.light,
        })}
      >
        <Box fontWeight="fontWeightBold">{`${creditCount} / ${creditLimit}`}</Box>
      </Typography>
    </Paper>
  );
};

export default memo(SemesterNode);
