export interface IRange {
  min: number;
  max: number;
}

export type OtherType<T> = {
  [otherKey in keyof T]: T[otherKey];
};
