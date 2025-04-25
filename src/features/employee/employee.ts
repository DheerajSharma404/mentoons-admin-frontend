import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Employee,
  EmployeeDataResponse,
  SingleEmployeeDataResponse,
} from "../../types/interfaces";

export const employeeSlice = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://mentoons-backend-zlx3.onrender.com/api/v1/admin/employee",
  }),
  tagTypes: ["Employees"],
  endpoints: (builder) => ({
    getEmployees: builder.query<
      EmployeeDataResponse,
      { sortOrder: string; searchTerm: string; page: number; limit: number }
    >({
      query: ({ sortOrder, searchTerm, page, limit }) => ({
        url: `/?&sortOrder=${sortOrder}&search=${searchTerm}&page=${page}&limit=${limit}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
      providesTags: ["Employees"],
    }),
    getEmployeeById: builder.query<SingleEmployeeDataResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
    }),
    createEmployee: builder.mutation<EmployeeDataResponse, Employee>({
      query: (employee) => ({
        url: "/",
        method: "POST",
        body: employee,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["Employees"],
    }),
    deleteEmployee: builder.mutation<EmployeeDataResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["Employees"],
    }),
    updateEmployee: builder.mutation<EmployeeDataResponse, Employee>({
      query: (employee) => ({
        url: `/${employee._id}`,
        method: "PUT",
        body: employee,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeeByIdQuery,
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
} = employeeSlice;
