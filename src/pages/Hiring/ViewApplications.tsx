import { useState, useCallback, useEffect } from "react";
import DynamicTable from "../../components/common/Table";
import { useAppliedJobQuery } from "../../features/career/careerApi";
import { JobApplication } from "../../types";
import debounce from "lodash/debounce";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";

const ViewApplications = () => {
  const [sortOrder, setSortOrder] = useState<1 | -1>(-1);
  const [sortField, setSortField] = useState<string>("name");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const { data, isLoading } = useAppliedJobQuery({
    sortOrder,
    searchTerm: debouncedSearchTerm,
    page: Number(currentPage),
    limit,
  });

  const handleEdit = (application: JobApplication) => {
    console.log("Edit application:", application);
  };

  const handleDelete = (application: JobApplication) => {
    console.log("Delete application:", application);
  };

  const handleView = (application: JobApplication) => {
    console.log("View application:", application);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === 1 ? -1 : 1));
    } else {
      setSortField(field);
      setSortOrder(-1);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
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
    setCurrentPage(1);
  }, [searchTerm]);

  if (isLoading) return <Loader />;
  if (!data || !data.data)
    return (
      <div className="h-screen flex items-center justify-center">
        No data available
      </div>
    );
  const { jobs = [], totalPages, totalJobs } = data?.data;

  return (
    <div className="w-full max-w-full">
      <h1 className="text-2xl font-bold mb-6">View All Job Applications</h1>

      <div className="overflow-hidden">
        <DynamicTable
          headings={[
            "Name",
            "Email",
            "Phone",
            "Gender",
            "Portfolio Link",
            "Cover Note",
            "Resume Link",
            "Cover Letter Link",
          ]}
          data={jobs}
          sortField={sortField}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onSort={handleSort}
          sortOrder={sortOrder === 1 ? "asc" : "desc"}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
        />
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalJobs}
          limit={limit}
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ViewApplications;
