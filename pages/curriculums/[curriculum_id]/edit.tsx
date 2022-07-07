import type { JSXElementConstructor, ReactElement } from "react";
import type { ArrayNormalizer } from "src/types/Normalizer.type";
import type { IMajor } from "src/types/Department.type";
import type { ICourse } from "src/types/Course.type";
import type { ICurriculum } from "src/types/Curriculum.type";

import { useEffect } from "react";

import CurriculumDndLayout from "src/components/_Layout/CurriculumDndLayout";
import CurriculumDragAndDrop from "src/components/_Pages/Curriculums/CurriculumDragAndDrop";
import {
  loadRandomCoursesAndCurriculums,
  loadSampleCoursesAndCurriculums,
} from "src/redux/_thunks/coursesCurriculums.thunk";
import { useAppDispatch, useAppSelector } from "src/hooks/useStore";
import { addCourses, selectCourses } from "src/redux/courses.slice";
import { setCurriculumDetail } from "src/redux/curriculums.slice";
import {
  setupDefaultCourses,
  setupDefaultCurriculum,
} from "src/redux/curriculumChangeHistory.slice";
import { Mode } from "src/constants/mode.const";

export const CurriculumEditPage = (props: any) => {
  const dispatch = useAppDispatch();
  const mockDataMode = useAppSelector(
    (store) => store.curriculums.mockDataMode
  );
  const curriculum_id: string = props.curriculum_id;

  useEffect(() => {
    initialize();
  }, []);

  const loadSampleData = () => {
    dispatch(loadSampleCoursesAndCurriculums()).then((action) => {
      const { majors, courses, curriculums } = action.payload as {
        majors: ArrayNormalizer<IMajor>;
        courses: ArrayNormalizer<ICourse>;
        curriculums: ArrayNormalizer<ICurriculum>;
      };

      setupCurriculumDetail({ majors, courses, curriculums });
    });
  };

  const loadRandomData = () => {
    dispatch(loadRandomCoursesAndCurriculums()).then((action) => {
      const { majors, courses, curriculums } = action.payload as {
        majors: ArrayNormalizer<IMajor>;
        courses: ArrayNormalizer<ICourse>;
        curriculums: ArrayNormalizer<ICurriculum>;
      };

      setupCurriculumDetail({ majors, courses, curriculums });
    });
  };

  const setupCurriculumDetail = ({
    majors,
    courses,
    curriculums,
  }: {
    majors: ArrayNormalizer<IMajor>;
    courses: ArrayNormalizer<ICourse>;
    curriculums: ArrayNormalizer<ICurriculum>;
  }) => {
    const curriculumExist = curriculums.allIds.some(
      (curriculumId) => curriculumId === (curriculum_id as string)
    );

    if (curriculumExist) {
      const curriculum = curriculums.byId[curriculum_id as string];
      dispatch(
        setCurriculumDetail({
          id: curriculum.id,
          loading: false,
          mode: Mode.EDIT,
          semCountPerYear: 3,
          year: curriculum.year,
          name: curriculum.name,
          major: curriculum.major,
          programType: curriculum.programType,
          englishLevel: curriculum.englishLevel,
          years: curriculum.years,
        })
      );

      const curriculumCourseIds: string[] = curriculum.years.allIds.reduce(
        (yearCourseIds: string[], yearId) => {
          const year = curriculum.years.byId[yearId as string];

          const semesterCourseIdsTemp = year.semesters.allIds.reduce(
            (semesterCourseIds: string[], semesterId) => {
              const semester = year.semesters.byId[semesterId];

              return [...semesterCourseIds, ...semester.courseIds];
            },
            []
          );

          return [...yearCourseIds, ...semesterCourseIdsTemp];
        },
        []
      );

      dispatch(selectCourses([...curriculumCourseIds]));
      dispatch(addCourses());
      dispatch(setupDefaultCurriculum());
      dispatch(setupDefaultCourses());
    } else {
      console.warn("Item not found");
      console.error("Item not found");
    }
  };

  const initialize = async () => {
    const { curriculum_id } = props;

    if (!curriculum_id) {
      console.warn("Item not found");
      console.error("Item not found");
    } else {
      if (mockDataMode === "SAMPLE") {
        loadSampleData();
      } else if (mockDataMode === "RANDOM") {
        loadRandomData();
      }
    }
  };

  return <CurriculumDragAndDrop />;
};

CurriculumEditPage.getLayout = (
  page: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  return <CurriculumDndLayout>{page}</CurriculumDndLayout>;
};

CurriculumEditPage.getInitialProps = async (ctx: any) => {
  return ctx.query;
};

// export async function getServerSideProps() {
//   // Fetch data from external API
//   const asd = await store.dispatch(loadAllRandomMajors({ min: 1, max: 15 }));
//   console.log(asd);
//   // const res = await fetch(`https://.../data`);
//   // const data = await res.json();

//   // Pass data to the page via props
//   return { props: {} };
//   // return { props: { data } };
// }

export default CurriculumEditPage;
