import type { CSSProperties, FC } from "react";
import type { TypographyProps } from "@mui/material/Typography";

import { memo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface TextNodeProps {
  data: {
    width?: number;
    height?: number;
    label?: string | number | null | undefined;
    textStyle?: CSSProperties | undefined;
  };
}

const TextNode: FC<TextNodeProps> = ({ data }) => {
  const { width, height, label, textStyle } = data;

  return (
    <Box
      sx={(theme) => ({
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <Typography
        variant={`body2`}
        align={`center`}
        component={`div`}
        style={{ ...textStyle }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default memo(TextNode);
