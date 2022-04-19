import type { FC, CSSProperties, MouseEvent } from "react";
import type { Position } from "react-flow-renderer";

import {
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,
  useEdgesState,
} from "react-flow-renderer";
import Box from "@mui/material/Box";

import styles from "./RemoveRelationshipEdge.module.scss";
import { useAppDispatch } from "src/hooks/useStore";
import { removeCourseRelationship } from "src/redux/courses.slice";

const foreignObjectSize = 40;

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
}

const RemoveRelationshipEdge: FC<RemoveRelationshipEdgeProps> = ({
  id,
  source,
  sourceX,
  sourceY,
  target,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}) => {
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
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        className={styles["edgebutton-foreignobject"]}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <Box
          sx={{
            background: "transparent",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40px",
          }}
        >
          <button
            className={styles.edgebutton}
            onClick={(event) => onEdgeClick(event, id)}
          >
            ×
          </button>
        </Box>
      </foreignObject>
    </>
  );
};

export default RemoveRelationshipEdge;
