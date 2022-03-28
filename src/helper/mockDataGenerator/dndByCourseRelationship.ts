import type { Node, Edge } from "react-flow-renderer";

import { Position } from "react-flow-renderer";

export const initialNodes: Node[] = [
  {
    id: "2",
    data: { label: "Sem 1" },
    position: { x: 100, y: 100 },
    className: "light",
    style: { backgroundColor: "rgba(255, 0, 0, 0.2)", width: 200, height: 200 },
  },
  {
    id: "4",
    data: { label: "Sem 2" },
    position: { x: 320, y: 200 },
    className: "light",
    style: { backgroundColor: "rgba(255, 0, 0, 0.2)", width: 300, height: 300 },
  },
  // {
  //   id: "1",
  //   type: "input",
  //   data: { label: "Node 0" },
  //   position: { x: 250, y: 5 },
  //   className: "light",
  // },
  {
    id: "2a",
    data: { label: "Node A.1" },
    position: { x: 10, y: 50 },
    parentNode: "2",
  },
  {
    id: "3",
    data: { label: "Node 1" },
    position: { x: 320, y: 100 },
    className: "light",
  },

  {
    id: "4a",
    data: { label: "Node B.1" },
    position: { x: 15, y: 65 },
    className: "light",
    parentNode: "4",
    extent: "parent",
  },
  {
    id: "4b",
    data: { label: "Group B.A" },
    position: { x: 15, y: 120 },
    className: "light",
    style: {
      backgroundColor: "rgba(255, 0, 255, 0.2)",
      height: 150,
      width: 270,
    },
    parentNode: "4",
  },
  {
    id: "4b1",
    data: { label: "Node B.A.1" },
    position: { x: 20, y: 40 },
    className: "light",
    parentNode: "4b",
  },
  {
    id: "4b2",
    data: { label: "Node B.A.2" },
    position: { x: 100, y: 100 },
    className: "light",
    parentNode: "4b",
  },
];

export const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2a-4a", source: "2a", target: "4a" },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e3-4b", source: "3", target: "4b" },
  { id: "e4a-4b1", source: "4a", target: "4b1" },
  { id: "e4a-4b2", source: "4a", target: "4b2" },
  { id: "e4b1-4b2", source: "4b1", target: "4b2" },
];

export const initialNodes2: Node[] = [
  {
    id: "sem1",
    data: { label: "Sem 1" },
    position: { x: 100, y: 100 },
    className: "light",
    style: { backgroundColor: "rgba(255, 0, 0, 0.2)", width: 160, height: 500 },
  },
  {
    id: "course-1",
    data: { label: "Course 1" },
    position: { x: 20, y: 40 },
    parentNode: "sem1",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { width: 120, height: 80 },
    extent: "parent",
  },
  {
    id: "course-2",
    data: { label: "Course 2" },
    position: { x: 20, y: 140 },
    parentNode: "sem1",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { width: 120, height: 80 },
    extent: "parent",
  },
  {
    id: "course-3",
    data: { label: "Course 3" },
    position: { x: 20, y: 240 },
    parentNode: "sem1",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { width: 120, height: 80 },
    extent: "parent",
  },
  {
    id: "course-4",
    data: { label: "Course 4" },
    position: { x: 20, y: 340 },
    parentNode: "sem1",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { width: 120, height: 80 },
    extent: "parent",
  },
  {
    id: "course-add-1",
    data: { label: "Add course" },
    position: { x: 20, y: 440 },
    parentNode: "sem1",
    draggable: false,
    // type: "group",
    style: { width: 120 },
  },
  {
    id: "sem2",
    data: { label: "Sem 2" },
    position: { x: 300, y: 100 },
    className: "light",
    style: { backgroundColor: "rgba(255, 0, 0, 0.2)", width: 160, height: 500 },
  },
  {
    id: "course-5",
    data: { label: "Course 5" },
    position: { x: 20, y: 40 },
    parentNode: "sem2",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { width: 120, height: 80 },
    extent: "parent",
  },
  {
    id: "course-6",
    data: { label: "Course 6" },
    position: { x: 20, y: 140 },
    parentNode: "sem2",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { width: 120, height: 80 },
    extent: "parent",
  },
  {
    id: "course-7",
    data: { label: "Course 7" },
    position: { x: 20, y: 240 },
    parentNode: "sem2",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { width: 120, height: 80 },
    extent: "parent",
  },
];

const initialEdges2: Edge[] = [
  {
    id: "course1-6",
    source: "course-1",
    target: "course-6",
  },
  {
    id: "course2-6",
    source: "course-2",
    target: "course-6",
  },
  {
    id: "course7-2",
    source: "course-7",
    target: "course-2",
  },
];
