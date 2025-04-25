import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import DynamicTable from "../../components/common/Table";
import {
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
} from "../../features/employee/employee";
import { JobData } from "../../types";
import { errorToast, successToast } from "../../utils/toastResposnse";
import { Employee } from "../../types/interfaces";

const EmployeeTable = () => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  const { data, isLoading, isError, error } = useGetEmployeesQuery({
    sortOrder,
    searchTerm: debouncedSearchTerm,
    page: currentPage,
    limit,
  });

  console.log("data of employees recieved : ", data?.data);

  const [deleteEmployee] = useDeleteEmployeeMutation();
  const handleEdit = (job: JobData) => {
    navigate("/hiring-form", { state: { id: job._id } });
  };

  const handleDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete && employeeToDelete._id) {
      try {
        const result = await deleteEmployee(employeeToDelete._id).unwrap();
        if (result.success) {
          successToast(result.data.message || "Job deleted successfully");
        } else {
          errorToast(result.data.message || "Failed to delete job");
        }
      } catch (error) {
        console.log(error);
        errorToast("Failed to delete job");
      }
    }
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  const handleView = (employee: Employee) => {
    navigate(`/employee/${employee._id}`);
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    debouncedSearch(event.target.value);
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (isLoading) return <Loader />;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;
  if (!data || !data.data || !data.data.employees)
    return (
      <div className="flex items-center justify-center h-screen">
        No data available
      </div>
    );

  const { employees, totalPages, totalEmployees } = data.data;

  const updatedEmployees = employees.map((employee: Employee) => {
    const { place, profilePicture, ...rest } = employee;
    console.log(place, profilePicture);
    return rest;
  });

  return (
    <div className="h-full p-4">
      <h1 className="mb-4 text-2xl font-bold">All Jobs</h1>
      <DynamicTable
        headings={[
          "ID",
          "Mail",
          "Phone",
          "Role",
          "Department",
          "Joined At",
          "Active",
        ]}
        data={updatedEmployees}
        sortField="createdAt"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onSort={handleSort}
        sortOrder={sortOrder}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
      />
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalEmployees}
          limit={limit}
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
        />
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={
          employeeToDelete ? employeeToDelete.name || "this employee" : ""
        }
      />
    </div>
  );
};

export default EmployeeTable;
