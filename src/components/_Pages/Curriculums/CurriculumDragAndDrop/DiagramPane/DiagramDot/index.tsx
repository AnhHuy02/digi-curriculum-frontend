import type { FC } from "react";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";

const Graphviz = dynamic(() => import("graphviz-react"), { ssr: false });

import { getDotDiagramString } from "src/helper/diagramGenerator/dotDiagram";
import { useAppSelector } from "src/hooks/useStore";

interface DiagramDotProps {
  width?: number;
  height?: number;
}
const DiagramDot: FC<DiagramDotProps> = ({ width, height }) => {
  const curriculumDetail = useAppSelector(
    (store) => store.curriculums.curriculumDetail
  );
  const courses = useAppSelector((store) => store.courses.courses);
  const [dot, setDot] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, [curriculumDetail, courses]);

  const loadData = async () => {
    const { allYears, allYearsOrder } = curriculumDetail;
    const dotString = getDotDiagramString({
      allCourses: courses,
      allYears,
      allYearIdsOrder: allYearsOrder,
    });
    setDot(dotString);
  };

  return (
    <Box id="curriculum-detail-preview">
      {dot && (
        <Graphviz
          options={{
            convertEqualSidedPolygons: true,
            height: height || 1500,
            width: width || 2500,
            zoom: true,
            // layout: {
            //   hierarchical: false,
            // },
            useWorker: true,
            useSharedWorker: true,
            fit: true,
            zoomScaleExtent: [0.5, 3],
            // zoomTranslateExtent: [
            //   [-5000, -5000],
            //   [+5000, +5000],
            // ],
          }}
          dot={dot}
        />
      )}
    </Box>
  );
};

// DiagramDot.

export default DiagramDot;
