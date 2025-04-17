interface AssesmentDetailsProps {
  feedback: {
    childName: string;
    childAge: string;
    createdAt: string;
    easeOfUseRating: number;
    favoriteFeature: string;
    issues: string;
    learnings: string;
    monitoringEaseRating: number;
    overallExperience: string;
    parentNames: {
      mother: string;
      father: string;
      carer: string;
    };
    recommendationReason: string;
    wouldRecommend: boolean;
  };
  onClose: () => void;
}

const AssesmentDetails = ({ feedback, onClose }: AssesmentDetailsProps) => {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Assessment Details</h2>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-white hover:bg-gray-100 transition-colors duration-200 text-gray-700 shadow-sm"
          >
            ← Back to List
          </button>
        </div>

        <div className="space-y-6">
          {/* Child & Parent Information Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3">👤</span>
                Child Information
              </h3>
              <div className="space-y-3">
                <p className="flex items-center">
                  <span className="text-gray-600 w-24">Name:</span>
                  <span className="font-medium text-gray-800">{feedback.childName}</span>
                </p>
                <p className="flex items-center">
                  <span className="text-gray-600 w-24">Age:</span>
                  <span className="font-medium text-gray-800">{feedback.childAge}</span>
                </p>
                <p className="flex items-center">
                  <span className="text-gray-600 w-24">Date:</span>
                  <span className="font-medium text-gray-800">{new Date(feedback.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">👥</span>
                Parent/Guardian
              </h3>
              <div className="space-y-3">
                <p className="flex items-center">
                  <span className="text-gray-600 w-24">Mother:</span>
                  <span className="font-medium text-gray-800">{feedback.parentNames.mother}</span>
                </p>
                <p className="flex items-center">
                  <span className="text-gray-600 w-24">Father:</span>
                  <span className="font-medium text-gray-800">{feedback.parentNames.father}</span>
                </p>
                <p className="flex items-center">
                  <span className="text-gray-600 w-24">Carer:</span>
                  <span className="font-medium text-gray-800">{feedback.parentNames.carer}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Feedback Section */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-purple-100 p-2 rounded-lg mr-3">📝</span>
              Assessment Feedback
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-600 mb-2 font-medium">Issues</p>
                <p className="bg-gray-50 rounded-lg p-4 text-gray-800 min-h-[120px]">{feedback.issues}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2 font-medium">Learnings</p>
                <p className="bg-gray-50 rounded-lg p-4 text-gray-800 min-h-[120px]">{feedback.learnings}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2 font-medium">Favorite Feature</p>
                <p className="bg-gray-50 rounded-lg p-4 text-gray-800 min-h-[120px]">{feedback.favoriteFeature}</p>
              </div>
            </div>
          </div>

          {/* Ratings Section */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-yellow-100 p-2 rounded-lg mr-3">⭐</span>
              Ratings & Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 mb-2">Ease of Use</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-blue-600">{feedback.easeOfUseRating}</span>
                    <span className="text-gray-400 ml-1">/5</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 mb-2">Monitoring Ease</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-green-600">{feedback.monitoringEaseRating}</span>
                    <span className="text-gray-400 ml-1">/5</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 mb-2">Would Recommend</p>
                  <span className={`text-lg font-semibold ${feedback.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.wouldRecommend ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-2 font-medium">Overall Experience</p>
                  <p className="bg-gray-50 rounded-lg p-4 text-gray-800 min-h-[100px]">{feedback.overallExperience}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2 font-medium">Recommendation Reason</p>
                  <p className="bg-gray-50 rounded-lg p-4 text-gray-800 min-h-[100px]">{feedback.recommendationReason}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssesmentDetails; 