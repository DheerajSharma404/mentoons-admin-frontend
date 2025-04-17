import { useState, useCallback, useEffect } from 'react';
import DynamicTable from '../../components/common/Table';
import { useDeleteJobMutation, useGetJobsQuery } from '../../features/career/careerApi';
import { JobData } from '../../types';
import debounce from 'lodash/debounce';
import Pagination from '../../components/common/Pagination';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import Loader from '../../components/common/Loader';
import { errorToast, successToast } from '../../utils/toastResposnse';

const AllJobs = () => {
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<JobData | null>(null);

    const { data, isLoading, isError, error } = useGetJobsQuery({
        sortOrder,
        searchTerm: debouncedSearchTerm,
        page: currentPage,
        limit,
    });
    const [deleteJob] = useDeleteJobMutation();
    const handleEdit = (job: JobData) => {
        navigate('/hiring-form', { state: { id: job._id } });
    };

    const handleDelete = (job: JobData) => {
        setJobToDelete(job);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (jobToDelete) {
            try {
                const result = await deleteJob(jobToDelete._id).unwrap();
                if(result.success) {
                    successToast(result.data.message || 'Job deleted successfully');
                } else {
                    errorToast(result.data.message || 'Failed to delete job');
                }
            } catch (error) {
                console.log(error)
                errorToast('Failed to delete job');
            }
        }
        setIsDeleteModalOpen(false);
        setJobToDelete(null);
    };

    const handleView = (job: JobData) => {
        navigate(`/job-details/${job._id}`);
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
    if (!data || !data.data || !data.data.jobs) return <div className='h-screen flex items-center justify-center'>No data available</div>;

    const { jobs, totalPages, totalJobs } = data.data;

    return (
        <div className='h-full p-4'>
            <h1 className='text-2xl font-bold mb-4'>All Jobs</h1>
            <DynamicTable
                headings={['ID', 'Title', 'Department', 'Description', 'Status', 'Applications']}
                data={jobs}
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
                    totalItems={totalJobs}
                    limit={limit}
                    onLimitChange={handleLimitChange}
                    onPageChange={handlePageChange}
                />
            </div>
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={jobToDelete ? jobToDelete.jobTitle || 'this job' : ''}
            />
        </div>
    );
};

export default AllJobs;
