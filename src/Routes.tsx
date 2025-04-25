import React from "react";
import { Route, Routes as RouterRoutes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import {
  AddProducts,
  AllJobs,
  AllottedCalls,
  ApplicationDetails,
  AssesmentForm,
  AssesmentReports,
  CallRequest,
  CreateJob,
  Dashboard,
  DashboardAnalytics,
  GeneralQueries,
  GetWorkshopEnquiries,
  JobDetails,
  LogIn,
  Newsletter,
  ProductTable,
  Register,
  TaskDetails,
  TaskManagerDashboard,
  Tasks,
  UserCalender,
  UserProfile,
  Users,
  ViewApplications,
  ViewEnquiry,
  ViewProduct,
  ViewUser,
  Welcome,
} from "./pages/index";
import TaskStatistics from "./pages/TasksStaistics";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import EmployeeDetail from "./pages/employee/employeeDetails";
import EmployeeTable from "./pages/employee/emplyeeTable";
import AddEditEmployeePage from "./pages/employee/addEditEmployee";
const routes = [
  { path: "/", component: <Welcome />, exact: true },
  { path: "/dashboard", component: <Dashboard />, exact: true },

  { path: "/sign-in", component: <LogIn />, exact: true },
  { path: "/sign-up", component: <Register />, exact: true },
  {
    path: "/users",
    component: (
      <MainLayout>
        <Users />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/taskDashboard",
    component: (
      <MainLayout>
        <TaskManagerDashboard />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/tasks",
    component: (
      <MainLayout>
        <Tasks />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/UserProfile",
    component: (
      <MainLayout>
        <UserProfile />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/taskStatistics",
    component: (
      <MainLayout>
        <TaskStatistics />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/calender",
    component: (
      <MainLayout>
        <UserCalender />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/taskDetails/:taskId",
    component: (
      <MainLayout>
        <TaskDetails />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/task/:taskId",
    component: (
      <MainLayout>
        <TaskDetails />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/employee-table",
    component: (
      <MainLayout>
        <EmployeeTable />
      </MainLayout>
    ),
  },
  {
    path: "/employee/:id",
    component: (
      <MainLayout>
        <EmployeeDetail />
      </MainLayout>
    ),
  },
  {
    path: "/employee/add",
    component: (
      <MainLayout>
        <AddEditEmployeePage />
      </MainLayout>
    ),
  },
  {
    path: "/employee/edit/:id",
    component: (
      <MainLayout>
        <AddEditEmployeePage />
      </MainLayout>
    ),
  },
  {
    path: "/add-products",
    component: (
      <MainLayout>
        <ProtectedRoutes>
          <AddProducts />
        </ProtectedRoutes>
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/product-table",
    component: (
      <MainLayout>
        <ProtectedRoutes>
          <ProductTable />
        </ProtectedRoutes>
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/products/:productId",
    component: (
      <MainLayout>
        <ProtectedRoutes>
          <ViewProduct />
        </ProtectedRoutes>
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/all-jobs",
    component: (
      <MainLayout>
        <ProtectedRoutes>
          <AllJobs />
        </ProtectedRoutes>
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/hiring-form",
    component: (
      <MainLayout>
        <ProtectedRoutes>
          <CreateJob />
        </ProtectedRoutes>
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/view-applications",
    component: (
      <MainLayout>
        <ProtectedRoutes>
          <ViewApplications />
        </ProtectedRoutes>
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/view-applications/:applicationId",
    component: (
      <MainLayout>
        <ProtectedRoutes>
          <ApplicationDetails />
        </ProtectedRoutes>
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/job-details/:jobId",
    component: (
      <MainLayout>
        <ProtectedRoutes>
          <JobDetails />
        </ProtectedRoutes>
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/dashboard-analytics",
    component: (
      <MainLayout>
        <ProtectedRoutes>
          <DashboardAnalytics />
        </ProtectedRoutes>
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/workshop-enquiries",
    component: (
      <MainLayout>
        <ProtectedRoutes>
          <GetWorkshopEnquiries />
        </ProtectedRoutes>
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/user/:userId",
    component: (
      <MainLayout>
        <ProtectedRoutes>
          <ViewUser />
        </ProtectedRoutes>
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/enquiries/:enquiryId",
    component: (
      <MainLayout>
        <ViewEnquiry />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/assesment-form",
    component: (
      <MainLayout>
        <AssesmentForm />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/call-request",
    component: (
      <MainLayout>
        <CallRequest />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/allotted-calls",
    component: (
      <MainLayout>
        <AllottedCalls />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/assesment-reports",
    component: (
      <MainLayout>
        <AssesmentReports />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/general-queries",
    component: (
      <MainLayout>
        <GeneralQueries />
      </MainLayout>
    ),
    exact: true,
  },
  {
    path: "/newsletter",
    component: (
      <MainLayout>
        <Newsletter />
      </MainLayout>
    ),
    exact: true,
  },
];

const Routes: React.FC = () => {
  return (
    <RouterRoutes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.component} />
      ))}
    </RouterRoutes>
  );
};

export default Routes;
