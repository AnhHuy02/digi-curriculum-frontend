import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
// import { makeStyles } from "@material-ui/core/styles";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";

const configCourseTile = style.courseTile;

// const useStyles = makeStyles((theme) => ({
//   root: {
//     margin: theme.spacing(configCourseTile.margin),
//     width: theme.spacing(configCourseTile.width),
//     padding: theme.spacing(configCourseTile.padding),
//   },
// }));

const CourseTileAdd = (props) => {
  // const classes = useStyles();

  const handleClick = () => {
    return props.onClick();
  };

  return (
    <Button
      // className={classes.root}
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

export default React.memo(CourseTileAdd);
