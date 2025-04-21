import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaFileAlt,
  FaGlobe,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import Loader from "../components/common/Loader";

interface ApplicationData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  portfolioLink: string;
  gender: string;
  coverNote: string;
  resume: string;
  createdAt: string;
  jobTitle: string;
}

const ApplicationDetails = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/v1/career/applied/${applicationId}`
        );
        setApplication(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError("Failed to load application details");
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  if (loading) return <Loader />;

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!application) {
    return <div className="p-4 text-center">Application not found</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container min-h-screen px-4 py-8 mx-auto bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Application ID and Date */}
        <div className="flex flex-col items-start justify-between mb-6 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Application Details
          </h1>
          <div className="mt-2 text-sm text-gray-500 sm:mt-0">
            <span className="mr-3">ID: {application._id.substring(0, 8)}</span>
            <span>Applied: {formatDate(application.createdAt)}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          {/* Header with Name and Job Title */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <h2 className="text-2xl font-bold text-gray-800">
              {application.name}
            </h2>
            <p className="mt-1 text-lg text-blue-600">
              <span className="font-normal text-gray-500">Applying for: </span>
              <span className="font-medium">{application.jobTitle}</span>
            </p>
          </div>

          {/* Contact Information */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="mb-4 text-lg font-medium text-gray-800">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 text-blue-500 bg-blue-100 rounded-full">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${application.email}`}
                    className="font-medium text-gray-800 hover:text-blue-600"
                  >
                    {application.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 text-blue-500 bg-blue-100 rounded-full">
                  <FaPhone />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a
                    href={`tel:${application.phone}`}
                    className="font-medium text-gray-800 hover:text-blue-600"
                  >
                    {application.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 text-blue-500 bg-blue-100 rounded-full">
                  <FaUser />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800">
                    {application.gender}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 text-blue-500 bg-blue-100 rounded-full">
                  <FaGlobe />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Portfolio</p>
                  {application.portfolioLink ? (
                    <a
                      href={application.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View Portfolio
                    </a>
                  ) : (
                    <p className="font-medium text-gray-500">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Documents */}
          <div className="p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-800">
              Application Documents
            </h3>

            {/* Cover Note */}
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Cover Note
              </p>
              <div className="p-4 rounded-md bg-gray-50">
                <p className="text-gray-800 whitespace-pre-line">
                  {application.coverNote}
                </p>
              </div>
            </div>

            {/* Resume */}
            <div className="flex items-center p-4 rounded-md bg-blue-50">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 text-blue-500 bg-blue-100 rounded-full">
                <FaFileAlt />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resume</p>
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  View Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
