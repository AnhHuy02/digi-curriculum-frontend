import type { FC } from "react";

import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useAppDispatch } from "src/hooks/useStore";
import { setModalPreviewCurriculumDetail } from "src/redux/curriculums.slice";
import DiagramDot from "../../DiagramPane/DiagramDot";

const CurriculumAfter: FC<{}> = ({}) => {
  const ref = useRef<any>();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    dispatch(setModalPreviewCurriculumDetail({ isOpen: true }));
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        height: "100%",
        // overflowY: "none",
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
      }}
      ref={ref}
    >
      {ref.current?.clientWidth}
      <Typography>After</Typography>
      <DiagramDot width={ref.current?.clientWidth} height={ref.current?.clientHeight} />
      {/* <Button
        color="info"
        size="small"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Preview
      </Button> */}
    </Box>
  );
};

export default CurriculumAfter;
