// import { useAuth } from "@clerk/clerk-react";
// import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
// import { useNavigate } from "react-router-dom";
// import { Button } from "../../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import { successToast } from "../../utils/toastResposnse";

import { useEffect, useState } from "react";
import { ProductBase } from "../../types/productType";

// // Create a more flexible validation schema
// // const validationSchema = Yup.object({
// //   productTitle: Yup.string().required("Card Title is required"),
// //   productSummary: Yup.string().required("Card Summary is required"),
// //   minAge: Yup.number().required("Minimum Age is required"),
// //   maxAge: Yup.number().required("Maximum Age is required"),
// //   ageFilter: Yup.string(),
// //   rating: Yup.string(),
// //   paperEditionPrice: Yup.number()
// //     .positive()
// //     .typeError("Price must be a number"),
// //   printablePrice: Yup.number().positive().typeError("Price must be a number"),
// //   productImages: Yup.array().of(
// //     Yup.object({
// //       imageSrc: Yup.string().required("Image is required"),
// //     })
// //   ),
// //   productVideos: Yup.array().of(
// //     Yup.object({
// //       videoSrc: Yup.string().required("Video is required"),
// //     })
// //   ),
// //   productDescription: Yup.array().of(
// //     Yup.object({
// //       label: Yup.string(),
// //       descriptionList: Yup.array().of(
// //         Yup.object({
// //           description: Yup.string(),
// //         })
// //       ),
// //     })
// //   ),
// // });

// // Initial Values
// const initialValues = {
//   productTitle: "",
//   productSummary: "",
//   productCategory: "",
//   minAge: undefined,
//   maxAge: undefined,
//   ageFilter: "",
//   rating: "",
//   paperEditionPrice: undefined,
//   printablePrice: undefined,
//   productImages: [{ imageSrc: "" }],
//   productVideos: [{ videoSrc: "" }],
//   productDescriptions: [
//     {
//       label: "",
//       descriptionList: [{ description: "" }],
//     },
//   ],
// };

// const ageOptions = [
//   { value: "6-12", label: "6-12 years" },
//   { value: "13-16", label: "13-16 years" },
//   { value: "17-19", label: "17-19 years" },
//   { value: "20+", label: "20+ years" },
// ];
// interface ProductImage {
//   imageSrc: string;
// }

// interface ProductVideo {
//   videoSrc: string;
// }

// interface DescriptionList {
//   description: string;
// }

// interface ProductDescription {
//   label: string;
//   descriptionList: DescriptionList[];
// }

// interface FormValues {
//   productTitle: string;
//   productCategory: string;
//   productSummary: string;
//   minAge: number | undefined;
//   maxAge: number | undefined;
//   ageFilter: string;
//   rating: string;
//   paperEditionPrice: number | undefined;
//   printablePrice: number | undefined;
//   productImages: ProductImage[];
//   productVideos: ProductVideo[];
//   productDescriptions: ProductDescription[];
// }

// const AddSku = () => {
//   const navigate = useNavigate();
//   const { getToken } = useAuth();

//   const handleSubmit = async (values: FormValues) => {
//     const token = await getToken();
//     try {
//       //upload image files here
//       const uploadImageFiles = async (files: File[]) => {
//         console.log("Uploading image files", files);
//         console.log("token", token);
//         const uploadedUrls = [];

//         for (const file of files) {
//           console.log("file", file);
//           const formData = new FormData();
//           formData.append("file", file);
//           console.log("formdata", formData);
//           const response = await fetch(
//             "https://api.mentoons.com/api/v1/upload/file",

//             {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//               body: formData,
//             }
//           );

//           if (!response.ok) {
//             throw new Error(`Failed to upload file`);
//           }

//           const data = await response.json();
//           uploadedUrls.push(data?.data?.imageUrl);
//         }
//         return uploadedUrls;
//       };
//       // upload video files here
//       const uploadVideoFiles = async (files: File[]) => {
//         console.log("Uploading video files", files);
//         console.log("token", token);
//         const uploadedUrls = [];
//         for (const file of files) {
//           const formData = new FormData();
//           formData.append("file", file);
//           const response = await fetch(
//             "https://api.mentoons.com/api/v1/upload/file",
//             {
//               method: "POST",
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//               body: formData,
//             }
//           );

