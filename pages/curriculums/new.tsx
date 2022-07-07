import type { JSXElementConstructor, ReactElement } from "react";

import { useEffect } from "react";

import CurriculumDndLayout from "src/components/_Layout/CurriculumDndLayout";
import CurriculumDragAndDrop from "src/components/_Pages/Curriculums/CurriculumDragAndDrop";
import { loadSampleCoursesAndCurriculums } from "src/redux/_thunks/coursesCurriculums.thunk";
import { useAppDispatch } from "src/hooks/useStore";
import { setCurriculumDetail } from "src/redux/curriculums.slice";
import { CurriculumSlice } from "src/redux/curriculums.slice";
import {
  setupDefaultCourses,
  setupDefaultCurriculum,
} from "src/redux/curriculumChangeHistory.slice";
import { Mode } from "src/constants/mode.const";

export const CurriculumCreatePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    dispatch(loadSampleCoursesAndCurriculums()).then((action) => {
      dispatch(
        setCurriculumDetail({
          ...CurriculumSlice.getInitialState().curriculumDetail,
          mode: Mode.CREATE,
        })
      );
      dispatch(setupDefaultCurriculum());
      dispatch(setupDefaultCourses());
    });
  };

  return <CurriculumDragAndDrop />;
};

CurriculumCreatePage.getLayout = (
  page: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  return <CurriculumDndLayout>{page}</CurriculumDndLayout>;
};

export default CurriculumCreatePage;
