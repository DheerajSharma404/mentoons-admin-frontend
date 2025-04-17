import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useCreateJobMutation, useGetJobByIdQuery, useUpdateJobMutation } from '../../features/career/careerApi';
import { JobData } from '../../types';
import Loader from '../../components/common/Loader';
import { errorToast, successToast } from '../../utils/toastResposnse';
import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

interface JobFormValues {
  jobTitle: string;
  jobDescription: string;
  skillsRequired: string[];
  thumbnail: File | string | null;
  location?: string;
  jobType?: string;
  applicationCount?: number;
}

const CreateJob: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {getToken} = useAuth()
  const jobId = location.state?.id;
  const [createJob] = useCreateJobMutation();
  const [updateJob] = useUpdateJobMutation();
  const { data, isLoading: isLoadingJob } = useGetJobByIdQuery(jobId ?? '', { skip: !jobId });
  const jobData = data?.data
  console.log(jobData)
  const uploadFile = async (file: File): Promise<string> => {
    const token = await getToken()
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://mentoons-backend-zlx3.onrender.com/api/v1/upload/file', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.data.imageUrl;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (values: JobFormValues, { setSubmitting }: FormikHelpers<JobFormValues>) => {
    setIsSubmitting(true);
    try {
      let thumbnailUrl = values.thumbnail;
      if (values.thumbnail instanceof File) {
        thumbnailUrl = await uploadFile(values.thumbnail);
      }

      const jobData = { ...values, thumbnail: thumbnailUrl };

      if (jobId) {
       const res = await updateJob({ ...jobData, _id: jobId }).unwrap();
       successToast(res.message || 'Job updated successfully')
      } else {
        const res = await createJob(jobData as JobData).unwrap();
        console.log(res,'res')
        successToast(res.message || 'Job created successfully')
      }
      navigate('/all-jobs');
    } catch (error:any) {
      errorToast(error?.data?.message || 'Failed to create job')
      console.error('Error submitting job:', error);
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  if (isLoadingJob && jobId) return<Loader />;

  const initialValues: JobFormValues = {
    jobTitle: jobData?.jobTitle || '',
    jobDescription: jobData?.jobDescription || '',
    skillsRequired: jobData?.skillsRequired || [],
    thumbnail: jobData?.thumbnail || null,
    location: jobData?.location || '',
    jobType: jobData?.jobType || '',
    applicationCount: jobData?.applicationCount || 0,
  };

  const validationSchema = Yup.object({
    jobTitle: Yup.string().required('Job title is required'),
    jobDescription: Yup.string().required('Job description is required'),
    skillsRequired: Yup.array().of(Yup.string()).min(1, 'At least one skill is required'),
    thumbnail: Yup.mixed().required('Thumbnail is required'),
    location: Yup.string().required('Location is required'),
    jobType: Yup.string().required('Job type is required'),
  });

  return (
    <div className="bg-white px-8 rounded-lg shadow-lg max-w-4xl mx-auto items-center p-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {jobId ? 'Edit Job' : 'Create Job'}
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isValid, dirty }) => (
          <Form className="space-y-6">
            <FormField name="jobTitle" label="Job Title" />
            <FormField name="jobDescription" label="Job Description" as="textarea" rows={4} />
            <FormField name="location" label="Location" />
            <Field
              name="jobType"
              label="Job Type"
              as="select"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Job Type</option>
              <option value="FULLTIME">Full-time</option>
              <option value="PARTTIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </Field>
            <div className="space-y-2">
              <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-700">
                Skills Required
              </label>
              <FieldArray name="skillsRequired">
                {({ push, remove }) => (
                  <div>
                    {values.skillsRequired.map((_, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Field
                          name={`skillsRequired.${index}`}
                          className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 bg-red-500 text-white rounded-md"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push('')}
                      className="mt-2 p-2 bg-green-500 text-white rounded-md"
                    >
                      Add Skill
                    </button>
                  </div>
                )}
              </FieldArray>
              <ErrorMessage name="skillsRequired" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="space-y-2">
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                Thumbnail (Image)
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  setFieldValue('thumbnail', files ? files[0] : null);
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="thumbnail" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !isValid || !dirty}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {jobId ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <>{jobId ? 'Update Job' : 'Create Job'}</>
              )}
            </button>
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
}> = ({ name, label, as = 'input', rows }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <Field
      id={name}
      name={name}
      as={as}
      rows={rows}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
  </div>
);

export default CreateJob;
