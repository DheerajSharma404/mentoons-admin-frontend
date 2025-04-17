import { useParams } from "react-router-dom";
import { useGetEnquiryByIdQuery } from "../../features/workshop/workshopApi";
import Loader from "../../components/common/Loader";

const ViewEnquiry = () => {
    const { enquiryId } = useParams<{ enquiryId: string }>();
    const { data, isLoading } = useGetEnquiryByIdQuery({ enquiryId });
    const enquiryData = data?.data;

    const handleCall = () => {
        window.location.href = `tel:${enquiryData?.guardianContact}`;
    };

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="max-h-screen p-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    Enquiry Details
                </h1>
                
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                    {/* Section Header Component */}
                    <div className="border-b border-gray-100 pb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Student Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Student Name</label>
                                <h3 className="text-xl font-semibold text-gray-800 break-words">{enquiryData?.name}</h3>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Age</label>
                                <p className="text-xl text-gray-700">{enquiryData?.age} years</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-100 pb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Guardian Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Guardian Name</label>
                                <p className="text-xl text-gray-700">{enquiryData?.guardianName}</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contact Number</label>
                                <div className="flex items-center space-x-4">
                                    <p className="text-xl text-gray-700">{enquiryData?.guardianContact}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Email Address</label>
                                <p className="text-xl text-gray-700">{enquiryData?.guardianEmail || 'Not provided'}</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">City</label>
                                <p className="text-xl text-gray-700">{enquiryData?.city}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Workshop Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Workshop</label>
                                <p className="text-xl text-gray-700">{enquiryData?.workshop}</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Duration</label>
                                <p className="text-xl text-gray-700">{enquiryData?.duration}</p>
                            </div>
                        </div>
                    </div>

                    {/* New: Call to Action Button */}
                    <div className="pt-6 flex justify-center">
                        <button
                            onClick={handleCall}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 space-x-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <span>Contact Guardian</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewEnquiry;
