import React, { memo, useCallback } from "react";
import { Handle, Position } from "react-flow-renderer";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
// import { makeStyles } from "@material-ui/core/styles";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";

const configCourseTile = style.courseTile;

interface IAddCourseNode {
  data: {
    // asdasd: string;
  };
}

const AddCourseNode = ({ data }: IAddCourseNode) => {
  // const classes = useStyles();

  // const onChange = useCallback((evt) => {
  //   console.log(evt.target.value);
  // }, []);

  const handleClick = () => {
    // return props.onClick();
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
      {/* {data.asdasd} */}
    </Button>
  );
};

export default memo(AddCourseNode);
