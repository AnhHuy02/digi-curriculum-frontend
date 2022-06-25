import type { ButtonProps } from "@mui/material/Button";

import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { grey } from "@mui/material/colors";

import { style } from "src/constants/component-specs/curriculum-edit-by-years";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { CurriculumCommandType } from "src/constants/curriculum.const";
import { commitChangeToHistory } from "src/redux/curriculumChangeHistory.slice";

const configYear = style.year;
const configCourseTile = style.courseTile;

const courseTileFullSize =
  configCourseTile.width +
  configCourseTile.padding * 2 +
  configCourseTile.margin;

const StyledButton = styled((props: ButtonProps & { semCount: number }) => (
  <Button variant="contained" endIcon={<AddIcon />} {...props} />
))((props) => {
  const { theme, semCount } = props;
  const btnWidth = courseTileFullSize * semCount + configYear.padding * 2;

  return {
    padding: theme.spacing(configYear.padding),
    marginLeft: theme.spacing(configYear.marginLeft),
    marginRight: theme.spacing(configYear.marginLeft),
    marginTop: theme.spacing(configYear.marginY),
    marginBottom: theme.spacing(configYear.marginY),
    width: theme.spacing(btnWidth),
    color: theme.palette.getContrastText(grey[300]),
    backgroundColor: grey[300],
    "&:hover": {
      color: theme.palette.getContrastText(grey[700]),
      backgroundColor: grey[700],
    },
  };
});

const YearAddButton = () => {
  const dispatch = useAppDispatch();
  const semCountPerYear = useAppSelector(
    (store) => store.curriculums.curriculumDetail.semCountPerYear
  );

  const handleClickAddYear = () => {
    dispatch(
      commitChangeToHistory({
        type: CurriculumCommandType.ADD_YEAR,
        patch: {},
      })
    );
  };

  return (
    <StyledButton semCount={semCountPerYear} onClick={handleClickAddYear}>
      Add year
    </StyledButton>
  );
};

export default YearAddButton;
