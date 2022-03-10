// import type { FC } from "react";

// import { useEffect } from "react";
// import Box from "@mui/material/Box";

// import { useAppSelector } from "src/hooks/useStore";
// import { CurriculumDiagramType as DiagramType } from "src/constants/curriculum.const";
// import style from "./index.module.scss";

// interface DiagramPaneProps {
//   viewMode: DiagramType;
// }

// interface ICourseNodeProps {}

// const CourseNode: FC<DiagramPaneProps> = () => {
//   const { diagramViewMode } = useAppSelector((store) => store.curriculums);

//   return (
//     <Box display="flex" flexDirection={"column"} height={"100%"}>
//       <Handle
//         type="target"
//         position="left"
//         isValidConnection={isValidConnection}
//       />
//       <div>{id}</div>
//       <Handle
//         type="source"
//         position="right"
//         isValidConnection={isValidConnection}
//       />
//     </Box>
//   );
// };

// export default CourseNode;
