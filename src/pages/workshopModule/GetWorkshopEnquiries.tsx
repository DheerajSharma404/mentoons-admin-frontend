import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';
import { useGetEnquiriessQuery } from "../../features/workshop/workshopApi";
import DynamicTable from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { headings } from "../../utils/constants";
import { WorkshopEnquiry } from "../../types";
import Loader from "../../components/common/Loader";

const GetWorkshopEnquiries = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<WorkshopEnquiry[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<WorkshopEnquiry | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalEnquiries, setTotalEnquiries] = useState<number>(0);

  const { data, isLoading, isSuccess } = useGetEnquiriessQuery({
    sort: sortOrder,
    page: currentPage,
    limit: limit,
  });
  console.log(data,'llkk');
  useEffect(() => {
    if (isSuccess && data?.data) {
      setEnquiries(data.data.enquiryData);
      setTotalPages(data.data.totalPages);
      setTotalEnquiries(data.data.totalEnquiries);
    }
  }, [isSuccess, data]);

  const editEnquiry = (row: WorkshopEnquiry) => {
    navigate(`/edit-enquiry`, { state: { enquiry: row } });
  };

  const removeEnquiry = (row: WorkshopEnquiry) => {
    setEnquiryToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (enquiryToDelete) {
      try {
        // Implement delete functionality here
        toast.success('Enquiry deleted successfully');
        setEnquiries(prevEnquiries => prevEnquiries.filter(enquiry => enquiry._id !== enquiryToDelete._id));
      } catch (error) {
        console.error('Error deleting enquiry:', error);
        toast.error('Failed to delete enquiry');
      }
    }
    setIsDeleteModalOpen(false);
    setEnquiryToDelete(null);
  };

  const viewEnquiry = (row: WorkshopEnquiry) => {
    navigate(`/enquiries/${row._id}`);
  };

  const handleSort = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
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
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Workshop Enquiries</h1>
      <DynamicTable
        headings={headings}
        data={enquiries}
        onEdit={editEnquiry}
        onDelete={removeEnquiry}
        onView={viewEnquiry}
        sortField="createdAt"
        onSort={handleSort}
        sortOrder={sortOrder}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
      />
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        totalItems={totalEnquiries} 
        limit={limit} 
        onLimitChange={handleLimitChange}
        onPageChange={handlePageChange}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={enquiryToDelete ? enquiryToDelete.name || 'this enquiry' : ''}
      />
    </div>
  )
};

export default GetWorkshopEnquiries;
