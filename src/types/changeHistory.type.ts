export type PayloadHistoryAction<T, U extends any> = {
  type: T;
  patch: U;
  createdAt?: string | number;
};

export type ChangeHistory<T> = {
  commandLogs: Array<T>;
  currentIndex: number;
};
