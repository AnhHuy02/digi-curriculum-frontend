export type ArrayNormalizer<T> = {
  byId: Record<string | number, T>;
  allIds: (string | number)[];
};
