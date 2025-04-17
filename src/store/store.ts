import { configureStore } from "@reduxjs/toolkit";
import { careerApiSlice } from "../features/career/careerApi";
import { dashboardApiSlice } from "../features/dashboard/dashboardApi";
import { workshopApiSlice } from "../features/workshop/workshopApi";

const store = configureStore({
    reducer: {
        [careerApiSlice.reducerPath]:careerApiSlice.reducer,
        [dashboardApiSlice.reducerPath]:dashboardApiSlice.reducer,
        [workshopApiSlice.reducerPath]:workshopApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(careerApiSlice.middleware,dashboardApiSlice.middleware,workshopApiSlice.middleware),
})

export default store;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;