import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthorData, ProductFormValues } from "../../types";
import { errorToast, successToast } from "../../utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";
import AuthorDropdown from "../../components/Product/AuthorComponent";
import { AgeCategory, ProductType } from "../../utils/enums";

const initialValues = {
  title: "",
  description: "",
  price: 0,
  ageCategory: "",
  type: "", // This will store the product category (PODCAST, COMIC, etc.)
  product_type: "Free", // Default value
  tags: [],
  isFeatured: false,
  productSample: "",
  author: "",
  orignalProductSrc: "https://mentoons.com",
  productImages: [
    {
      imageUrl: "",
    },
  ],
  details: {}, // This will be populated based on the selected category
};

// Base validation schema
const baseValidationSchema = {
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price cannot be negative"),
  ageCategory: Yup.string().required("Age category is required"),
  type: Yup.string().required("Product category is required"),
  product_type: Yup.string().required("Product type is required"),
  orignalProductSrc: Yup.string().required(
    "Original product source is required"
  ),
  productImages: Yup.array()
    .of(
      Yup.object({
        imageUrl: Yup.string()
          .url("Must be a valid URL")
          .required("Image URL is required"),
      })
    )
    .min(1, "At least one image is required"),
};

const AddProducts = () => {
  const { getToken } = useAuth();
  const location = useLocation();
  const initialProduct = location.state?.product;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authors, setAuthors] = useState<AuthorData[]>([]);
  const [validationSchema, setValidationSchema] = useState(
    Yup.object(baseValidationSchema)
  );
  const [currentFormValues, setCurrentFormValues] = useState(
    initialProduct || initialValues
  );

  const fetchAuthors = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/author`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthors(data.data || []);
      } else {
        throw new Error("Failed to fetch authors");
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
      errorToast("Failed to fetch authors.");
    }
  };

  useEffect(() => {
    fetchAuthors();

    if (initialProduct?.type) {
      updateValidationSchema(initialProduct.type);
    }
  }, []);

  const uploadFile = async (file: File, fieldName: string) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/upload/file`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${await getToken()}` },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload ${fieldName}`);
    }

    const data = await response.json();
    return data.data.fileDetails.url;
  };

  const handleSubmit = async (
    values: ProductFormValues,
    { setSubmitting }: any
  ) => {
    setIsSubmitting(true);
    try {
      const uploadedFiles = {
        productThumbnail: values.productThumbnail
          ? await uploadFile(values.productThumbnail, "thumbnail")
          : null,
        productSample: values.productSample
          ? await uploadFile(values.productSample, "sample")
          : null,
        productFile: values.productFile
          ? await uploadFile(values.productFile, "product file")
          : null,
      };

      const productData = {
        ...values,
        ...uploadedFiles,
      };

      const url = `${import.meta.env.VITE_BASE_URL}/products`;
      const method = initialProduct ? "PATCH" : "POST";
      const productId = initialProduct?._id;

      const response = await fetch(
        initialProduct ? `${url}/${productId}` : url,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (response.ok) {
        successToast(
          initialProduct
            ? "Product updated successfully"
            : "Product added successfully"
        );
        navigate("/product-table");
      } else {
        throw new Error();
      }
    } catch (error: any) {
      console.error("Error saving product:", error);
      errorToast(error?.error || "Failed to save product. Please try again.");
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  const updateValidationSchema = (productType: string) => {
    let detailsSchema = {};
    let initialDetails = {};

    switch (productType) {
      case ProductType.COMIC:
        detailsSchema = {
          details: Yup.object({
            pages: Yup.number().required("Number of pages is required"),
            author: Yup.string().required("Author is required"),
            publisher: Yup.string(),
            language: Yup.string().default("en"),
            sampleUrl: Yup.string().url("Must be a valid URL"),
            releaseDate: Yup.date(),
            series: Yup.string(),
          }),
        };
        initialDetails = {
          pages: 0,
          author: "",
          publisher: "",
          language: "en",
          sampleUrl: "",
          releaseDate: null,
          series: "",
        };
        break;

      case ProductType.AUDIO_COMIC:
        detailsSchema = {
          details: Yup.object({
            duration: Yup.string().required("Duration is required"),
            narrator: Yup.string().required("Narrator is required"),
            language: Yup.string().default("en"),
            format: Yup.string(),
            sampleDuration: Yup.string(),
            sampleUrl: Yup.string().url("Must be a valid URL"),
            releaseDate: Yup.date(),
          }),
        };
        initialDetails = {
          duration: "",
          narrator: "",
          language: "en",
          format: "",
          sampleDuration: "",
          sampleUrl: "",
          releaseDate: null,
        };
        break;

      case ProductType.PODCAST:
        detailsSchema = {
          details: Yup.object({
            category: Yup.string().required("Category is required"),
            episodeNumber: Yup.number().required("Episode number is required"),
            duration: Yup.string(),
            language: Yup.string().default("en"),
            host: Yup.string(),
            sampleUrl: Yup.string().url("Must be a valid URL"),
            releaseDate: Yup.date(),
          }),
        };
        initialDetails = {
          category: "",
          episodeNumber: 1,
          duration: "",
          language: "en",
          host: "",
          sampleUrl: "",
          releaseDate: null,
        };
        break;

      case ProductType.WORKSHOP:
        detailsSchema = {
          details: Yup.object({
            instructor: Yup.string().required("Instructor is required"),
            location: Yup.string(),
            schedule: Yup.date().required("Schedule is required"),
            duration: Yup.number().required("Duration is required"),
            capacity: Yup.number(),
            materials: Yup.array().of(Yup.string()),
            logoUrl: Yup.string().url("Must be a valid URL"),
            workshopSubTitle: Yup.string(),
            workshopAim: Yup.string(),
            workshopOffering: Yup.array().of(
              Yup.object({
                title: Yup.string().required("Offering title is required"),
                description: Yup.string(),
                imageUrl: Yup.string().url("Must be a valid URL"),
                accentColor: Yup.string(),
              })
            ),
            addressedIssues: Yup.array().of(
              Yup.object({
                title: Yup.string().required("Issue title is required"),
                description: Yup.string(),
                issueIllustrationUrl: Yup.string().url("Must be a valid URL"),
              })
            ),
          }),
        };
        initialDetails = {
          instructor: "",
          location: "",
          schedule: null,
          duration: 0,
          capacity: 0,
          materials: [],
          logoUrl: "",
          workshopSubTitle: "",
          workshopAim: "",
          workshopOffering: [],
          addressedIssues: [],
        };
        break;

      case ProductType.ASSESSMENT:
        detailsSchema = {
          details: Yup.object({
            color: Yup.string(),
            duration: Yup.number(),
            difficulty: Yup.string(),
            credits: Yup.string(),
            questionGallery: Yup.array()
              .of(
                Yup.object({
                  imageUrl: Yup.string().required(
                    "Question image URL is required"
                  ),
                  options: Yup.array().of(Yup.string()),
                  correctAnswer: Yup.string(),
                })
              )
              .required("Question gallery is required"),
          }),
        };
        initialDetails = {
          color: "",
          duration: 0,
          difficulty: "",
          credits: "",
          questionGallery: [{ imageUrl: "", options: [], correctAnswer: "" }],
        };
        break;

      case ProductType.MENTOONS_CARDS:
        detailsSchema = {
          details: Yup.object({
            cardType: Yup.string().required("Card type is required"),
            accentColor: Yup.string(),
            addressedIssues: Yup.array().of(
              Yup.object({
                title: Yup.string().required("Issue title is required"),
                description: Yup.string(),
                issueIllustrationUrl: Yup.string().url("Must be a valid URL"),
              })
            ),
            productDescription: Yup.array().of(
              Yup.object({
                label: Yup.string(),
                descriptionList: Yup.array().of(
                  Yup.object({
                    description: Yup.string(),
                  })
                ),
              })
            ),
          }),
        };
        initialDetails = {
          cardType: "",
          accentColor: "",
          addressedIssues: [],
          productDescription: [],
        };
        break;

      case ProductType.MERCHANDISE:
        detailsSchema = {
          details: Yup.object({
            size: Yup.string(),
            color: Yup.string(),
            materials: Yup.string(),
            brand: Yup.string(),
            price: Yup.number().required("Price is required"),
            stockQuantity: Yup.number(),
            description: Yup.string(),
            careInstructions: Yup.string(),
            createBy: Yup.string(),
            createDate: Yup.date(),
          }),
        };
        initialDetails = {
          size: "",
          color: "",
          materials: "",
          brand: "",
          price: 0,
          stockQuantity: 0,
          description: "",
          careInstructions: "",
          createBy: "",
          createDate: null,
        };
        break;

      case ProductType.MENTOONS_BOOKS:
        detailsSchema = {
          details: Yup.object({
            pages: Yup.number().required("Number of pages is required"),
            author: Yup.string().required("Author is required"),
            publisher: Yup.string(),
            language: Yup.string().default("en"),
            releaseDate: Yup.date(),
            series: Yup.string(),
            bookType: Yup.string(),
            isbn: Yup.string(),
            edition: Yup.string(),
          }),
        };
        initialDetails = {
          pages: 0,
          author: "",
          publisher: "",
          language: "en",
          releaseDate: null,
          series: "",
          bookType: "",
          isbn: "",
          edition: "",
        };
        break;

      default:
        detailsSchema = {
          details: Yup.object({}),
        };
        initialDetails = {};
        break;
    }

    // Update the validation schema with the details specific to the selected product type
    setValidationSchema(
      Yup.object({ ...baseValidationSchema, ...detailsSchema })
    );

    setCurrentFormValues((prevValues: any) => ({
      ...prevValues,
      type: productType,
      details: initialProduct?.details || initialDetails,
    }));
  };

  // Render form fields based on product type
  const renderCategoryFields = (formik: any) => {
    const { values, setFieldValue } = formik;
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
                  values.details.workshopOffering.map((_, index: number) => (
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
                  ))}
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
                  values.details.addressedIssues.map((_, index: number) => (
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
                  ))}
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
                  values.details.questionGallery.map((_, index: number) => (
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
                              (_, optIndex: number) => (
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
                  ))}
                <button
                  type="button"
                  onClick={() => {
                    const questions = [
                      ...(values.details.questionGallery || []),
                    ];
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
                  values.details.addressedIssues.map((_, index) => (
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
                  ))}
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
                  values.details.productDescription.map((_, index) => (
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
                            ].descriptionList.map((_, descIndex) => (
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
                            ))}
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
                  ))}
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

  return (
    <div className="bg-white px-8 py-6 rounded-lg shadow-lg max-w-4xl mx-auto mb-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {initialProduct ? "Edit Product" : "Add Product"}
      </h1>
      <Formik
        initialValues={currentFormValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, isValid, ...formik }) => (
          <Form className="space-y-6">
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <Field
                  id="title"
                  name="title"
                  aria-required="true"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₹
                  </span>
                  <Field
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    aria-required="true"
                    className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Age Category */}
              <div className="space-y-2">
                <label
                  htmlFor="ageCategory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age Category <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  id="ageCategory"
                  name="ageCategory"
                  aria-required="true"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Age Category</option>
                  {Object.values(AgeCategory).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="ageCategory"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Product Category */}
              <div className="space-y-2">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Category <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  id="type"
                  name="type"
                  aria-required="true"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    formik.handleChange(e);
                    updateValidationSchema(e.target.value);
                  }}
                >
                  <option value="">Select Product Category</option>
                  {Object.values(ProductType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Product Type (Free/Paid) */}
              <div className="space-y-2">
                <label
                  htmlFor="product_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Type <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  id="product_type"
                  name="product_type"
                  aria-required="true"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </Field>
                <ErrorMessage
                  name="product_type"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Original Product Source */}
              <div className="space-y-2">
                <label
                  htmlFor="orignalProductSrc"
                  className="block text-sm font-medium text-gray-700"
                >
                  Original Product Source
                </label>
                <Field
                  id="orignalProductSrc"
                  name="orignalProductSrc"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ErrorMessage
                  name="orignalProductSrc"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Author Dropdown */}
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700"
                >
                  Author <span className="text-red-500">*</span>
                </label>
                <AuthorDropdown authors={authors} formik={formik} />
                <ErrorMessage
                  name="author"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Featured Product Checkbox */}
              <div className="flex items-center space-x-2">
                <Field
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm font-medium text-gray-700"
                >
                  Featured Product
                </label>
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows="4"
                  aria-required="true"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tags (comma separated)
                </label>
                <Field
                  id="tags"
                  name="tags"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tag1, tag2, tag3"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Separate tags with commas
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-6 md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900">Uploads</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Thumbnail */}
                  <div className="space-y-2">
                    <label
                      htmlFor="productThumbnail"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Product Thumbnail{" "}
                      {!initialProduct && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      id="productThumbnail"
                      name="productThumbnail"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "productThumbnail",
                          event.currentTarget.files[0]
                        );
                      }}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formik.values.productThumbnail && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formik.values.productThumbnail.name}
                      </div>
                    )}
                  </div>

                  {/* Product File */}
                  <div className="space-y-2">
                    <label
                      htmlFor="productFile"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Product File{" "}
                      {!initialProduct && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      id="productFile"
                      name="productFile"
                      type="file"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "productFile",
                          event.currentTarget.files[0]
                        );
                      }}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formik.values.productFile && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formik.values.productFile.name}
                      </div>
                    )}
                  </div>

                  {/* Product Sample */}
                  <div className="space-y-2">
                    <label
                      htmlFor="productSample"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Product Sample
                    </label>
                    <input
                      id="productSample"
                      name="productSample"
                      type="file"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "productSample",
                          event.currentTarget.files[0]
                        );
                      }}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formik.values.productSample && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formik.values.productSample.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">{renderCategoryFields(formik)}</div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/product-table")}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting || !isValid
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {initialProduct ? "Updating..." : "Saving..."}
                  </span>
                ) : initialProduct ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProducts;
