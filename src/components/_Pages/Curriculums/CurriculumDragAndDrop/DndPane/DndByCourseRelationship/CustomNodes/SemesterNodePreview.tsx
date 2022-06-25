import type { FC } from "react";

import { memo } from "react";
import Paper from "@mui/material/Paper";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";

const configYear = style.year;

interface SemesterNodePreviewProps {
  data: {
    width: number;
    height: number;
    creditCount: number;
    creditLimit: number;
  };
}

const SemesterNodePreview: FC<SemesterNodePreviewProps> = ({ data }) => {
  const { width, height } = data;

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
    ></Paper>
  );
};

export default memo(SemesterNodePreview);
