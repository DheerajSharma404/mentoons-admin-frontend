import { useAssignCallRequestMutation, useGetCallRequestsQuery, useUpdateCallRequestMutation, useReallocateCallRequestMutation } from "../../features/workshop/workshopApi";
import { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import { successToast } from "../../utils/toastResposnse";
import { errorToast } from "../../utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import CallRequestTable from '../../components/workshop/CallRequestTable';

const statusConfig: any = {
  'reached out': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    label: 'Reached Out'
  },
  'converted to lead': {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    label: 'Converted to Lead'
  },
  'awaiting outreach': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    label: 'Awaiting Outreach'
  },
  'conversion unsuccessful': {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    label: 'Conversion Unsuccessful'
  }
};

interface AdminUser {
  _id: string;
  name: string;
}

interface ReallocationModal {
  isOpen: boolean;
  requestId: string;
  adminId: string;
}

const CallRequest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [serchUser, setSerchUser] = useState('');
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [updateCallRequest] = useUpdateCallRequestMutation();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [reallocationModal, setReallocationModal] = useState<ReallocationModal>({
    isOpen: false,
    requestId: '',
    adminId: ''
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId && !(event.target as Element).closest('.admin-dropdown')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  const handleStatusUpdate = async (requestId: string, status: string) => {
    try {
      await updateCallRequest({ id: requestId, status }).unwrap();
      successToast('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      errorToast('Failed to update status');
    }
  };

  const { data, isLoading, refetch } = useGetCallRequestsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm
  });

  const filteredData = data?.data?.callRequestData?.filter(request =>
    Object.values(request).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
  const [assignCallRequest] = useAssignCallRequestMutation();
  const [reallocateCallRequest] = useReallocateCallRequestMutation();
  const { getToken } = useAuth();

  const assignCallRequestHandler = async (requestId: string, adminId: string) => {
    const token = await getToken();
    try {
      if (!token) {
        errorToast('Token not found');
        return;
      }
      const response: any = await assignCallRequest({ userId: adminId, callId: requestId, token }).unwrap();
      successToast(response.message);
      refetch();
      setReallocationModal({ isOpen: false, requestId: '', adminId: '' });
    } catch (error: any) {
      if (error.data?.error?.includes('already assigned')) {
        setReallocationModal({ isOpen: true, requestId, adminId });
      } else {
        errorToast(error.data.error);
      }
    }
  };

  const handleReallocation = async () => {
    const token = await getToken();
    try {
      if (!token) {
        errorToast('Token not found');
        return;
      }
      const response: any = await reallocateCallRequest({ 
        userId: reallocationModal.adminId, 
        callId: reallocationModal.requestId, 
        token 
      }).unwrap();
      successToast(response.message);
      refetch();
      setReallocationModal({ isOpen: false, requestId: '', adminId: '' });
    } catch (error: any) {
      errorToast(error.data?.error || 'Failed to reallocate call request');
      setReallocationModal({ isOpen: false, requestId: '', adminId: '' });
    }
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };
  const getAdminUser = async () => {
    try {
      const token = await getToken();
      if (!token) {
        errorToast('Authentication token not found');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: serchUser,
          filter: {
            role: 'ADMIN'
          }
        }
      });
      setAdminUsers(response.data?.data?.users || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      errorToast('Failed to fetch admin users');
    }
  };

  useEffect(() => {
    getAdminUser();
  }, [serchUser, getToken]);

  console.log(filteredData?.[0]?.assignedTo?.[0]?.name, 'filteredData')

  const renderReallocationModal = () => (
    reallocationModal.isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Confirm Reallocation</h3>
          <p className="text-gray-600 mb-6">This call request is already assigned. Do you want to reallocate it?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setReallocationModal({ isOpen: false, requestId: '', adminId: '' })}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleReallocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {renderReallocationModal()}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Call Requests</h1>
        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 px-4 py-2 text-sm"
          />
        </div>
      </div>

      <CallRequestTable 
        filteredData={filteredData || []}
        statusConfig={statusConfig}
        handleStatusUpdate={handleStatusUpdate}
        openDropdownId={openDropdownId}
        setOpenDropdownId={setOpenDropdownId}
        serchUser={serchUser}
        setSerchUser={setSerchUser}
        adminUsers={adminUsers}
        assignCallRequestHandler={assignCallRequestHandler}
      />

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((data?.data?.totalCallRequests || 0) / pageSize)}
          totalItems={data?.data?.totalCallRequests || 0}
          limit={pageSize}
          onLimitChange={(newLimit) => {
            setPageSize(newLimit);
            setCurrentPage(1);
          }}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CallRequest
