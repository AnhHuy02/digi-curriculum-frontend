import type { FC } from "react";
import type { ArrayNormalizer } from "src/types/Normalizer.type";
import type { ICurriculumItemYear } from "src/types/Curriculum.type";

import { useState, useMemo } from "react";
import ReactFlow, {
  Background,
  useNodesState,
  ReactFlowProvider,
} from "react-flow-renderer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import { useAppSelector } from "src/hooks/useStore";
import { getDndNodesAndEdges } from "src/helper/diagramGenerator/diffDiagramSimple";
import TextNode from "../../DndPane/DndByCourseRelationship/CustomNodes/TextNode";
import SemesterNodePreview from "../../DndPane/DndByCourseRelationship/CustomNodes/SemesterNodePreview";
import CourseNodePreview from "../../DndPane/DndByCourseRelationship/CustomNodes/CourseNodePreview";

const nodeTypes = {
  textNode: TextNode,
  semesterNode: SemesterNodePreview,
  courseNode: CourseNodePreview,
};

interface CurriculumCompareProps {
  width?: number;
  height?: number;
}

const CurriculumCompare: FC<CurriculumCompareProps> = ({ width, height }) => {
  const years = useAppSelector(
    (store) => store.curriculums.curriculumDetail.years
  );

  const curriculums = useAppSelector((store) => store.curriculums.curriculums);
  const curriculumBefore = useAppSelector(
    (store) => store.curriculumChangeHistory.curriculumBefore
  );

  const [nodes, setNodes] = useNodesState([]);

  const [curriculumInputA, setCurriculumInputA] =
    useState<string>("Curriculum Before");
  const [curriculumA, setCurriculumA] =
    useState<ArrayNormalizer<ICurriculumItemYear> | null>(null);

  const [curriculumInputB, setCurriculumInputB] =
    useState<string>("Curriculum After");
  const [curriculumB, setCurriculumB] =
    useState<ArrayNormalizer<ICurriculumItemYear> | null>(null);

  useMemo(() => {
    if (curriculumInputA) {
      if (curriculumInputA === "Curriculum Before") {
        setCurriculumA(curriculumBefore);
      } else if (curriculumInputA === "Curriculum After") {
        setCurriculumA(years);
      } else {
        setCurriculumA(curriculums.byId[String(curriculumInputA)].years);
      }
    }
  }, [curriculumInputA]);

  useMemo(() => {
    if (curriculumInputB) {
      if (curriculumInputB === "Curriculum Before") {
        setCurriculumB(curriculumBefore);
      } else if (curriculumInputB === "Curriculum After") {
        setCurriculumB(years);
      } else {
        setCurriculumB(curriculums.byId[String(curriculumInputB)].years);
      }
    }
  }, [curriculumInputB]);

  const handleCurriculumAChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setCurriculumInputA(newValue);
  };

  const handleCurriculumBChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setCurriculumInputB(newValue);
  };

  const swapTwoInputs = () => {
    const temp = curriculumInputB;
    setCurriculumInputB(curriculumInputA);
    setCurriculumInputA(temp);
  };

  const compareTwoCurriculums = () => {
    if (curriculumA && curriculumB) {
      const { nodes: initialNodes } = getDndNodesAndEdges(
        curriculumA,
        curriculumB
      );
      setNodes(initialNodes);
    }
  };

  const getDisabledInputCondition = () => {
    return (
      !(curriculumInputA || curriculumInputB) ||
      curriculumInputA === curriculumInputB
    );
  };

  return (
    <Box
      sx={{
        overflowX: "auto",
        flexGrow: 1,
        bgColor: "rgba(0, 0, 0, 0)",
        width: width || "100%",
        height: height || 700,
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} py={1}>
        <FormControl fullWidth>
          <InputLabel id="curriculum-b-select-label">Curriculum A</InputLabel>
          <Select
            labelId="curriculum-a-select-label"
            label="Curriculum A"
            id="curriculum-1-select"
            onChange={handleCurriculumAChange}
            value={curriculumInputA}
          >
            <MenuItem key="curriculum-a-before" value={"Curriculum Before"}>
              Before Change
            </MenuItem>
            <MenuItem key="curriculum-a-after" value={"Curriculum After"}>
              After Change
            </MenuItem>
            {curriculums.allIds.map((curriculumId, index) => (
              <MenuItem
                key={`curriculum-a-${index + 1}`}
                value={String(curriculumId)}
              >
                {curriculums.byId[curriculumId].name ||
                  `Curriculum ${index + 1}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display="flex" alignItems="center" justifyContent="center">
          <IconButton
            aria-label="swap curriculum"
            onClick={() => swapTwoInputs()}
          >
            <SwapHorizIcon />
          </IconButton>
        </Box>
        <FormControl fullWidth>
          <InputLabel id="curriculum-b-select-label">Curriculum B</InputLabel>
          <Select
            labelId="curriculum-b-select-label"
            label="Curriculum B"
            id="curriculum-b-select"
            onChange={handleCurriculumBChange}
            value={curriculumInputB}
          >
            <MenuItem key="curriculum-b-before" value={"Curriculum Before"}>
              Before Change
            </MenuItem>
            <MenuItem key="curriculum-b-after" value={"Curriculum After"}>
              After Change
            </MenuItem>
            {curriculums.allIds.map((curriculumId, index) => (
              <MenuItem
                key={`curriculum-a-${index + 1}`}
                value={String(curriculumId)}
              >
                {curriculums.byId[curriculumId].name ||
                  `Curriculum ${index + 1}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button
            fullWidth
            variant="contained"
            size="large"
            endIcon={<CompareArrowsIcon />}
            onClick={() => compareTwoCurriculums()}
            disabled={getDisabledInputCondition()}
            sx={{
              height: "100%",
            }}
          >
            Compare
          </Button>
        </Box>
      </Stack>
      <Box
        sx={{
          height: "calc(100% - 72px)",
        }}
      >
        <ReactFlowProvider>
          <ReactFlow
            className="flow-curriculum-simple-preview-change"
            nodes={nodes}
            edges={[]}
            draggable={false}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </Box>
    </Box>
  );
};

export default CurriculumCompare;
