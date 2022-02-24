import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "src/redux/_store";

import { useDispatch, useSelector } from "react-redux";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
