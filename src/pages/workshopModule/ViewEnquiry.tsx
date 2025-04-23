import { useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { useGetEnquiryByIdQuery } from "../../features/workshop/workshopApi";


const ViewEnquiry = () => {
  const { enquiryId } = useParams<{ enquiryId: string }>();
  console.log(enquiryId, "enquiryId");
  const { data, isLoading } = useGetEnquiryByIdQuery({ enquiryId });
  const enquiryData = data?.data;

  const handleCall = () => {
    window.location.href = `tel:${enquiryData?.phone}`;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="max-h-screen p-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center text-gray-900">
          Enquiry Details
        </h1>

        <div className="p-8 space-y-8 transition-shadow duration-300 bg-white border border-gray-200 shadow-xl rounded-2xl hover:shadow-2xl">
          {/* Section Header Component */}
          <div className="pb-6 border-b border-gray-100">
            <h2 className="flex items-center mb-6 text-2xl font-semibold text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mr-2 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Student Information
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Student Name
                </label>
                <h3 className="text-xl font-semibold text-gray-800 break-words">
                  {enquiryData?.firstname} {enquiryData?.lastname}
                </h3>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Email
                </label>
                <p className="text-xl text-gray-700">
                  {enquiryData?.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="pb-6 border-b border-gray-100">
            <h2 className="flex items-center mb-6 text-2xl font-semibold text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mr-2 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Phone Number
                </label>
                <div className="flex items-center space-x-4">
                  <p className="text-xl text-gray-700">
                    {enquiryData?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-6 border-b border-gray-100">
            <h2 className="flex items-center mb-6 text-2xl font-semibold text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mr-2 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Workshop Details
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Workshop
                </label>
                <p className="text-xl text-gray-700">{enquiryData?.workshop}</p>
              </div>
            </div>
          </div>

          <div className="pb-6 border-b border-gray-100">
            <h2 className="flex items-center mb-6 text-2xl font-semibold text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mr-2 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Message
            </h2>
            <div className="space-y-3">
              <p className="text-xl text-gray-700">{enquiryData?.message}</p>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleCall}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 space-x-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>Contact Enquirer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEnquiry;
