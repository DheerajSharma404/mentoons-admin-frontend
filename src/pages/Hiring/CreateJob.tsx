import { useAuth } from "@clerk/clerk-react";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
} from "formik";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Loader from "../../components/common/Loader";
import LoadingModal from "../../components/common/loading";
import {
  useCreateJobMutation,
  useGetJobByIdQuery,
  useUpdateJobMutation,
} from "../../features/career/careerApi";
import { JobData } from "../../types";
import { errorToast, successToast } from "../../utils/toastResposnse";

interface JobFormValues {
  jobTitle: string;
  jobDescription: string;
  skillsRequired: string[];
  thumbnail: File | string | null;
  location: string;
  jobType: string;
  status?: string;
  applicationCount?: number;
}

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

const JOB_TYPES = [
  { value: "FULLTIME", label: "Full-time" },
  { value: "PARTTIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
];

const CreateJob: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const jobId = location.state?.id;
  const [createJob] = useCreateJobMutation();
  const [updateJob] = useUpdateJobMutation();
  const { data, isLoading: isLoadingJob } = useGetJobByIdQuery(jobId ?? "", {
    skip: !jobId,
  });
  const jobData = data?.data;
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [previewImage, setPreviewImage] = useState<string | null>(
  //   typeof jobData?.thumbnail === "string" ? jobData.thumbnail : null
  // );
  const [indianStates, setIndianStates] = useState<string[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);

  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const loadingSteps = [
    "Analyzing submission data",
    "Uploading image",
    "Saving job information",
    "Finalizing Process",
  ];

  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const response = await fetch(
          "https://cdn-api.co-vin.in/api/v2/admin/location/states"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch states");
        }
        const data = await response.json();

        const stateNames = data.states.map(
          (state: { state_id: number; state_name: string }) => state.state_name
        );
        stateNames.sort();
        setIndianStates(stateNames);
      } catch (error) {
        console.error("Error fetching states:", error);
        setIndianStates([
          "Andhra Pradesh",
          "Arunachal Pradesh",
          "Assam",
          "Bihar",
          "Chhattisgarh",
          "Goa",
          "Gujarat",
          "Haryana",
          "Himachal Pradesh",
          "Jharkhand",
          "Karnataka",
          "Kerala",
          "Madhya Pradesh",
          "Maharashtra",
          "Manipur",
          "Meghalaya",
          "Mizoram",
          "Nagaland",
          "Odisha",
          "Punjab",
          "Rajasthan",
          "Sikkim",
          "Tamil Nadu",
          "Telangana",
          "Tripura",
          "Uttar Pradesh",
          "Uttarakhand",
          "West Bengal",
          "Andaman and Nicobar Islands",
          "Chandigarh",
          "Dadra and Nagar Haveli and Daman and Diu",
          "Delhi",
          "Jammu and Kashmir",
          "Ladakh",
          "Lakshadweep",
          "Puducherry",
        ]);
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  const uploadFile = async (file: File): Promise<string> => {
    setCurrentLoadingStep(1);
    const token = await getToken();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/upload/file",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      return data.data.fileDetails.url;
    } catch (error) {
      console.error("File upload error:", error);
      throw new Error("Failed to upload file. Please try again.");
    }
  };

  const handleFormSubmit = async (
    values: JobFormValues,
    { setSubmitting }: FormikHelpers<JobFormValues>
  ) => {
    setIsSubmitting(true);
    setIsLoadingModalOpen(true);
    setCurrentLoadingStep(0);

    try {
      let thumbnailUrl = values.thumbnail;
      if (values.thumbnail instanceof File) {
        thumbnailUrl = await uploadFile(values.thumbnail);
      } else if (typeof values.thumbnail === "string") {
        thumbnailUrl = values.thumbnail;
        setCurrentLoadingStep(1);
      }

      setCurrentLoadingStep(2);
      const jobData = { ...values, thumbnail: thumbnailUrl };

      if (jobId) {
        const res = await updateJob({ ...jobData, _id: jobId }).unwrap();
        successToast(res.message || "Job updated successfully");
        setCurrentLoadingStep(3);
      } else {
        const res = await createJob(jobData as JobData).unwrap();
        successToast(res.message || "Job created successfully");
      }

      setCurrentLoadingStep(3);

      setTimeout(() => {
        navigate("/all-jobs");
      }, 2000);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      errorToast(
        apiError?.data?.message || apiError?.message || "Failed to save job"
      );
      console.error("Error submitting job:", error);
      setIsLoadingModalOpen(false);
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  if (isLoadingJob && jobId) return <Loader />;

  const initialValues: JobFormValues = {
    jobTitle: jobData?.jobTitle || "",
    jobDescription: jobData?.jobDescription || "",
    skillsRequired: jobData?.skillsRequired || [],
    thumbnail: jobData?.thumbnail || null,
    status: jobData?.status || "open",
    location: jobData?.location || "",
    jobType: jobData?.jobType || "",
    applicationCount: jobData?.applicationCount || 0,
  };

  const validationSchema = Yup.object({
    jobTitle: Yup.string().required("Job title is required"),
    jobDescription: Yup.string().required("Job description is required"),
    skillsRequired: Yup.array()
      .of(Yup.string())
      .min(1, "At least one skill is required"),
    thumbnail: Yup.mixed().required("Thumbnail is required"),
    location: Yup.string().required("Location is required"),
    jobType: Yup.string().required("Job type is required"),
  });

  return (
    <div className="items-center max-w-4xl p-10 px-8 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        {jobId ? "Edit Job" : "Create Job"}
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isValid, dirty, errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                name="jobTitle"
                label="Job Title"
                placeholder="e.g., Senior Software Engineer"
                error={!!errors.jobTitle && !!touched.jobTitle}
              />
              <div className="space-y-2">
                <label
                  htmlFor="jobType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Type <span className="text-red-500">*</span>
                </label>
                <Field
                  id="jobType"
                  name="jobType"
                  as="select"
                  className={`w-full p-3 border ${
                    errors.jobType && touched.jobType
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Job Type</option>
                  {JOB_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="jobType"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-4">
                {/* Location Dropdown */}
                <div className="relative w-1/2">
                  <label
                    htmlFor="location"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Location
                  </label>
                  {isLoadingStates ? (
                    <div className="w-full p-3 text-gray-500 border border-gray-300 rounded-md bg-gray-50">
                      Loading states...
                    </div>
                  ) : (
                    <Field
                      id="location"
                      name="location"
                      as="select"
                      className={`w-full p-3 border ${
                        errors.location && touched.location
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10`}
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                      <option value="Remote">Remote</option>
                      <option value="Multiple Locations">
                        Multiple Locations
                      </option>
                      <option value="Other">Other</option>
                    </Field>
                  )}
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                    <svg
                      className="w-4 h-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <div className="relative w-1/2">
                  <label
                    htmlFor="status"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <Field
                    id="status"
                    name="status"
                    as="select"
                    className={`w-full p-3 border ${
                      errors.status && touched.status
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10`}
                  >
                    <option value="">Select Status</option>
                    <option value="open">Open</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </Field>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                    <svg
                      className="w-4 h-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <ErrorMessage
                  name="location"
                  component="div"
                  className="w-1/2 text-sm text-red-500"
                />
                <ErrorMessage
                  name="status"
                  component="div"
                  className="w-1/2 text-sm text-red-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="jobDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Job Description <span className="text-red-500">*</span>
              </label>
              <Field
                id="jobDescription"
                name="jobDescription"
                as="textarea"
                rows={6}
                placeholder="Provide a detailed description of the role, responsibilities, and requirements"
                className={`w-full p-3 border ${
                  errors.jobDescription && touched.jobDescription
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <ErrorMessage
                name="jobDescription"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="skillsRequired"
                className="block text-sm font-medium text-gray-700"
              >
                Skills Required
              </label>
              <FieldArray name="skillsRequired">
                {({ push, remove }) => (
                  <div>
                    {values.skillsRequired.map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center mb-2 space-x-2"
                      >
                        <Field
                          name={`skillsRequired.${index}`}
                          className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-white bg-red-500 rounded-md"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push("")}
                      className="p-2 mt-2 text-white bg-green-500 rounded-md"
                    >
                      Add Skill
                    </button>
                  </div>
                )}
              </FieldArray>
              <ErrorMessage
                name="skillsRequired"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium text-gray-700"
              >
                Thumbnail (Image)
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  setFieldValue("thumbnail", files ? files[0] : null);
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="thumbnail"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !isValid || !dirty}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-3 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {jobId ? "Updating..." : "Creating..."}
                </span>
              ) : (
                <>{jobId ? "Update Job" : "Create Job"}</>
              )}
            </button>
          </Form>
        )}
      </Formik>
      <LoadingModal
        currentStep={currentLoadingStep}
        isOpen={isLoadingModalOpen}
        onClose={() => setIsLoadingModalOpen(false)}
        steps={loadingSteps}
        title={jobId ? "Updating Job" : "Creating New Job"}
      />
    </div>
  );
};

const FormField: React.FC<{
  name: string;
  label: string;
  as?: string;
  rows?: number;
  placeholder?: string;
  error?: boolean;
}> = ({ name, label, as = "input", rows, placeholder, error }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <Field
      id={name}
      name={name}
      as={as}
      rows={rows}
      placeholder={placeholder}
      className={`w-full p-3 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-sm text-red-500"
    />
  </div>
);

export default CreateJob;
