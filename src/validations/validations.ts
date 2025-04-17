import * as Yup from "yup";

export const signInValidation = Yup.object({
  emailOrPhone: Yup.string()
    .test(
      "email-or-phone",
      "Enter a valid email or 10-digit phone number",
      (value) => {
        const val = value || "";
        return /\S+@\S+\.\S+/.test(val) || /^[0-9]{10}$/.test(val);
      }
    )
    .required("Email or Phone Number is Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const initialValues = {
  emailOrPhone: "",
  password: "",
};
