import type { JSXElementConstructor, ReactElement } from "react";

import CurriculumDndLayout from "src/components/_Layout/CurriculumDndLayout";
import CurriculumDragAndDrop from "src/components/_Pages/Curriculums/CurriculumDragAndDrop";

export const CurriculumCreatePage = () => {
  return <CurriculumDragAndDrop />;
};

CurriculumCreatePage.getLayout = (
  page: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  return <CurriculumDndLayout>{page}</CurriculumDndLayout>;
};

export default CurriculumCreatePage;
