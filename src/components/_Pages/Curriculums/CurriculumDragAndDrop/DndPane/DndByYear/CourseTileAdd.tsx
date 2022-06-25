import type { FC } from "react";

import { memo } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";

const configCourseTile = style.courseTile;

interface CourseTileAddProps {
  onClick(): void;
}

const CourseTileAdd: FC<CourseTileAddProps> = (props) => {
  const handleClick = () => {
    return props.onClick();
  };

  return (
    <Button
      variant={`contained`}
      color="inherit"
      onClick={() => handleClick()}
      sx={(theme) => ({
        margin: theme.spacing(configCourseTile.margin),
        width: theme.spacing(configCourseTile.width),
        padding: theme.spacing(configCourseTile.padding),
      })}
    >
      <AddIcon />
    </Button>
  );
};

export default memo(CourseTileAdd);
