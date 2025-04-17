import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useAddFeedbackMutation } from "../../features/workshop/workshopApi";

export interface FeedbackFormValues {
  childName: string;
  childAge: string;
  parentNames: {
    mother: string;
    father: string;
    carer?: string;
  };
  easeOfUseRating: number;
  learnings: string;
  favoriteFeature: 'speak-easy' | 'silent-stories-and-contest' | 'menu-mania' | 'all-of-the-above';
  issues: string;
  monitoringEaseRating: number;
  wouldRecommend: boolean;
  recommendationReason: string;
  overallExperience: 'negative' | 'neutral' | 'positive';
}

const validationSchema = Yup.object().shape({
  childName: Yup.string()
    .required('Child\'s name is required')
    .min(2, 'Name must be at least 2 characters'),
  childAge: Yup.string()
    .required('Child\'s age is required'),
  parentNames: Yup.object().shape({
    mother: Yup.string().required('Mother\'s name is required'),
    father: Yup.string().required('Father\'s name is required'),
    carer: Yup.string(),
  }),
  easeOfUseRating: Yup.number()
    .required('Ease of use rating is required')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  learnings: Yup.string()
    .required('Learnings are required'),
  favoriteFeature: Yup.string()
    .required('Favorite feature is required')
    .oneOf(['speak-easy', 'silent-stories-and-contest', 'menu-mania', 'all-of-the-above']),
  issues: Yup.string()
    .required('Issues description is required'),
  monitoringEaseRating: Yup.number()
    .required('Monitoring ease rating is required')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
  wouldRecommend: Yup.boolean()
    .required('Would recommend field is required'),
  recommendationReason: Yup.string()
    .required('Recommendation reason is required'),
  overallExperience: Yup.string()
    .required('Overall experience is required')
    .oneOf(['negative', 'neutral', 'positive']),
});

const AssesmentForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [addFeedback] = useAddFeedbackMutation();
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Basic Information";
      case 2:
        return "Rating & Preferences";
      case 3:
        return "Detailed Feedback";
      default:
        return "";
    }
  };

  const initialValues: FeedbackFormValues = {
    childName: "",
    childAge: "",
    parentNames: {
      mother: "",
      father: "",
      carer: "",
    },
    easeOfUseRating: 1,
    learnings: "",
    favoriteFeature: "speak-easy",
    issues: "",
    monitoringEaseRating: 1,
    wouldRecommend: false,
    recommendationReason: "",
    overallExperience: "neutral",
  }

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className="form-group">
              <label htmlFor='childName' className="block text-sm font-medium text-gray-700 mb-1">
                Child's Name
              </label>
              <Field
                name='childName'
                type='text'
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name='childName' component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="form-group">
              <label htmlFor='childAge' className="block text-sm font-medium text-gray-700 mb-1">
                Child's Age
              </label>
              <Field
                name='childAge'
                type='text'
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name='childAge' component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="form-group">
              <label htmlFor='parentNames.mother' className="block text-sm font-medium text-gray-700 mb-1">
                Mother's Name
              </label>
              <Field
                name='parentNames.mother'
                type='text'
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name='parentNames.mother' component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="form-group">
              <label htmlFor='parentNames.father' className="block text-sm font-medium text-gray-700 mb-1">
                Father's Name
              </label>
              <Field
                name='parentNames.father'
                type='text'
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name='parentNames.father' component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div className="form-group">
              <label htmlFor='parentNames.carer' className="block text-sm font-medium text-gray-700 mb-1">
                Carer's Name (Optional)
              </label>
              <Field
                name='parentNames.carer'
                type='text'
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name='parentNames.carer' component="div" className="mt-1 text-sm text-red-600" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className='space-y-8'>
            {/* Rating Section - Small inputs */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className="form-group">
                <label htmlFor='easeOfUseRating' className="block text-sm font-medium text-gray-700 mb-1">
                  Ease of Use Rating
                </label>
                <div className="flex items-center space-x-2">
                  <Field
                    name='easeOfUseRating'
                    type='number'
                    min='1'
                    max='5'
                    className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="text-sm text-gray-500">(1-5)</span>
                </div>
                <ErrorMessage name='easeOfUseRating' component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="form-group">
                <label htmlFor='monitoringEaseRating' className="block text-sm font-medium text-gray-700 mb-1">
                  Monitoring Ease Rating
                </label>
                <div className="flex items-center space-x-2">
                  <Field
                    name='monitoringEaseRating'
                    type='number'
                    min='1'
                    max='5'
                    className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="text-sm text-gray-500">(1-5)</span>
                </div>
                <ErrorMessage name='monitoringEaseRating' component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>

            {/* Dropdown Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className="form-group">
                <label htmlFor='favoriteFeature' className="block text-sm font-medium text-gray-700 mb-1">
                  Favorite Feature
                </label>
                <Field
                  as='select'
                  name='favoriteFeature'
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value='speak-easy'>Speak Easy</option>
                  <option value='silent-stories-and-contest'>Silent Stories and Contest</option>
                  <option value='menu-mania'>Menu Mania</option>
                  <option value='all-of-the-above'>All of the Above</option>
                </Field>
                <ErrorMessage name='favoriteFeature' component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="form-group">
                <label htmlFor='overallExperience' className="block text-sm font-medium text-gray-700 mb-1">
                  Overall Experience
                </label>
                <Field
                  as='select'
                  name='overallExperience'
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value='negative'>Negative</option>
                  <option value='neutral'>Neutral</option>
                  <option value='positive'>Positive</option>
                </Field>
                <ErrorMessage name='overallExperience' component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>

            {/* Recommendation Section */}
            <div className="form-group p-4 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Would You Recommend this Program?
                </label>
                <div className="flex items-center space-x-2">
                  <Field
                    name='wouldRecommend'
                    type='checkbox'
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600">Yes, I would recommend this program</span>
                </div>
                <ErrorMessage name='wouldRecommend' component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="form-group">
                <label htmlFor='recommendationReason' className="block text-sm font-medium text-gray-700 mb-1">
                  What did yopu like the most?
                </label>
                <Field
                  as='textarea'
                  name='recommendationReason'
                  rows='3'
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Please share yor experience..."
                />
                <ErrorMessage name='recommendationReason' component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-50 to-white p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Share Your Experience
              </h3>

              <div className="space-y-6">
                <div className="form-group">
                  <label htmlFor='learnings' className="block text-sm font-medium text-gray-700 mb-2">
                    What did you learn from this workshop?
                  </label>
                  <Field
                    as='textarea'
                    name='learnings'
                    rows='4'
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-indigo-500 focus:border-indigo-500 shadow-sm resize-none
                               placeholder-gray-400"
                    placeholder="Share your key takeaways and learning experience..."
                  />
                  <ErrorMessage name='learnings' component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div className="form-group">
                  <label htmlFor='issues' className="block text-sm font-medium text-gray-700 mb-2">
                    Did you face any challenges or issues?
                  </label>
                  <Field
                    as='textarea'
                    name='issues'
                    rows='4'
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-indigo-500 focus:border-indigo-500 shadow-sm resize-none
                               placeholder-gray-400"
                    placeholder="Describe any difficulties or areas for improvement..."
                  />
                  <ErrorMessage name='issues' component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const handleSubmit = async (values: any) => {
    console.log(values, 'values');
    const response = await addFeedback({ values }).unwrap();
    console.log(response, 'response');
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 overflow-hidden">
        <div className={`relative bg-transparent p-6 rounded-lg max-w-6xl mx-auto shadow-lg`}>
          {!isSubmitted ? (
            <div className="h-[80vh] overflow-y-auto scrollbar-hide relative">
              <div className="text-center mb-8">
                <div className="flex flex-row-reverse items-center justify-center gap-4">
                  <h2 className='text-3xl font-bold text-indigo-600'>
                    Workshop Assessment Form
                  </h2>
                </div>
                <div className="mt-2">
                  <p className="text-lg font-medium text-gray-600">
                    Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
                  </p>
                  <div className="w-full max-w-md mx-auto mt-2 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form className='space-y-6'>
                    {renderFormStep()}

                    <div className='flex justify-between mt-8'>
                      {currentStep > 1 && (
                        <button
                          type='button'
                          onClick={prevStep}
                          className='px-6 py-2.5 bg-gray-600 text-white font-medium text-sm rounded-lg 
                                     shadow-md hover:bg-gray-700 transition duration-150 ease-in-out
                                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                        >
                          Previous
                        </button>
                      )}
                      {currentStep < totalSteps ? (
                        <button
                          type='button'
                          onClick={nextStep}
                          className='px-6 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg 
                                     shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out
                                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          type='submit'
                          className='px-6 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg 
                                     shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out
                                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            <div className='relative overflow-y-auto scrollbar-hide text-center'>
              <div className='relative inline-block w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto'>
                <img
                  src='/assets/home/notif.png'
                  alt='Success Image'
                  className='w-full h-full'
                />
                <div className='absolute inset-0 flex flex-col justify-center items-center text-center p-4 sm:p-6'>
                  <h2 className='text-2xl font-bold text-men-blue lg:mb-4'>
                    Success!
                  </h2>
                  <p className='text-lg text-men-blue'>
                    Your form has been successfully submitted.
                  </p>
                  <button
                    className='lg:mt-6 bg-men-blue text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    onClick={() => setIsSubmitted(false)}
                  >
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default AssesmentForm;