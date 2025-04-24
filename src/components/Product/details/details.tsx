import { ErrorMessage, Field } from "formik";
import { CardType, ProductType } from "../../../utils/enums";

const ShowDetails = (formik: any) => {
  const { values, setFieldValue } = formik;
  console.log("values got :", values);
  const productType = values.type;

  if (!productType) return null;
  switch (productType) {
    case ProductType.COMIC:
      return (
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-medium">Comic Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="details.pages"
                className="block text-sm font-medium text-gray-700"
              >
                Pages
              </label>
              <Field
                id="details.pages"
                name="details.pages"
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.pages"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.author"
                className="block text-sm font-medium text-gray-700"
              >
                Author
              </label>
              <Field
                id="details.author"
                name="details.author"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.author"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.publisher"
                className="block text-sm font-medium text-gray-700"
              >
                Publisher
              </label>
              <Field
                id="details.publisher"
                name="details.publisher"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.language"
                className="block text-sm font-medium text-gray-700"
              >
                Language
              </label>
              <Field
                id="details.language"
                name="details.language"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.sampleUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Sample URL
              </label>
              <Field
                id="details.sampleUrl"
                name="details.sampleUrl"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.sampleUrl"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.releaseDate"
                className="block text-sm font-medium text-gray-700"
              >
                Release Date
              </label>
              <Field
                id="details.releaseDate"
                name="details.releaseDate"
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.series"
                className="block text-sm font-medium text-gray-700"
              >
                Series
              </label>
              <Field
                id="details.series"
                name="details.series"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      );

    case ProductType.AUDIO_COMIC:
      return (
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-medium">Audio Comic Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="details.duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration
              </label>
              <Field
                id="details.duration"
                name="details.duration"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., 15:30"
              />
              <ErrorMessage
                name="details.duration"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.narrator"
                className="block text-sm font-medium text-gray-700"
              >
                Narrator
              </label>
              <Field
                id="details.narrator"
                name="details.narrator"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.narrator"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.language"
                className="block text-sm font-medium text-gray-700"
              >
                Language
              </label>
              <Field
                id="details.language"
                name="details.language"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.format"
                className="block text-sm font-medium text-gray-700"
              >
                Format
              </label>
              <Field
                id="details.format"
                name="details.format"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., MP3, WAV"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.sampleDuration"
                className="block text-sm font-medium text-gray-700"
              >
                Sample Duration
              </label>
              <Field
                id="details.sampleDuration"
                name="details.sampleDuration"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., 2:00"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.sampleUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Sample URL
              </label>
              <Field
                id="details.sampleUrl"
                name="details.sampleUrl"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.releaseDate"
                className="block text-sm font-medium text-gray-700"
              >
                Release Date
              </label>
              <Field
                id="details.releaseDate"
                name="details.releaseDate"
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      );

    case ProductType.PODCAST:
      return (
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-medium">Podcast Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="details.category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <Field
                id="details.category"
                name="details.category"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.category"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.episodeNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Episode Number
              </label>
              <Field
                id="details.episodeNumber"
                name="details.episodeNumber"
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.episodeNumber"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration
              </label>
              <Field
                id="details.duration"
                name="details.duration"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., 30:45"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.language"
                className="block text-sm font-medium text-gray-700"
              >
                Language
              </label>
              <Field
                id="details.language"
                name="details.language"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.host"
                className="block text-sm font-medium text-gray-700"
              >
                Host
              </label>
              <Field
                id="details.host"
                name="details.host"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.sampleUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Sample URL
              </label>
              <Field
                id="details.sampleUrl"
                name="details.sampleUrl"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.releaseDate"
                className="block text-sm font-medium text-gray-700"
              >
                Release Date
              </label>
              <Field
                id="details.releaseDate"
                name="details.releaseDate"
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      );

    case ProductType.WORKSHOP:
      return (
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-medium">Workshop Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="details.instructor"
                className="block text-sm font-medium text-gray-700"
              >
                Instructor
              </label>
              <Field
                id="details.instructor"
                name="details.instructor"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.instructor"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <Field
                id="details.location"
                name="details.location"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.schedule"
                className="block text-sm font-medium text-gray-700"
              >
                Schedule
              </label>
              <Field
                id="details.schedule"
                name="details.schedule"
                type="datetime-local"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.schedule"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration (hours)
              </label>
              <Field
                id="details.duration"
                name="details.duration"
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.duration"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.capacity"
                className="block text-sm font-medium text-gray-700"
              >
                Capacity
              </label>
              <Field
                id="details.capacity"
                name="details.capacity"
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.logoUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Logo URL
              </label>
              <Field
                id="details.logoUrl"
                name="details.logoUrl"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.workshopSubTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Workshop Subtitle
              </label>
              <Field
                id="details.workshopSubTitle"
                name="details.workshopSubTitle"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label
                htmlFor="details.workshopAim"
                className="block text-sm font-medium text-gray-700"
              >
                Workshop Aim
              </label>
              <Field
                id="details.workshopAim"
                name="details.workshopAim"
                as="textarea"
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Workshop Offerings Section */}
            <div className="col-span-2 space-y-4">
              <h4 className="text-md font-medium">Workshop Offerings</h4>
              {values.details.workshopOffering &&
                values.details.workshopOffering.map(
                  (_: string, index: number) => (
                    <div
                      key={index}
                      className="border p-3 rounded-md space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium">Offering #{index + 1}</h5>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newOfferings = [
                                ...values.details.workshopOffering,
                              ];
                              newOfferings.splice(index, 1);
                              setFieldValue(
                                "details.workshopOffering",
                                newOfferings
                              );
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Title
                          </label>
                          <Field
                            name={`details.workshopOffering[${index}].title`}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                          <ErrorMessage
                            name={`details.workshopOffering[${index}].title`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Image URL
                          </label>
                          <Field
                            name={`details.workshopOffering[${index}].imageUrl`}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Accent Color
                          </label>
                          <Field
                            name={`details.workshopOffering[${index}].accentColor`}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <Field
                            name={`details.workshopOffering[${index}].description`}
                            as="textarea"
                            rows="2"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              <button
                type="button"
                onClick={() => {
                  const offerings = [
                    ...(values.details.workshopOffering || []),
                  ];
                  offerings.push({
                    title: "",
                    description: "",
                    imageUrl: "",
                    accentColor: "",
                  });
                  setFieldValue("details.workshopOffering", offerings);
                }}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
              >
                Add Offering
              </button>
            </div>

            <div className="col-span-2 space-y-4">
              <h4 className="text-md font-medium">Addressed Issues</h4>
              {values.details.addressedIssues &&
                values.details.addressedIssues.map(
                  (_: string, index: number) => (
                    <div
                      key={index}
                      className="border p-3 rounded-md space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium">Issue #{index + 1}</h5>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newIssues = [
                                ...values.details.addressedIssues,
                              ];
                              newIssues.splice(index, 1);
                              setFieldValue(
                                "details.addressedIssues",
                                newIssues
                              );
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Title
                          </label>
                          <Field
                            name={`details.addressedIssues[${index}].title`}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                          <ErrorMessage
                            name={`details.addressedIssues[${index}].title`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Illustration URL
                          </label>
                          <Field
                            name={`details.addressedIssues[${index}].issueIllustrationUrl`}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <Field
                            name={`details.addressedIssues[${index}].description`}
                            as="textarea"
                            rows="2"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              <button
                type="button"
                onClick={() => {
                  const issues = [...(values.details.addressedIssues || [])];
                  issues.push({
                    title: "",
                    description: "",
                    issueIllustrationUrl: "",
                  });
                  setFieldValue("details.addressedIssues", issues);
                }}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
              >
                Add Issue
              </button>
            </div>
          </div>
        </div>
      );

    case ProductType.ASSESSMENT:
      return (
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-medium">Assessment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="details.color"
                className="block text-sm font-medium text-gray-700"
              >
                Color
              </label>
              <Field
                id="details.color"
                name="details.color"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration (minutes)
              </label>
              <Field
                id="details.duration"
                name="details.duration"
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.difficulty"
                className="block text-sm font-medium text-gray-700"
              >
                Difficulty
              </label>
              <Field
                id="details.difficulty"
                name="details.difficulty"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.credits"
                className="block text-sm font-medium text-gray-700"
              >
                Credits
              </label>
              <Field
                id="details.credits"
                name="details.credits"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-2 space-y-4">
              <h4 className="text-md font-medium">Question Gallery</h4>
              {values.details.questionGallery &&
                values.details.questionGallery.map(
                  (_: string, index: number) => (
                    <div
                      key={index}
                      className="border p-3 rounded-md space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium">Question #{index + 1}</h5>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newQuestions = [
                                ...values.details.questionGallery,
                              ];
                              newQuestions.splice(index, 1);
                              setFieldValue(
                                "details.questionGallery",
                                newQuestions
                              );
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Image URL
                          </label>
                          <Field
                            name={`details.questionGallery[${index}].imageUrl`}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                          <ErrorMessage
                            name={`details.questionGallery[${index}].imageUrl`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Options
                          </label>
                          {values.details.questionGallery[index].options &&
                            values.details.questionGallery[index].options.map(
                              (_: string, optIndex: number) => (
                                <div
                                  key={optIndex}
                                  className="flex items-center gap-2"
                                >
                                  <Field
                                    name={`details.questionGallery[${index}].options[${optIndex}]`}
                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                  />
                                  {optIndex > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newOptions = [
                                          ...values.details.questionGallery[
                                            index
                                          ].options,
                                        ];
                                        newOptions.splice(optIndex, 1);
                                        setFieldValue(
                                          `details.questionGallery[${index}].options`,
                                          newOptions
                                        );
                                      }}
                                      className="text-red-500"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              )
                            )}
                          <button
                            type="button"
                            onClick={() => {
                              const options = [
                                ...(values.details.questionGallery[index]
                                  .options || []),
                              ];
                              options.push("");
                              setFieldValue(
                                `details.questionGallery[${index}].options`,
                                options
                              );
                            }}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm hover:bg-blue-200"
                          >
                            Add Option
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Correct Answer
                          </label>
                          <Field
                            name={`details.questionGallery[${index}].correctAnswer`}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              <button
                type="button"
                onClick={() => {
                  const questions = [...(values.details.questionGallery || [])];
                  questions.push({
                    imageUrl: "",
                    options: [""],
                    correctAnswer: "",
                  });
                  setFieldValue("details.questionGallery", questions);
                }}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      );

    case ProductType.MENTOONS_CARDS:
      return (
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-medium">Mentoons Card Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="details.cardType"
                className="block text-sm font-medium text-gray-700"
              >
                Card Type
              </label>
              <Field
                as="select"
                id="details.cardType"
                name="details.cardType"
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Card Type</option>
                {Object.values(CardType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="details.cardType"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.accentColor"
                className="block text-sm font-medium text-gray-700"
              >
                Accent Color
              </label>
              <Field
                id="details.accentColor"
                name="details.accentColor"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="col-span-2 space-y-4">
              <h4 className="text-md font-medium">Addressed Issues</h4>
              {values.details.addressedIssues &&
                values.details.addressedIssues.map(
                  (_: string, index: number) => (
                    <div
                      key={index}
                      className="border p-3 rounded-md space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium">Issue #{index + 1}</h5>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newIssues = [
                                ...values.details.addressedIssues,
                              ];
                              newIssues.splice(index, 1);
                              setFieldValue(
                                "details.addressedIssues",
                                newIssues
                              );
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Title
                          </label>
                          <Field
                            name={`details.addressedIssues[${index}].title`}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                          <ErrorMessage
                            name={`details.addressedIssues[${index}].title`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Illustration URL
                          </label>
                          <Field
                            name={`details.addressedIssues[${index}].issueIllustrationUrl`}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <Field
                            name={`details.addressedIssues[${index}].description`}
                            as="textarea"
                            rows="2"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              <button
                type="button"
                onClick={() => {
                  const issues = [...(values.details.addressedIssues || [])];
                  issues.push({
                    title: "",
                    description: "",
                    issueIllustrationUrl: "",
                  });
                  setFieldValue("details.addressedIssues", issues);
                }}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
              >
                Add Issue
              </button>
            </div>

            <div className="col-span-2 space-y-4">
              <h4 className="text-md font-medium">Product Description</h4>
              {values.details.productDescription &&
                values.details.productDescription.map(
                  (_: string, index: number) => (
                    <div
                      key={index}
                      className="border p-3 rounded-md space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium">
                          Description Section #{index + 1}
                        </h5>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newDescriptions = [
                                ...values.details.productDescription,
                              ];
                              newDescriptions.splice(index, 1);
                              setFieldValue(
                                "details.productDescription",
                                newDescriptions
                              );
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Label
                          </label>
                          <Field
                            name={`details.productDescription[${index}].label`}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Description Items
                          </label>
                          {values.details.productDescription[index]
                            .descriptionList &&
                            values.details.productDescription[
                              index
                            ].descriptionList.map(
                              (_: string, descIndex: number) => (
                                <div
                                  key={descIndex}
                                  className="flex items-center gap-2"
                                >
                                  <Field
                                    name={`details.productDescription[${index}].descriptionList[${descIndex}].description`}
                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                  />
                                  {descIndex > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newList = [
                                          ...values.details.productDescription[
                                            index
                                          ].descriptionList,
                                        ];
                                        newList.splice(descIndex, 1);
                                        setFieldValue(
                                          `details.productDescription[${index}].descriptionList`,
                                          newList
                                        );
                                      }}
                                      className="text-red-500"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              )
                            )}
                          <button
                            type="button"
                            onClick={() => {
                              const list = [
                                ...(values.details.productDescription[index]
                                  .descriptionList || []),
                              ];
                              list.push({ description: "" });
                              setFieldValue(
                                `details.productDescription[${index}].descriptionList`,
                                list
                              );
                            }}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm hover:bg-blue-200"
                          >
                            Add Description Item
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              <button
                type="button"
                onClick={() => {
                  const descriptions = [
                    ...(values.details.productDescription || []),
                  ];
                  descriptions.push({
                    label: "",
                    descriptionList: [{ description: "" }],
                  });
                  setFieldValue("details.productDescription", descriptions);
                }}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
              >
                Add Description Section
              </button>
            </div>
          </div>
        </div>
      );

    case ProductType.MERCHANDISE:
      return (
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-medium">Merchandise Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="details.size"
                className="block text-sm font-medium text-gray-700"
              >
                Size
              </label>
              <Field
                id="details.size"
                name="details.size"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.color"
                className="block text-sm font-medium text-gray-700"
              >
                Color
              </label>
              <Field
                id="details.color"
                name="details.color"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.materials"
                className="block text-sm font-medium text-gray-700"
              >
                Materials
              </label>
              <Field
                id="details.materials"
                name="details.materials"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.brand"
                className="block text-sm font-medium text-gray-700"
              >
                Brand
              </label>
              <Field
                id="details.brand"
                name="details.brand"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <Field
                id="details.price"
                name="details.price"
                type="number"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.price"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.stockQuantity"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Quantity
              </label>
              <Field
                id="details.stockQuantity"
                name="details.stockQuantity"
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label
                htmlFor="details.description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Field
                id="details.description"
                name="details.description"
                as="textarea"
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label
                htmlFor="details.careInstructions"
                className="block text-sm font-medium text-gray-700"
              >
                Care Instructions
              </label>
              <Field
                id="details.careInstructions"
                name="details.careInstructions"
                as="textarea"
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      );

    case ProductType.MENTOONS_BOOKS:
      return (
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-medium">Mentoons Book Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="details.pages"
                className="block text-sm font-medium text-gray-700"
              >
                Pages
              </label>
              <Field
                id="details.pages"
                name="details.pages"
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.pages"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.author"
                className="block text-sm font-medium text-gray-700"
              >
                Author
              </label>
              <Field
                id="details.author"
                name="details.author"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="details.author"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.publisher"
                className="block text-sm font-medium text-gray-700"
              >
                Publisher
              </label>
              <Field
                id="details.publisher"
                name="details.publisher"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.language"
                className="block text-sm font-medium text-gray-700"
              >
                Language
              </label>
              <Field
                id="details.language"
                name="details.language"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.releaseDate"
                className="block text-sm font-medium text-gray-700"
              >
                Release Date
              </label>
              <Field
                id="details.releaseDate"
                name="details.releaseDate"
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.series"
                className="block text-sm font-medium text-gray-700"
              >
                Series
              </label>
              <Field
                id="details.series"
                name="details.series"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.bookType"
                className="block text-sm font-medium text-gray-700"
              >
                Book Type
              </label>
              <Field
                id="details.bookType"
                name="details.bookType"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.isbn"
                className="block text-sm font-medium text-gray-700"
              >
                ISBN
              </label>
              <Field
                id="details.isbn"
                name="details.isbn"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="details.edition"
                className="block text-sm font-medium text-gray-700"
              >
                Edition
              </label>
              <Field
                id="details.edition"
                name="details.edition"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default ShowDetails;
