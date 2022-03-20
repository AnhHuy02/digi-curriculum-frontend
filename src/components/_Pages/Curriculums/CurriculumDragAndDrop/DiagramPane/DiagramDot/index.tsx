import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";

const Graphviz = dynamic(() => import("graphviz-react"), { ssr: false });

import { dummyDotString } from "src/helper/mockDataGenerator/dotString";
import { getDotDiagramString } from "src/helper/diagramGenerator/dotDiagram";
import { useAppSelector } from "src/hooks/useStore";

const DiagramDot = () => {
  const curriculumDetail = useAppSelector(
    (store) => store.curriculums.curriculumDetail
  );
  const { courses } = useAppSelector((store) => store.courses);
  const [dot, setDot] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, [curriculumDetail]);

  const loadData = async () => {
    const { allYears, allYearsOrder } = curriculumDetail;
    const dotString = getDotDiagramString({
      allCourses: courses,
      allYears,
      allYearIdsOrder: allYearsOrder,
    });
    setDot(dotString);
    // setDot(dummyDotString);
  };

  return (
    <Box sx={{ overflow: "hidden" }}>
      {dot && (
        <Graphviz
          options={{
            convertEqualSidedPolygons: true,
            height: 1500,
            width: 2500,
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
