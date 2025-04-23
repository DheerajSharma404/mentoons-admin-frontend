import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { useGetJobByIdQuery } from "../../features/career/careerApi";

const JobDetails: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { data: jobData, isLoading, isError } = useGetJobByIdQuery(jobId || "");
  const [showApplications, setShowApplications] = React.useState(false);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !jobData) {
    return (
      <div className="text-center text-red-500">Error loading job details.</div>
    );
  }

  const job = jobData.data;
  console.log(job);

  return (
    <div className="items-center max-w-4xl p-10 px-8 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">{job.jobTitle}</h1>

      <div className="mb-6">
        <img
          src={job.thumbnail?.toString() ?? undefined}
          alt={job.jobTitle}
          className="object-contain w-full h-64 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Location</p>
          <p className="font-semibold">{job.location}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Job Type</p>
          <p className="font-semibold">{job.jobType}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Applications</p>
          <p className="font-semibold">{job.applicationCount}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Job Description</h2>
        <p className="text-gray-700">{job.jobDescription}</p>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Required Skills</h2>
        <ul className="list-disc list-inside">
          {job.skillsRequired.map((skill, index) => (
            <li key={index} className="text-gray-700">
              {skill}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">
            Applications ({job.applicationCount})
          </h2>
          <button
            onClick={() => setShowApplications(!showApplications)}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            {showApplications ? "Hide Applications" : "View Applications"}
          </button>
        </div>
        {showApplications &&
        job.applicationDetails &&
        job.applicationDetails.length > 0 ? (
          <div className="space-y-4">
            {job.applicationDetails.map((application, index: number) => (
              <div key={index} className="p-4 border rounded-md">
                <h3 className="font-semibold">{application.name}</h3>
                <p className="text-sm text-gray-600">{application.email}</p>
                <p className="text-sm text-gray-600">{application.phone}</p>
                <p className="text-sm text-gray-600">
                  Gender: {application.gender}
                </p>
                <a
                  href={application.portfolioLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Portfolio
                </a>
                <p className="mt-2 font-semibold">Cover Note:</p>
                <p className="text-gray-700">{application.coverNote}</p>
                <p className="mt-2 font-semibold">Cover Letter:</p>
                <p className="text-gray-700">{application.coverLetterLink}</p>
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-600 hover:underline"
                >
                  View Resume
                </a>
              </div>
            ))}
          </div>
        ) : showApplications ? (
          <p className="text-gray-700">No applications yet.</p>
        ) : null}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/hiring-form", { state: { id: job._id } })}
          className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Edit Job
        </button>
        <Link
          to="/all-jobs"
          className="px-4 py-2 font-semibold text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back to All Jobs
        </Link>
      </div>
    </div>
  );
};

export default JobDetails;