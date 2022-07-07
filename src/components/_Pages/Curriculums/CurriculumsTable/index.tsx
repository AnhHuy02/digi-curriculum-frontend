import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import type { ICurriculum } from "src/types/Curriculum.type";

import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";

import Link from "src/components/_Shared/Link";
import ButtonLoadSampleData from "../CurriculumDragAndDrop/DndToolbar/ButtonLoadSampleData";
import ButtonRandom from "../CurriculumDragAndDrop/DndToolbar/ButtonRandom";
import { useAppSelector } from "src/hooks/useStore";

const CurriculumTable = () => {
  const router = useRouter();
  const curriculums = useAppSelector((store) => store.curriculums.curriculums);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 350 },
    { field: "year", headerName: "Year", width: 125 },
    {
      field: "major",
      headerName: "Major",
      width: 125,
    },
    {
      field: "programType",
      headerName: "Program Type",
      // description: "This column has a value getter and is not sortable.",
      // sortable: false,
      width: 200,
      // valueGetter: (params: GridValueGetterParams) =>
      //   `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
    {
      field: "englishLevel",
      headerName: "English Level",
      width: 200,
    },
    {
      field: "_action_buttons",
      headerName: "",
      sortable: false,
      filterable: false,
      groupable: false,
      hideable: false,
      editable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      width: 200,
      renderCell: (params: GridRenderCellParams<unknown, ICurriculum>) => {
        // console.log(params.row);
        return (
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <Box>
                <IconButton
                  aria-label="action buttons"
                  {...bindTrigger(popupState)}
                >
                  <MoreVertOutlinedIcon />
                </IconButton>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <MenuList dense>
                    <MenuItem onClick={() => handleClickEdit(params.row.id)}>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <Typography>Edit</Typography>
                    </MenuItem>
                    <MenuItem disabled>
                      <ListItemIcon>
                        <DeleteIcon />
                      </ListItemIcon>
                      <Typography>Delete</Typography>
                    </MenuItem>
                  </MenuList>
                </Popover>
              </Box>
            )}
          </PopupState>
        );
      },
    },
  ];

  const mapCurriculumsDataToArray = () => {
    const newDataSource = curriculums.allIds.map(
      (curriculumId, curriculumIndex) => curriculums.byId[curriculumId]
    );

    console.log(newDataSource);
    return newDataSource;
  };

  const handleClickEdit = (curriculumId: string) => {
    router.push(`/curriculums/${curriculumId}/edit`);
  };

  return (
    <Box>
      <Toolbar
        variant="regular"
        disableGutters
        sx={{
          display: "flex",
          gap: 0.5,
          "& hr": {
            mx: 0.5,
          },
        }}
      >
        <Box className="toolbar--left" flexGrow={0}></Box>
        <ButtonLoadSampleData size="large" />
        <ButtonRandom size="large" />

        <Box className="toolbar--right" flexGrow={1}></Box>
        <Link href="/curriculums/new" type="button">
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            color="success"
            size="large"
          >
            New
          </Button>
        </Link>
      </Toolbar>

      <Box height="630px">
        <DataGrid
          rows={mapCurriculumsDataToArray()}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          checkboxSelection={false}
        />
      </Box>
    </Box>
  );
};

export default CurriculumTable;
