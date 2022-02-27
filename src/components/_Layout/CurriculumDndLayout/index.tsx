import type { FC } from "react";

import Particles from "react-tsparticles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Header from "./Header";
import { animatedBackgroundSet1 } from "src/constants/config/animatedBackground";

interface ICurriculumDndLayout {
  children?: JSX.Element;
}

const CurriculumDndLayout: FC<ICurriculumDndLayout> = (props) => {
  return (
    <Box>
      <Header />
      <Box component="main">
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
