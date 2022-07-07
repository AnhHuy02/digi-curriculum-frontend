import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

const ButtonSave = () => {
  return (
    <>
      <Button
        color="info"
        variant="contained"
        size="small"
        startIcon={<SaveIcon />}
      >
        Save
      </Button>
    </>
  );
};

export default ButtonSave;
