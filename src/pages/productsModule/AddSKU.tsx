import { useAuth } from "@clerk/clerk-react";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { successToast } from "../../utils/toastResposnse";

// Create a more flexible validation schema
// const validationSchema = Yup.object({
//   productTitle: Yup.string().required("Card Title is required"),
//   productSummary: Yup.string().required("Card Summary is required"),
//   minAge: Yup.number().required("Minimum Age is required"),
//   maxAge: Yup.number().required("Maximum Age is required"),
//   ageFilter: Yup.string(),
//   rating: Yup.string(),
//   paperEditionPrice: Yup.number()
//     .positive()
//     .typeError("Price must be a number"),
//   printablePrice: Yup.number().positive().typeError("Price must be a number"),
//   productImages: Yup.array().of(
//     Yup.object({
//       imageSrc: Yup.string().required("Image is required"),
//     })
//   ),
//   productVideos: Yup.array().of(
//     Yup.object({
//       videoSrc: Yup.string().required("Video is required"),
//     })
//   ),
//   productDescription: Yup.array().of(
//     Yup.object({
//       label: Yup.string(),
//       descriptionList: Yup.array().of(
//         Yup.object({
//           description: Yup.string(),
//         })
//       ),
//     })
//   ),
// });

// Initial Values
const initialValues = {
  productTitle: "",
  productSummary: "",
  productCategory: "",
  minAge: undefined,
  maxAge: undefined,
  ageFilter: "",
  rating: "",
  paperEditionPrice: undefined,
  printablePrice: undefined,
  productImages: [{ imageSrc: "" }],
  productVideos: [{ videoSrc: "" }],
  productDescriptions: [
    {
      label: "",
      descriptionList: [{ description: "" }],
    },
  ],
};

const ageOptions = [
  { value: "6-12", label: "6-12 years" },
  { value: "13-16", label: "13-16 years" },
  { value: "17-19", label: "17-19 years" },
  { value: "20+", label: "20+ years" },
];
interface ProductImage {
  imageSrc: string;
}

interface ProductVideo {
  videoSrc: string;
}

interface DescriptionList {
  description: string;
}

interface ProductDescription {
  label: string;
  descriptionList: DescriptionList[];
}

interface FormValues {
  productTitle: string;
  productCategory: string;
  productSummary: string;
  minAge: number | undefined;
  maxAge: number | undefined;
  ageFilter: string;
  rating: string;
  paperEditionPrice: number | undefined;
  printablePrice: number | undefined;
  productImages: ProductImage[];
  productVideos: ProductVideo[];
  productDescriptions: ProductDescription[];
}

