import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { JobApplicationResponse, JobData, JobDataResponse, singleJobDataResponse } from "../../types";



export const careerApiSlice = createApi({
   reducerPath: 'careerApi',
   baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}/career` }),
   tagTypes: ['Jobs'],
   endpoints: (builder) => ({
      getJobs: builder.query<JobDataResponse, {sortOrder: string,searchTerm:string,page:number,limit:number}>({
         query: ({sortOrder,searchTerm,page,limit}) => ({
            url: `/jobs?&sortOrder=${sortOrder}&search=${searchTerm}&page=${page}&limit=${limit}`,
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               // 'Authorization':`Bearer ${localStorage.getItem('token')}`
            }
         }),
         providesTags: ['Jobs']
      }),
      getJobById: builder.query<singleJobDataResponse, string>({
         query: (id) => ({
            url: `/jobs/${id}`,
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
            }
         }),
      }),
      createJob: builder.mutation<JobDataResponse, JobData>({
         query: (job) => ({
            url: '/jobs',
            method: 'POST',
            body: job,
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
            }
         }),
         invalidatesTags: ['Jobs']
      }),
      updateJob: builder.mutation<JobDataResponse, JobData>({
         query: (job) => ({
            url: `/jobs/${job._id}`,
            method: 'PUT',
            body: job,
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
            }
         }),
         invalidatesTags: ['Jobs']
      }),
      deleteJob: builder.mutation<JobDataResponse, string>({
         query: (id) => ({
            url: `/jobs/${id}`,
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
            }
         }),
         invalidatesTags: ['Jobs']
      }),
      appliedJob: builder.query<JobApplicationResponse, {sortOrder: number,searchTerm:string,page:number,limit:number}>({
         query: ({sortOrder,searchTerm,page,limit}) => ({
            url: `/applied?&sortOrder=${sortOrder}&search=${searchTerm}&page=${page}&limit=${limit}`,
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
            }
         }),
      })
   })
})

export const { useGetJobsQuery, useCreateJobMutation, useUpdateJobMutation, useDeleteJobMutation,useAppliedJobQuery,useGetJobByIdQuery } = careerApiSlice