//           if (!response.ok) {
//             throw new Error(`Failed to upload file`);
//           }

//           const data = await response.json();
//           uploadedUrls.push(data?.data?.imageUrl);
//         }
//         return uploadedUrls;
//       };

//       const uploadedImages = await uploadImageFiles(
//         values.productImages.map((img) => img.imageSrc as unknown as File)
//       );
//       const uploadedVideos = await uploadVideoFiles(
//         values.productVideos.map((vid) => vid.videoSrc as unknown as File)
//       );

//       // Update the values with the uploaded URLs
//       values.productImages = values.productImages.map((img, index) => ({
//         ...img,
//         imageSrc: uploadedImages[index],
//       }));
//       values.productVideos = values.productVideos.map((vid, index) => ({
//         ...vid,
//         videoSrc: uploadedVideos[index],
//       }));

//       console.log("Form Values:", values);

//       const response = await fetch(
//         "https://api.mentoons.com/api/v1/sku",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(values),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log("New Product:", data);
//         successToast("Product added successfully");
//         navigate("/all-sku");
//       } else {
//         throw new Error();
//       }
//     } catch (error) {
//       console.error("Error saving product:", error);
//     }
//   };
//   return (
//     <Card className="w-full mx-auto max-w-8xl">
//       <CardHeader>
//         <CardTitle>Add SKU </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Formik
//           initialValues={initialValues}
//           // validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//           // validateOnBlur={true}
//           // validateOnChange={true}
//         >
//           {({ values, isSubmitting, setFieldValue }) => (
//             <Form className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="productTitle" className="block mb-2">
//                     Product Title
//                   </label>
//                   <Field
//                     name="productTitle"
//                     as={Input}
//                     placeholder="Enter card title"
//                     className="w-full"
//                   />
//                   <ErrorMessage
//                     name="productTitle"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="productSummary" className="block mb-2">
//                     Product Summary
//                   </label>
//                   <Field
//                     name="productSummary"
//                     as={Input}
//                     placeholder="Enter card summary"
//                     className="w-full"
//                   />
//                   <ErrorMessage
//                     name="productSummary"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>
//               </div>

//               {/* Age Fields */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="minAge" className="block mb-2">
//                     Minimum Age
//                   </label>
//                   <Field
//                     name="minAge"
//                     as={Input}
//                     type="number"
//                     placeholder="Enter minimum age"
//                     className="w-full"
//                   />
//                   <ErrorMessage
//                     name="minAge"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="maxAge" className="block mb-2">
//                     Maximum Age
//                   </label>
//                   <Field
//                     name="maxAge"
//                     as={Input}
//                     type="number"
//                     placeholder="Enter maximum age"
//                     className="w-full"
//                   />
//                   <ErrorMessage
//                     name="maxAge"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>
//               </div>
//               {/* Age Filter */}
//               <div>
//                 <label htmlFor="ageFilter" className="block mb-2">
//                   Age Filter
//                 </label>
//                 <Field
//                   name="ageFilter"
//                   as={Select}
//                   onValueChange={(value: string) =>
//                     setFieldValue("ageFilter", value)
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select age filter" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {ageOptions.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Field>
//               </div>
//               {/* Pricing Fields */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="paperEditionPrice" className="block mb-2">
//                     Paper Edition Price
//                   </label>
//                   <Field
//                     name="paperEditionPrice"
//                     as={Input}
//                     type="number"
//                     placeholder="Enter price"
//                     className="w-full"
//                   />
//                   <ErrorMessage
//                     name="paperEditionPrice"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="printablePrice" className="block mb-2">
//                     Printable Price
//                   </label>
//                   <Field
//                     name="printablePrice"
//                     as={Input}
//                     type="number"
//                     placeholder="Enter price"
//                     className="w-full"
//                   />
//                   <ErrorMessage
//                     name="printablePrice"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>
//               </div>

