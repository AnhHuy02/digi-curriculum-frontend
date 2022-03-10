export interface IMajorSimple {
  id: string;
  name: string;
}

export interface IRandomMajorsReturn {
  allMajors: Record<string, IMajorSimple>;
  allMajorIds: string[];
}
