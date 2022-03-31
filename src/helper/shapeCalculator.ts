export const getRectangleInfo = (
  x1: number | string,
  y1: number | string,
  x2: number | string,
  y2: number | string
) => {
  return {
    midpoint: {
      x: (Number(x1) + Number(x2)) / 2,
      y: (Number(y1) + Number(y2)) / 2,
    },
    width: Math.abs(Number(x1) - Number(x2)),
    height: Math.abs(Number(y1) - Number(y2)),
  };
};
