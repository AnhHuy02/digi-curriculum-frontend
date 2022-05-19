export type PayloadHistoryAction<T, U extends any> = {
  type: T;
  patch: U;
};

export type ChangeHistory<T> = {
  commandLogs: Array<T>;
  currentIndex: number;
};
