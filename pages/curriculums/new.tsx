import type { JSXElementConstructor, ReactElement } from "react";

import { useEffect } from "react";

import CurriculumDndLayout from "src/components/_Layout/CurriculumDndLayout";
import CurriculumDragAndDrop from "src/components/_Pages/Curriculums/CurriculumDragAndDrop";
// import { store } from "src/redux/_store";
import { loadAllRandomMajors, loadAllRandomCourses } from "src/redux/courses.slice";
import { useAppDispatch } from "src/hooks/useStore";

export const CurriculumCreatePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // dispatch(loadAllRandomMajors({ min: 1, max: 15 }));
    initialize();
  }, []);

  const initialize = async() => {
    const response = await dispatch(loadAllRandomMajors({ min: 1, max: 15 }));
    // const { allMajors, allMajorIds } = response.payload as any;
    // console.log(re.payload)
    dispatch(loadAllRandomCourses(response.payload as any))
  }
  
  return <CurriculumDragAndDrop />;
};

CurriculumCreatePage.getLayout = (
  page: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  return <CurriculumDndLayout>{page}</CurriculumDndLayout>;
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

export default CurriculumCreatePage;
