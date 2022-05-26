import type { FC } from "react";

import Box from "@mui/material/Box";

import Semester from "./Semester";

interface ISemesterListProps {
  yearId: string;
  yearIndex: number;
  allSemIdsOrder: string[];
}

const SemesterList: FC<ISemesterListProps> = ({
  yearId,
  yearIndex,
  allSemIdsOrder,
}) => {
  return (
    <Box display={`flex`} flexDirection={`row`}>
      {allSemIdsOrder.map((semId, index) => {
        return (
          <Semester
            key={`${yearId} ${semId}`}
            index={index}
            yearId={yearId}
            yearIndex={yearIndex}
            semId={`${semId}`}
          />
        );
      })}
    </Box>
  );
};

export default SemesterList;