const AddSku = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const handleSubmit = async (values: FormValues) => {
    const token = await getToken();
    try {
      //upload image files here
      const uploadImageFiles = async (files: File[]) => {
        console.log("Uploading image files", files);
        console.log("token", token);
        const uploadedUrls = [];

        for (const file of files) {
          console.log("file", file);
          const formData = new FormData();
          formData.append("file", file);
          console.log("formdata", formData);
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/upload/file`,

            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to upload file`);
          }

          const data = await response.json();
          uploadedUrls.push(data?.data?.imageUrl);
        }
        return uploadedUrls;
      };
      // upload video files here
      const uploadVideoFiles = async (files: File[]) => {
        console.log("Uploading video files", files);
        console.log("token", token);
        const uploadedUrls = [];
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/upload/file`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to upload file`);
          }

          const data = await response.json();
          uploadedUrls.push(data?.data?.imageUrl);
        }
        return uploadedUrls;
      };

      const uploadedImages = await uploadImageFiles(
        values.productImages.map((img) => img.imageSrc as unknown as File)
      );
      const uploadedVideos = await uploadVideoFiles(
        values.productVideos.map((vid) => vid.videoSrc as unknown as File)
      );

      // Update the values with the uploaded URLs
      values.productImages = values.productImages.map((img, index) => ({
        ...img,
        imageSrc: uploadedImages[index],
      }));
      values.productVideos = values.productVideos.map((vid, index) => ({
        ...vid,
        videoSrc: uploadedVideos[index],
      }));

      console.log("Form Values:", values);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/sku`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("New Product:", data);
        successToast("Product added successfully");
        navigate("/all-sku");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };
  return (
    <Card className="w-full max-w-8xl mx-auto">
      <CardHeader>
        <CardTitle>Add SKU </CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={handleSubmit}
          // validateOnBlur={true}
          // validateOnChange={true}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="productTitle" className="block mb-2">
                    Product Title
                  </label>
                  <Field
                    name="productTitle"
                    as={Input}
                    placeholder="Enter card title"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="productTitle"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="productSummary" className="block mb-2">
                    Product Summary
                  </label>
                  <Field
                    name="productSummary"
                    as={Input}
                    placeholder="Enter card summary"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="productSummary"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Age Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="minAge" className="block mb-2">
                    Minimum Age
                  </label>
                  <Field
                    name="minAge"
                    as={Input}
                    type="number"
                    placeholder="Enter minimum age"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="minAge"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="maxAge" className="block mb-2">
                    Maximum Age
                  </label>
                  <Field
                    name="maxAge"
                    as={Input}
                    type="number"
                    placeholder="Enter maximum age"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="maxAge"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              {/* Age Filter */}
              <div>
                <label htmlFor="ageFilter" className="block mb-2">
                  Age Filter
                </label>
                <Field
                  name="ageFilter"
                  as={Select}
                  onValueChange={(value: string) =>
                    setFieldValue("ageFilter", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select age filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Field>
              </div>
              {/* Pricing Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="paperEditionPrice" className="block mb-2">
                    Paper Edition Price
                  </label>
                  <Field
                    name="paperEditionPrice"
                    as={Input}
                    type="number"
                    placeholder="Enter price"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="paperEditionPrice"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="printablePrice" className="block mb-2">
                    Printable Price
                  </label>
                  <Field
                    name="printablePrice"
                    as={Input}
                    type="number"
                    placeholder="Enter price"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="printablePrice"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Rating and Category Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rating" className="block mb-2">
                    Rating
                  </label>
                  <Field
                    name="rating"
                    as={Input}
                    placeholder="Enter rating"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="rating"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="productCategory" className="block mb-2">
                    Product Category
                  </label>
                  <Field
                    name="productCategory"
                    as={Select}
                    onValueChange={(value: string) =>
                      setFieldValue("productCategory", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversation-starter-card">
                        Conversation Starter Card
                      </SelectItem>
                      <SelectItem value="story-re-teller-card">
                        Story Re-teller Card
                      </SelectItem>
                      <SelectItem value="silent-stories">
                        Silent Stories
                      </SelectItem>
                      <SelectItem value="colouring-books">
                        Colouring Books
                      </SelectItem>
                    </SelectContent>
                  </Field>
                  <ErrorMessage
                    name="productCategory"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              {/* Dynamic Card Images */}
              <FieldArray name="productImages">
                {({ remove, push }) => (
                  <div>
                    <label className="block mb-2">Product Images</label>
                    {values.productImages.map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.currentTarget.files?.[0];
                            if (file) {
                              setFieldValue(
                                `productImages.${index}.imageSrc`,
                                file
                              );
                            }
                          }}
                          className="flex-grow"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            // Ensure at least one image field remains
                            if (values.productImages.length > 1) {
                              remove(index);
                            } else {
                              // If it's the last field, just clear it
                              setFieldValue(
                                `productImages.${index}.imageSrc`,
                                ""
                              );
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => push({ imageSrc: "" })}
                    >
                      Add Image
                    </Button>
                  </div>
                )}
              </FieldArray>

              {/* Dynamic Card Videos */}
              <FieldArray name="productVideos">
                {({ remove, push }) => (
                  <div>
                    <label className="block mb-2">Product Videos</label>
                    {values.productVideos.map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(event) => {
                            const file = event.currentTarget.files?.[0];
                            if (file) {
                              setFieldValue(
                                `productVideos.${index}.videoSrc`,
                                file
                              );
                            }
                          }}
                          className="flex-grow"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            // Ensure at least one video field remains
                            if (values.productVideos.length > 1) {
                              remove(index);
                            } else {
                              // If it's the last field, just clear it
                              setFieldValue(
                                `productVideos.${index}.videoSrc`,
                                ""
                              );
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => push({ videoSrc: "" })}
                    >
                      Add Video
                    </Button>
                  </div>
                )}
              </FieldArray>

              {/* Dynamic Card Description */}
              <FieldArray name="productDescriptions">
                {({ remove, push }) => (
                  <div>
                    <label className="block mb-2">Product Description</label>
                    {values.productDescriptions.map((desc, descIndex) => (
                      <div
                        key={descIndex}
                        className="space-y-2 mb-4 p-4 border rounded"
                      >
                        <div>
                          <label
                            htmlFor={`productDescriptions.${descIndex}.label`}
                            className="block mb-2"
                          >
                            Description Label
                          </label>
                          <Field
                            name={`productDescriptions.${descIndex}.label`}
                            as={Input}
                            placeholder="Enter description label"
                            className="w-full"
                          />
                        </div>

                        <FieldArray
                          name={`productDescriptions.${descIndex}.descriptionList`}
                        >
                          {({ remove: removeDesc, push: pushDesc }) => (
                            <div>
                              {desc.descriptionList.map((_, listIndex) => (
                                <div
                                  key={listIndex}
                                  className="flex items-center space-x-2 mb-2"
                                >
                                  <Field
                                    name={`productDescriptions.${descIndex}.descriptionList.${listIndex}.description`}
                                    as={Input}
                                    placeholder="Enter description"
                                    className="flex-grow"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                      // Ensure at least one description field remains
                                      if (desc.descriptionList.length > 1) {
                                        removeDesc(listIndex);
                                      } else {
                                        // If it's the last field, just clear it
                                        setFieldValue(
                                          `productDescriptions.${descIndex}.descriptionList.${listIndex}.description`,
                                          ""
                                        );
                                      }
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => pushDesc({ description: "" })}
                              >
                                Add Description
                              </Button>
                            </div>
                          )}
                        </FieldArray>

                        {values.productDescriptions.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(descIndex)}
                          >
                            Remove Description Section
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        push({
                          label: "",
                          descriptionList: [{ description: "" }],
                        })
                      }
                    >
                      Add Description Section
                    </Button>
                  </div>
                )}
              </FieldArray>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-red-500 "
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default AddSku;
