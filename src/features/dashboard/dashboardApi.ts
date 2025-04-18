import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { DashboardDataResponse } from "../../types";

export const dashboardApiSlice = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://mentoons-backend-zlx3.onrender.com/api/v1/dashboard",
  }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardDataResponse, void>({
      query: () => ({
        url: "/analytics",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApiSlice;
