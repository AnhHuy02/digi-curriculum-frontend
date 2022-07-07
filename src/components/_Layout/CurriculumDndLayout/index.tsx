import type { FC } from "react";

import Particles from "react-tsparticles";
import Box from "@mui/material/Box";
import "react-reflex/styles.css";

import Header from "./Header";
import { animatedBackgroundSet1 } from "src/constants/config/animatedBackground";

interface ICurriculumDndLayout {
  children?: JSX.Element;
}

const CurriculumDndLayout: FC<ICurriculumDndLayout> = (props) => {
  return (
    <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
      <Header />
      <Box component="main" className={"page-layout__content"} flexGrow={1}>
        <Particles
          id="tsparticles"
          // init={particlesInit}
          // loaded={particlesLoaded}
          options={animatedBackgroundSet1}
        />
        {props.children}
      </Box>
    </Box>
  );
};

export default CurriculumDndLayout;