//               {/* Rating and Category Fields */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="rating" className="block mb-2">
//                     Rating
//                   </label>
//                   <Field
//                     name="rating"
//                     as={Input}
//                     placeholder="Enter rating"
//                     className="w-full"
//                   />
//                   <ErrorMessage
//                     name="rating"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="productCategory" className="block mb-2">
//                     Product Category
//                   </label>
//                   <Field
//                     name="productCategory"
//                     as={Select}
//                     onValueChange={(value: string) =>
//                       setFieldValue("productCategory", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="conversation-starter-card">
//                         Conversation Starter Card
//                       </SelectItem>
//                       <SelectItem value="story-re-teller-card">
//                         Story Re-teller Card
//                       </SelectItem>
//                       <SelectItem value="silent-stories">
//                         Silent Stories
//                       </SelectItem>
//                       <SelectItem value="colouring-books">
//                         Colouring Books
//                       </SelectItem>
//                     </SelectContent>
//                   </Field>
//                   <ErrorMessage
//                     name="productCategory"
//                     component="div"
//                     className="mt-1 text-sm text-red-500"
//                   />
//                 </div>
//               </div>
//               {/* Dynamic Card Images */}
//               <FieldArray name="productImages">
//                 {({ remove, push }) => (
//                   <div>
//                     <label className="block mb-2">Product Images</label>
//                     {values.productImages.map((_, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center mb-2 space-x-2"
//                       >
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={(event) => {
//                             const file = event.currentTarget.files?.[0];
//                             if (file) {
//                               setFieldValue(
//                                 `productImages.${index}.imageSrc`,
//                                 file
//                               );
//                             }
//                           }}
//                           className="flex-grow"
//                         />
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           onClick={() => {
//                             // Ensure at least one image field remains
//                             if (values.productImages.length > 1) {
//                               remove(index);
//                             } else {
//                               // If it's the last field, just clear it
//                               setFieldValue(
//                                 `productImages.${index}.imageSrc`,
//                                 ""
//                               );
//                             }
//                           }}
//                         >
//                           Remove
//                         </Button>
//                       </div>
//                     ))}
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => push({ imageSrc: "" })}
//                     >
//                       Add Image
//                     </Button>
//                   </div>
//                 )}
//               </FieldArray>

//               {/* Dynamic Card Videos */}
//               <FieldArray name="productVideos">
//                 {({ remove, push }) => (
//                   <div>
//                     <label className="block mb-2">Product Videos</label>
//                     {values.productVideos.map((_, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center mb-2 space-x-2"
//                       >
//                         <input
//                           type="file"
//                           accept="video/*"
//                           onChange={(event) => {
//                             const file = event.currentTarget.files?.[0];
//                             if (file) {
//                               setFieldValue(
//                                 `productVideos.${index}.videoSrc`,
//                                 file
//                               );
//                             }
//                           }}
//                           className="flex-grow"
//                         />
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           onClick={() => {
//                             // Ensure at least one video field remains
//                             if (values.productVideos.length > 1) {
//                               remove(index);
//                             } else {
//                               // If it's the last field, just clear it
//                               setFieldValue(
//                                 `productVideos.${index}.videoSrc`,
//                                 ""
//                               );
//                             }
//                           }}
//                         >
//                           Remove
//                         </Button>
//                       </div>
//                     ))}
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => push({ videoSrc: "" })}
//                     >
//                       Add Video
//                     </Button>
//                   </div>
//                 )}
//               </FieldArray>

//               {/* Dynamic Card Description */}
//               <FieldArray name="productDescriptions">
//                 {({ remove, push }) => (
//                   <div>
//                     <label className="block mb-2">Product Description</label>
//                     {values.productDescriptions.map((desc, descIndex) => (
//                       <div
//                         key={descIndex}
//                         className="p-4 mb-4 space-y-2 border rounded"
//                       >
//                         <div>
//                           <label
//                             htmlFor={`productDescriptions.${descIndex}.label`}
//                             className="block mb-2"
//                           >
//                             Description Label
//                           </label>
//                           <Field
//                             name={`productDescriptions.${descIndex}.label`}
//                             as={Input}
//                             placeholder="Enter description label"
//                             className="w-full"
//                           />
//                         </div>

//                         <FieldArray
//                           name={`productDescriptions.${descIndex}.descriptionList`}
//                         >
//                           {({ remove: removeDesc, push: pushDesc }) => (
//                             <div>
//                               {desc.descriptionList.map((_, listIndex) => (
//                                 <div
//                                   key={listIndex}
//                                   className="flex items-center mb-2 space-x-2"
//                                 >
//                                   <Field
//                                     name={`productDescriptions.${descIndex}.descriptionList.${listIndex}.description`}
//                                     as={Input}
//                                     placeholder="Enter description"
//                                     className="flex-grow"
//                                   />
//                                   <Button
//                                     type="button"
//                                     variant="destructive"
//                                     onClick={() => {
//                                       // Ensure at least one description field remains
//                                       if (desc.descriptionList.length > 1) {
//                                         removeDesc(listIndex);
//                                       } else {
//                                         // If it's the last field, just clear it
//                                         setFieldValue(
//                                           `productDescriptions.${descIndex}.descriptionList.${listIndex}.description`,
//                                           ""
//                                         );
//                                       }
//                                     }}
//                                   >
//                                     Remove
//                                   </Button>
//                                 </div>
//                               ))}
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => pushDesc({ description: "" })}
//                               >
//                                 Add Description
//                               </Button>
//                             </div>
//                           )}
//                         </FieldArray>

//                         {values.productDescriptions.length > 1 && (
//                           <Button
//                             type="button"
//                             variant="destructive"
//                             onClick={() => remove(descIndex)}
//                           >
//                             Remove Description Section
//                           </Button>
//                         )}
//                       </div>
//                     ))}
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() =>
//                         push({
//                           label: "",
//                           descriptionList: [{ description: "" }],
//                         })
//                       }
//                     >
//                       Add Description Section
//                     </Button>
//                   </div>
//                 )}
//               </FieldArray>

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 className="w-full bg-red-500 "
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </Button>
//             </Form>
//           )}
//         </Formik>
//       </CardContent>
//     </Card>
//   );
// };

// export default AddSku;
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

// import React from "react";
import { useForm } from "react-hook-form";

import { useLocation } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toastResposnse";
import ImageUpload from "./ImageUpload";
import ProductTypeFields from "./ProductTypeFields";
import VideoUpload from "./VideoUpload";
const AddProduct = () => {
  const [products, setProducts] = useState<ProductBase[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductBase | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const { state } = location;

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const productType = watch("type");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [search, setSearch] = useState("");
  // const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [total, setTotal] = useState(0);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(
          `https://mentoons-backend-zlx3.onrender.com/api/v1/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data);
        // setTotal(response.data.length);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [getToken]);

  const onSubmit = async (data: Record<string, any>) => {
    try {
      if (isEditing && selectedProduct) {
        //update the product
        setLoading(true);
        const response = await axios.put(
          `https://mentoons-backend-zlx3.onrender.com/api/v1/products/${selectedProduct?._id}`,
          data
        );
        //show toast
        if (response.status === 200) {
          successToast("Product updated successfully");
        }
      } else {
        //create the product
        const response = await axios.post(
          `https://mentoons-backend-zlx3.onrender.com/api/v1/products`,
          data
        );
        //show toast
        if (response.status === 201) {
          successToast("Product created successfully");
        }
      }
      reset();
      setIsEditing(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while saving the product.");
      errorToast("An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: ProductBase) => {
    if (!product) return;
    setSelectedProduct(product);
    setIsEditing(true);
    reset(product);
  };

  useEffect(() => {
    if (state?.product) {
      setSelectedProduct(state.product);
      setIsEditing(true);
      reset(state.product);
    }
  }, [state, reset]);

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      const response = await axios.delete(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/products/${id}`
      );

      console.log("Product deleted successfully");
      if (response.status === 200) {
        successToast("Product deleted successfully");
      }
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      errorToast("Error deleting product");
    }
  };

  // const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   // dispatch(fetchProducts({ search: value }));

  //   try {
  //     const token = await getToken();
  //     const response = await axios.get(
  //       `http://localhost:4000/api/v1/products?search=${value}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     setProducts(response.data);
  //     setCurrentPage(1);
  //     setSearch(value);
  //   } catch (error) {
  //     console.error("Error searching products:", error);
  //   }
  // };
  // const handleFilterChange = async (
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   try {
  //     const token = await getToken();
  //     const response = await axios.get(
  //       `http://localhost:4000/api/v1/products?${name}=${value}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     setProducts(response.data);
  //     setCurrentPage(1);
  //     setType(value);
  //   } catch (error) {
  //     console.error("Error fetching filtered products:", error);
  //   }
  // };
  // const handlePageChange = async (page: number) => {
  //   try {
  //     setLoading(true);
  //     const token = await getToken();
  //     const response = await axios.get(
  //       `http://localhost:4000/api/v1/products?page=${page}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log(response.data);
  //     setLoading(false);
  //     setCurrentPage(page);
  //     setProducts(response.data);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // };

  const handleImageUpload = (urls: string | string[]) => {
    if (typeof urls === "string") {
      setValue("productImage", [urls]); // Convert single string to array
    } else if (urls.length) {
      setValue("productImage", urls); // Handle array case
    }
  };

  const handleVideoUpload = (urls: string | string[]) => {
    if (typeof urls === "string") {
      setValue("productVideo", [urls]); // Convert single string to array
    } else if (urls.length) {
      setValue("productVideo", urls); // Handle array case
    }
  };
  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Product Management</h1>
      {error && (
        <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      {/* Search and Filter
      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
          className="p-2 border rounded"
        />
        <select
          name="type"
          value={type || ""}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="COMIC">Comic</option>
          <option value="AUDIO_COMIC">Audio Comic</option>
          <option value="PODCAST">Podcast</option>
          <option value="WORKSHOP">Workshop</option>
          <option value="ASSESSMENT">Assessment</option>
          <option value="SELF_HELP_CARD">Mentoons Cards</option>
        </select>
        <select
          name="ageCategory"
          value={
            type && typeof type === "string"
              ? AgeCategory[type as keyof typeof AgeCategory] || ""
              : ""
          }
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Ages</option>
          {Object.entries(AgeCategory).map(([key, value]) => (
            <option key={key} value={value}>
              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div> */}

      {/* Product Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
        {/* Basic Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              {...register("title", { required: true })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              {...register("price", { required: true, min: 0 })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Original Product Source</label>
            <input
              {...register("orignalProductSrc")}
              className="w-full p-2 border rounded"
              placeholder="Enter source URL"
            />
          </div>

          <div>
            <label className="block mb-1">Product Type</label>
            <select
              {...register("type", { required: true })}
              className="w-full p-2 border rounded"
            >
              <option value="comic">Comic</option>
              <option value="audio comic">Audio Comic</option>
              <option value="podcast">Podcast</option>
              <option value="assessment">Assessment</option>
              <option value="mentoons card">Mentoons Cards</option>
              <option value="mentoons books">Mentoons Books</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Age Category</label>
            <select
              {...register("ageCategory", { required: true })}
              className="w-full p-2 border rounded"
            >
              <option value="6-12">Children</option>
              <option value="13-16">Teen</option>
              <option value="17-19">Young Adult</option>
              <option value="20+">Adult</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              {...register("rating")}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Product Level</label>
            <select
              {...register("product_type")}
              className="w-full p-2 border rounded"
            >
              <option value="Free">Free</option>
              <option value="Prime">Prime</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Featured Product</label>
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="w-4 h-4 mt-2"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Description</label>
            <textarea
              {...register("description", { required: true })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Tags</label>
            <input
              {...register("tags", {
                setValueAs: (value: any) =>
                  typeof value === "string"
                    ? value
                        .split(",")
                        .map((tag: string) => tag.trim())
                        .filter((tag: string) => tag !== "")
                    : [],
              })}
              className="w-full p-2 border rounded"
              placeholder="Enter tags separated by commas"
            />
          </div>
        </div>
        <div className="flex items-center justify-start gap-4 mt-4">
          {/* Image Upload */}
          <ImageUpload onImageUpload={handleImageUpload} multiple />
          <VideoUpload onVideoUpload={handleVideoUpload} multiple />
        </div>
        {/* Dynamic Fields based on Product Type */}
        <ProductTypeFields type={productType} register={register} />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Products List */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 &&
              products.map((product) => (
                <div key={product._id} className="p-4 border rounded">
                  <h2 className="text-xl font-bold">
                    {product.title ?? "Untitled Product"}
                  </h2>
                  <p className="text-gray-600">
                    {product.description ?? "No description available."}
                  </p>
                  <p className="mt-2 text-lg font-bold">
                    ₹
                    {product.price >= 0 ? product.price : "Price not available"}
                  </p>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product?._id)}
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.ceil(total / 10) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div> */}
        </>
      )}
    </div>
  );
};

export default AddProduct;
