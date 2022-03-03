import Button from "@mui/material/Button";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const ResetButton = () => {
  return (
    <>
      <Button
        color="warning"
        variant="contained"
        size="small"
        startIcon={<RestartAltIcon />}
      >
        Reset
      </Button>
    </>
  );
};

export default ResetButton;
