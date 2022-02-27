import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";

const Graphviz = dynamic(() => import("graphviz-react"), { ssr: false });

import { dummyDotString } from "src/helper/mockDataGenerator/dotString";

const DiagramDot = () => {
  const [dot, setDot] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setDot(dummyDotString);
  };

  return (
    <Box sx={{ overflow: "hidden" }}>
      {dot && (
        <Graphviz
          options={{
            convertEqualSidedPolygons: true,
            height: 1500,
            width: 1500,
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
