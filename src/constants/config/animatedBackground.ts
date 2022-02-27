import type { ISourceOptions } from "node_modules/tsparticles";

export const animatedBackgroundSet1: ISourceOptions = {
  background: {
    color: {
      value: "#ffffff",
    },
    position: "50% 50%",
    repeat: "no-repeat",
    size: "20%",
  },
  fullScreen: {
    zIndex: -1,
  },
  interactivity: {
    events: {
      // onClick: {
      //   enable: true,
      //   mode: "repulse",
      // },
      onHover: {
        enable: true,
        mode: "bubble",
      },
    },
    modes: {
      bubble: {
        distance: 250,
        duration: 2,
        opacity: 0,
        size: 0,
      },
      grab: {
        distance: 400,
      },
      repulse: {
        distance: 400,
      },
    },
  },
  particles: {
    color: {
      value: "#e3e5e8",
    },
    links: {
      color: {
        value: "#e3e5e8",
      },
      distance: 150,
      opacity: 0.4,
    },
    move: {
      attract: {
        rotate: {
          x: 600,
          y: 600,
        },
      },
      enable: true,
      outModes: {
        default: "out",
        bottom: "out",
        left: "out",
        right: "out",
        top: "out",
      },
      random: true,
      speed: 1,
    },
    number: {
      density: {
        enable: true,
      },
      value: 80,
    },
    opacity: {
      random: {
        enable: true,
        minimumValue: 0,
      },
      value: {
        min: 0,
        max: 1,
      },
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0,
      },
    },
    size: {
      random: {
        enable: true,
        minimumValue: 0,
      },
      value: {
        min: 1,
        max: 10,
      },
      animation: {
        speed: 4,
        minimumValue: 0.3,
      },
    },
  },
};
