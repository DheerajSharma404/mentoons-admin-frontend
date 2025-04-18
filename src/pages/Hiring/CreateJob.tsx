import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldArray,
  FormikHelpers,
} from "formik";
import * as Yup from "yup";
import {
  useCreateJobMutation,
  useGetJobByIdQuery,
  useUpdateJobMutation,
} from "../../features/career/careerApi";
import { JobData } from "../../types";
import Loader from "../../components/common/Loader";
import { errorToast, successToast } from "../../utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";

interface JobFormValues {
  jobTitle: string;
  jobDescription: string;
  skillsRequired: string[];
  thumbnail: File | string | null;
  location: string;
  jobType: string;
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
  const [previewImage, setPreviewImage] = useState<string | null>(
    typeof jobData?.thumbnail === "string" ? jobData.thumbnail : null
  );
  const [indianStates, setIndianStates] = useState<string[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);

  // Fetch Indian states from API
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
      return data.data.imageUrl;
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
    try {
      let thumbnailUrl: string | null = null;

      if (values.thumbnail instanceof File) {
        thumbnailUrl = await uploadFile(values.thumbnail);
      } else if (typeof values.thumbnail === "string") {
        thumbnailUrl = values.thumbnail;
      }

      const jobData = { ...values, thumbnail: thumbnailUrl };

      if (jobId) {
        const res = await updateJob({ ...jobData, _id: jobId }).unwrap();
        successToast(res.message || "Job updated successfully");
      } else {
        const res = await createJob(jobData as JobData).unwrap();
        successToast(res.message || "Job created successfully");
      }
      navigate("/all-jobs");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      errorToast(
        apiError?.data?.message || apiError?.message || "Failed to save job"
      );
      console.error("Error submitting job:", error);
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  if (isLoadingJob && jobId)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );

  const initialValues: JobFormValues = {
    jobTitle: jobData?.jobTitle || "",
    jobDescription: jobData?.jobDescription || "",
    skillsRequired: jobData?.skillsRequired?.length
      ? jobData.skillsRequired
      : [""],
    thumbnail: jobData?.thumbnail || null,
    location: jobData?.location || "",
    jobType: jobData?.jobType || "",
    applicationCount: jobData?.applicationCount || 0,
  };

  const validationSchema = Yup.object({
    jobTitle: Yup.string()
      .required("Job title is required")
      .max(100, "Job title must be less than 100 characters"),
    jobDescription: Yup.string()
      .required("Job description is required")
      .min(50, "Please provide a detailed description (min 50 characters)"),
    skillsRequired: Yup.array()
      .of(Yup.string().required("Skill cannot be empty"))
      .min(1, "At least one skill is required"),
    thumbnail: Yup.mixed().required("Thumbnail is required"),
    location: Yup.string().required("Location is required"),
    jobType: Yup.string().required("Job type is required"),
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const files = event.currentTarget.files;
    if (files && files[0]) {
      setFieldValue("thumbnail", files[0]);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div className="bg-white px-4 sm:px-8 py-8 rounded-lg shadow-lg max-w-4xl mx-auto my-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 text-center">
        {jobId ? "Edit Job Listing" : "Create New Job Listing"}
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isValid, dirty, errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {isLoadingStates ? (
                  <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <ErrorMessage
                name="location"
                component="div"
                className="text-red-500 text-sm"
              />
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
                className="text-red-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="skillsRequired"
                className="block text-sm font-medium text-gray-700"
              >
                Skills Required <span className="text-red-500">*</span>
              </label>
              <FieldArray name="skillsRequired">
                {({ push, remove }) => (
                  <div>
                    {values.skillsRequired.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Field
                          name={`skillsRequired.${index}`}
                          placeholder="e.g., React.js"
                          className={`flex-grow p-3 border ${
                            errors.skillsRequired &&
                            Array.isArray(errors.skillsRequired) &&
                            errors.skillsRequired[index] &&
                            Array.isArray(touched.skillsRequired) &&
                            touched.skillsRequired[index]
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          disabled={values.skillsRequired.length === 1}
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Remove skill"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push("")}
                      className="mt-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Skill
                    </button>
                  </div>
                )}
              </FieldArray>
              <ErrorMessage
                name="skillsRequired"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium text-gray-700"
              >
                Job Thumbnail <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                    className={`w-full p-3 border ${
                      errors.thumbnail && touched.thumbnail
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <ErrorMessage
                    name="thumbnail"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Recommended size: 1200 x 630 pixels
                  </p>
                </div>
                {(previewImage ||
                  (typeof values.thumbnail === "string" &&
                    values.thumbnail)) && (
                  <div className="border border-gray-300 rounded-md p-2 relative">
                    <img
                      src={
                        previewImage ||
                        (typeof values.thumbnail === "string"
                          ? values.thumbnail
                          : "")
                      }
                      alt="Thumbnail preview"
                      className="w-full h-auto max-h-40 object-contain rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => {
                        setFieldValue("thumbnail", null);
                        setPreviewImage(null);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => navigate("/all-jobs")}
                className="py-2 px-4 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                disabled={isSubmitting || !isValid || !dirty}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
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
            </div>
          </Form>
        )}
      </Formik>
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
      className="text-red-500 text-sm"
    />
  </div>
);

export default CreateJob;
