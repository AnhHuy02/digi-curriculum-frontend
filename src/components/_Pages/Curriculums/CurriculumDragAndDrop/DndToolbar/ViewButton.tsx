import type { MenuProps } from "@mui/material/Menu";

import { useState, Fragment } from "react";
import { styled, alpha } from "@mui/material/styles";
import { blueGrey, blue, grey } from "@mui/material/colors";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";

import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { setDiagramViewMode } from "src/redux/curriculums.slice";
import { CurriculumDiagramType } from "src/constants/curriculumDiagramType";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    // marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "0 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

interface IViewDiagramMenuItem {
  id: CurriculumDiagramType;
  title: string;
}

const ExportButton = () => {
  const dispatch = useAppDispatch();
  const { diagramViewMode } = useAppSelector((store) => store.curriculums);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const id = event.currentTarget.id;
    dispatch(setDiagramViewMode(id as CurriculumDiagramType));
    closeMenu();
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const MenuItemWithCondition = ({ id, title }: IViewDiagramMenuItem) => {
    if (id === diagramViewMode) {
      return (
        <MenuItem id={id} onClick={handleItemClick}>
          <ListItemIcon>
            <CheckIcon />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        </MenuItem>
      );
    } else {
      return (
        <MenuItem id={id} onClick={handleItemClick}>
          <ListItemText inset primary={title} />
        </MenuItem>
      );
    }
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        sx={(theme) => ({
          borderColor: grey["A200"],
          bgcolor: grey["A200"],
          color: "black",
          ":hover": {
            borderColor: grey["A400"],
            bgcolor: grey["A400"],
            // color: "white",
          },
        })}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={openMenu}
        endIcon={<KeyboardArrowDownIcon />}
      >
        View
      </Button>
      <StyledMenu
        id="view-diagram-menu"
        MenuListProps={{
          "aria-labelledby": "view-diagram-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
      >
        <MenuList dense>
          <ListSubheader>Curriculum</ListSubheader>
          <MenuItem disabled>
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
            By Year
          </MenuItem>
          <MenuItem disabled>
            <ListItemText inset primary="By Semester" />
          </MenuItem>
          <Divider />
          <ListSubheader>Diagram</ListSubheader>
          <MenuItemWithCondition
            key={CurriculumDiagramType.NONE}
            id={CurriculumDiagramType.NONE}
            title="None"
          />
          <MenuItemWithCondition
            key={CurriculumDiagramType.DEFAULT}
            id={CurriculumDiagramType.DEFAULT}
            title="Default"
          />
          <MenuItemWithCondition
            key={CurriculumDiagramType.DOT}
            id={CurriculumDiagramType.DOT}
            title="Dot"
          />
        </MenuList>
      </StyledMenu>
    </>
  );
};

export default ExportButton;
