import type { FC } from "react";

import Box from "@mui/material/Box";

import Semester from "./Semester";

interface ISemesterListProps {
  semListId: string;
  allSemIdsOrder: string[];
}

const SemesterList: FC<ISemesterListProps> = ({
  semListId,
  allSemIdsOrder,
}) => {
  return (
    <Box display={`flex`} flexDirection={`row`}>
      {allSemIdsOrder.map((semId, index) => {
        return (
          <Semester
            key={`${semListId} ${semId}`}
            index={index}
            yearId={semListId}
            semId={`${semId}`}
          />
        );
      })}
    </Box>
  );
};

export default SemesterList;
