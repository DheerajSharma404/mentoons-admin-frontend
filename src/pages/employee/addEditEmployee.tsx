import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  MapPin,
  Save,
  X,
  Loader2,
  Upload,
} from "lucide-react";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetEmployeeByIdQuery,
} from "../../features/employee/employee";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRupeeSign } from "react-icons/fa";

interface AddressFormData {
  houseName: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
}

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  isActive: boolean;
  salary: number;
  place: AddressFormData;
  profilePicture: string;
}

const initialFormData: EmployeeFormData = {
  name: "",
  email: "",
  phone: "",
  role: "",
  department: "",
  joinDate: new Date().toISOString().split("T")[0],
  isActive: true,
  salary: 0,
  place: {
    houseName: "",
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    country: "India",
  },
  profilePicture: "",
};

const roleOptions = [
  "psychologist",
  "marketing",
  "developer",
  "illustrator",
  "animator",
  "video editor",
];

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  role: Yup.string().required("Role is required"),
  salary: Yup.number()
    .positive("Salary must be greater than 0")
    .required("Salary is required"),
  place: Yup.object({
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string().required("Pincode is required"),
  }),
});

const AddEditEmployeePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const employeeId = queryParams.get("id");
  const isEditMode = !!employeeId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: employee, isLoading: isLoadingEmployee } =
    useGetEmployeeByIdQuery(employeeId!, { skip: !isEditMode });
  const employeeData = employee?.data;

  const [addEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  useEffect(() => {
    if (isEditMode && employeeData) {
      const formattedDate = new Date(employeeData.joinDate)
        .toISOString()
        .split("T")[0];

      formik.setValues({
        ...employeeData,
        joinDate: formattedDate,
      });

      if (employeeData.profilePicture) {
        setPreviewUrl(employeeData.profilePicture);
      }
    }
  }, [isEditMode, employeeData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    if (!profileImage) return null;

    const formData = new FormData();
    formData.append("file", profileImage);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const formik = useFormik<EmployeeFormData>({
    initialValues: initialFormData,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        let profilePictureUrl = values.profilePicture;

        if (profileImage) {
          const uploadedUrl = await handleFileUpload();
          if (uploadedUrl) {
            profilePictureUrl = uploadedUrl;
          }
        }

        const employeeData = {
          ...values,
          profilePicture: profilePictureUrl,
        };

        if (isEditMode) {
          await updateEmployee({ _id: employeeId!, ...employeeData }).unwrap();
        } else {
          await addEmployee(employeeData).unwrap();
        }

        navigate("/employees");
      } catch (error) {
        console.error("Failed to save employee:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const getFieldError = (fieldPath: string): string | undefined => {
    const path = fieldPath.split(".");
    let error: any = formik.errors;
    let touched: any = formik.touched;

    for (const segment of path) {
      if (!error || typeof error !== "object") return undefined;
      if (!touched || typeof touched !== "object") return undefined;

      error = error[segment];
      touched = touched[segment];
    }

    return touched && error ? error : undefined;
  };

  const isFieldTouched = (fieldPath: string): boolean => {
    const path = fieldPath.split(".");
    let touched: any = formik.touched;

    for (const segment of path) {
      if (!touched || typeof touched !== "object") return false;
      touched = touched[segment];
    }

    return !!touched;
  };

  if (isEditMode && isLoadingEmployee) {
    return (
      <div className="min-h-fit bg-gray-100 p-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="text-blue-600 mb-4"
          >
            <Loader2 size={48} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl font-semibold text-gray-800"
          >
            Loading Employee Data
          </motion.h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Employee" : "Add New Employee"}
          </h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Personal Information
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 border-2 border-gray-300 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
                    >
                      <Upload size={16} className="mr-2" />
                      Upload Photo
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG or GIF, max 2MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User size={16} className="inline mr-2" />
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 border rounded-md ${
                      formik.errors.name && formik.touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.errors.name && formik.touched.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail size={16} className="inline mr-2" />
                    Email Address*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 border rounded-md ${
                      formik.errors.email && formik.touched.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture URL (Alternative)
                  </label>
                  <input
                    type="text"
                    name="profilePicture"
                    value={formik.values.profilePicture}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only needed if not uploading a file directly
                  </p>
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-8">
                Employment Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Briefcase size={16} className="inline mr-2" />
                    Role*
                  </label>
                  <select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 border rounded-md ${
                      formik.errors.role && formik.touched.role
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Role</option>
                    {roleOptions.map((role, idx) => (
                      <option key={idx} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                  {formik.errors.role && formik.touched.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.role}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Building size={16} className="inline mr-2" />
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaRupeeSign size={16} className="inline mr-2" />
                    Salary*
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formik.values.salary}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 border rounded-md ${
                      formik.errors.salary && formik.touched.salary
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.errors.salary && formik.touched.salary && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.salary}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={16} className="inline mr-2" />
                    Join Date
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formik.values.joinDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active Employee
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                <MapPin size={16} className="inline mr-2" />
                Address Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    House/Building Name
                  </label>
                  <input
                    type="text"
                    name="place.houseName"
                    value={formik.values.place.houseName}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street
                  </label>
                  <input
                    type="text"
                    name="place.street"
                    value={formik.values.place.street}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    name="place.city"
                    value={formik.values.place.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 border rounded-md ${
                      getFieldError("place.city") &&
                      isFieldTouched("place.city")
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {getFieldError("place.city") &&
                    isFieldTouched("place.city") && (
                      <p className="text-red-500 text-sm mt-1">
                        {getFieldError("place.city")}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    name="place.district"
                    value={formik.values.place.district}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State*
                  </label>
                  <input
                    type="text"
                    name="place.state"
                    value={formik.values.place.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 border rounded-md ${
                      getFieldError("place.state") &&
                      isFieldTouched("place.state")
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {getFieldError("place.state") &&
                    isFieldTouched("place.state") && (
                      <p className="text-red-500 text-sm mt-1">
                        {getFieldError("place.state")}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode*
                  </label>
                  <input
                    type="text"
                    name="place.pincode"
                    value={formik.values.place.pincode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 border rounded-md ${
                      getFieldError("place.pincode") &&
                      isFieldTouched("place.pincode")
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {getFieldError("place.pincode") &&
                    isFieldTouched("place.pincode") && (
                      <p className="text-red-500 text-sm mt-1">
                        {getFieldError("place.pincode")}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="place.country"
                    value={formik.values.place.country}
                    onChange={formik.handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Defaults to "India" if left empty
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
            >
              <X size={18} className="mr-1" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formik.isValid}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${
                isSubmitting || !formik.isValid
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save size={18} className="mr-1" />
                  {isEditMode ? "Update Employee" : "Create Employee"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddEditEmployeePage;
