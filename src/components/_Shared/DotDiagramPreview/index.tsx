import type { FC } from "react";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";

const Graphviz = dynamic(() => import("graphviz-react"), { ssr: false });

import { getDotDiagramString } from "src/helper/diagramGenerator/dotDiagram";
import { useAppSelector } from "src/hooks/useStore";

interface DotDiagramPreviewProps {
  width?: number;
  height?: number;
}
const DotDiagramPreview: FC<DotDiagramPreviewProps> = ({ width, height }) => {
  const curriculumDetail = useAppSelector(
    (store) => store.curriculums.curriculumDetail
  );
  const courses = useAppSelector((store) => store.courses.courses);
  const years = useAppSelector(
    (store) => store.curriculums.curriculumDetail.years
  );
  const [dot, setDot] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, [curriculumDetail, courses]);

  const loadData = async () => {
    const dotString = getDotDiagramString({
      courses,
      years,
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

export default DotDiagramPreview;
