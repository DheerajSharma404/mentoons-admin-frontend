import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signInValidation, initialValues } from "../../validations/validations";

const Signin = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: signInValidation,
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      setTimeout(() => {
        navigate("/dashboard");
        setSubmitting(false);
      }, 1000);
    },
  });

  return (
    <div className="rounded-xl flex flex-col justify-center items-center gap-6 w-full max-w-md p-6 bg-white poppins mt-5 shadow-lg sm:p-8">
      <h1 className="font-medium text-3xl text-center text-[#333]">Sign in</h1>

      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col gap-5"
      >
        <div className="w-full">
          <label
            htmlFor="emailOrPhone"
            className="text-sm font-medium text-[#666]"
          >
            Email or mobile phone number
          </label>
          <input
            id="emailOrPhone"
            type="text"
            placeholder="Enter email or phone"
            className="w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none border border-gray-300 mt-2 text-sm"
            {...formik.getFieldProps("emailOrPhone")}
          />
          {formik.touched.emailOrPhone && formik.errors.emailOrPhone && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.emailOrPhone}
            </p>
          )}
        </div>

        <div className="w-full">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#666]"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer text-gray-600/80 text-sm"
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
              {isPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>

          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Enter password"
            className="w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none border border-gray-300 mt-2 text-sm"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full rounded-full bg-blue-600 hover:bg-blue-700 p-3 text-white cursor-pointer transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 w-full text-sm mt-2">
        <Link to="#" className="text-blue-600 hover:underline">
          Forget your password?
        </Link>
      </div>
    </div>
  );
};

export default Signin;
