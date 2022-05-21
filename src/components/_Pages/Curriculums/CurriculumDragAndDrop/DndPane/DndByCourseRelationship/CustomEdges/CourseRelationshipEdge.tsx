import type { FC, CSSProperties, MouseEvent } from "react";
import type { Position } from "react-flow-renderer";

import {
  getBezierPath,
  getEdgeCenter,
  // getMarkerEnd,
  // useEdgesState,
} from "react-flow-renderer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import styles from "./CourseRelationshipEdge.module.scss";
import { useAppDispatch } from "src/hooks/useStore";
import { removeCourseRelationship } from "src/redux/courses.slice";

const foreignObjectSize = {
  width: 120,
  height: 40,
};

interface RemoveRelationshipEdgeProps {
  id?: string;
  source: string;
  sourceX: number;
  sourceY: number;
  target: string;
  targetX: number;
  targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  style?: CSSProperties;
  markerEnd?: string;
  data?: {
    label?: string;
    highlighted?: boolean;
    // courseSourceId?: string;
    // courseTargetId?: string;
  };
}

const RemoveRelationshipEdge = ({
  id,
  source,
  sourceX,
  sourceY,
  target,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  // style,
  markerEnd,
  data,
}: RemoveRelationshipEdgeProps) => {
  const { label, highlighted } = data || {};

  const dispatch = useAppDispatch();
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onEdgeClick = (evt: MouseEvent<HTMLButtonElement>, id?: string) => {
    evt.stopPropagation();
    dispatch(
      removeCourseRelationship({
        courseSourceId: source,
        courseTargetId: target,
      })
    );
  };

  return (
    <>
      <path
        id={id}
        style={{
          ...(highlighted
            ? { stroke: "rgba(224, 67, 67, 1)", strokeWidth: 3, zIndex: 1000 }
            : { stroke: "black", strokeWidth: 1, zIndex: -69 }),
          // zIndex: 9000
          // stroke: highlighted ? "rgba(224, 67, 67, 1)" : "black",
          // strokeWidth: highlighted ? 2 : 1,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize.width}
        height={foreignObjectSize.height}
        x={edgeCenterX - foreignObjectSize.width / 2}
        y={edgeCenterY - foreignObjectSize.height / 2}
        className={styles["edgebutton-foreignobject"]}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <Box
          component="span"
          sx={{
            background: "transparent",
            // width: "100px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            minHeight: "40px",
            // backgroundColor: "rgba(0,0,0, 0.1)",
          }}
        >
          <Typography variant={`overline`}>{label}</Typography>
          {highlighted && (
            <button
              className={styles.edgebutton}
              onClick={(event) => onEdgeClick(event, id)}
            >
              ×
            </button>
          )}
        </Box>
      </foreignObject>
    </>
  );
};

export default RemoveRelationshipEdge;
