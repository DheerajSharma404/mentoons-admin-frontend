import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import DynamicTable from "../../components/common/Table";
import { User } from "../../types";

const Users = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("createdAt");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const editUser = (row: any) => {
    navigate(`/user/edit/${row._id}`);
  };

  const removeUser = (row: any) => {
    setUserToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const token = await getToken();
        await axios.delete(
          `https://mentoons-backend-zlx3.onrender.com/api/v1/user/user/${userToDelete.clerkId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userToDelete._id)
        );
        toast.success("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      }
    }
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const viewUser = (row: any) => {
    navigate(`/user/${row._id}`);
    console.log("View user:", row);
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 500),
    []
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const response = await axios.get(
          "https://mentoons-backend-zlx3.onrender.com/api/v1/user/all-users",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              limit,
              page: currentPage,
              sort: `${sortField}:${sortOrder}`,
              search: debouncedSearchTerm,
            },
          }
        );
        console.log("API Response:", response.data);

        if (response.data.success && Array.isArray(response.data.data.users)) {
          setUsers(response.data.data.users);
          setTotalPages(response.data.data.totalPages || 1);
          setTotalUsers(response.data.data.totalCount || 0);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response.data
          );
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [getToken, limit, currentPage, sortField, sortOrder, debouncedSearchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Users</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DynamicTable
            headings={["Name", "Email", "Phone Number", "Role", "Actions"]}
            data={users}
            onEdit={editUser}
            onDelete={removeUser}
            onView={viewUser}
            sortField={sortField}
            onSort={handleSort}
            sortOrder={sortOrder}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalUsers}
            limit={limit}
            onLimitChange={handleLimitChange}
            onPageChange={handlePageChange}
          />
        </>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={userToDelete ? userToDelete.name || "this user" : ""}
      />
    </div>
  );
};

export default Users;
