import type { Elements } from "react-flow-renderer";

import { ArrowHeadType } from "react-flow-renderer";

export const initialElements: Elements = [
  {
    id: "1",
    type: "input",
    data: {
      label: (
        <>
          Welcome to <strong>React Flow!</strong>
        </>
      ),
    },
    position: { x: 250, y: 0 },
  },
  {
    id: "2",
    data: {
      label: (
        <>
          This is a <strong>default node</strong>
        </>
      ),
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    data: {
      label: (
        <>
          This one has a <strong>custom style</strong>
        </>
      ),
    },
    position: { x: 400, y: 100 },
    style: {
      background: "#D6D5E6",
      color: "#333",
      border: "1px solid #222138",
      width: 180,
    },
  },
  {
    id: "4",
    position: { x: 250, y: 200 },
    data: {
      label: "Another default node",
    },
  },
  {
    id: "5",
    data: {
      label: "Node id: 5",
    },
    position: { x: 250, y: 325 },
  },
  {
    id: "6",
    type: "output",
    data: {
      label: (
        <>
          An <strong>output node</strong>
        </>
      ),
    },
    position: { x: 100, y: 480 },
  },
  {
    id: "7",
    type: "output",
    data: { label: "Another output node" },
    position: { x: 400, y: 450 },
  },
  { id: "e1-2", source: "1", target: "2", label: "this is an edge label" },
  { id: "e1-3", source: "1", target: "3" },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    label: "animated edge",
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    arrowHeadType: ArrowHeadType.ArrowClosed,
    label: "edge with arrow head",
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    type: "smoothstep",
    label: "smooth step edge",
  },
  {
    id: "6-e5",
    source: "6",
    target: "6",
    type: "smoothstep",
    label: "YEEEEEET",
  },
  {
    id: "e5-7",
    source: "5",
    target: "7",
    type: "step",
    style: { stroke: "#f6ab6c" },
    label: "a step edge",
    animated: true,
    labelStyle: { fill: "#f6ab6c", fontWeight: 700 },
  },
];

export const initialElements2: Elements = [
  {
    id: "1",
    data: {
      label: "Node 1",
    },
    position: {
      x: 490,
      y: 40,
    },
  },
  {
    id: "2",
    data: {
      label: "Node 2",
    },
    position: {
      x: 270,
      y: 130,
    },
  },
  {
    id: "2a",
    data: {
      label: "Node 2a",
    },
    position: {
      x: 40,
      y: 220,
    },
  },
  {
    id: "2b",
    data: {
      label: "Node 2b",
    },
    position: {
      x: 270,
      y: 220,
    },
  },
  {
    id: "2c",
    data: {
      label: "Node 2c",
    },
    position: {
      x: 470,
      y: 220,
    },
  },
  {
    id: "2d",
    data: {
      label: "Node 2d",
    },
    position: {
      x: 515,
      y: 310,
    },
  },
  {
    id: "3",
    data: {
      label: "Node 3",
    },
    position: {
      x: 470,
      y: 130,
    },
  },
  {
    id: "e12",
    source: "1",
    target: "2",
    type: "smart",
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "e13",
    source: "1",
    target: "3",
    type: "smart",
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "e22a",
    source: "2",
    target: "2a",
    type: "smart",
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "e22b",
    source: "2",
    target: "2b",
    type: "smart",
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "e22c",
    source: "2",
    target: "2c",
    type: "smart",
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "e2c2d",
    source: "2c",
    target: "2d",
    type: "smart",
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "e2d2c",
    source: "2d",
    target: "2c",
    type: "smart",
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: "e2d1",
    source: "2d",
    target: "1",
    type: "smart",
    arrowHeadType: ArrowHeadType.Arrow,
    label: "Node 2d to Node 1",
  },
  {
    id: "e2a2a",
    source: "2a",
    target: "2a",
    type: "smart",
    arrowHeadType: ArrowHeadType.Arrow,
  },
];

export const initialElements3: Elements = [
  { id: "node1", data: { label: "Target" }, position: { x: 0, y: 0 } },
  { id: "node2", data: { label: "Source" }, position: { x: 0, y: 200 } },
  { id: "node3", data: { label: "Source" }, position: { x: 200, y: 200 } },
  { id: "node4", data: { label: "Source" }, position: { x: 200, y: 0 } },
  {
    id: `edge-1`,
    target: "node1",
    source: `node2`,
    type: "floating",
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: `edge-2`,
    target: "node1",
    source: `node3`,
    type: "floating",
    arrowHeadType: ArrowHeadType.Arrow,
  },
  {
    id: `edge-3`,
    target: "node1",
    source: `node4`,
    type: "floating",
    arrowHeadType: ArrowHeadType.Arrow,
  },
];
