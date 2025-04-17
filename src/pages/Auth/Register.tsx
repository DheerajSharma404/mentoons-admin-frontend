import { SignUp } from "@clerk/clerk-react";

const Register = () => {
  return (
    <div className="h-screen flex  flex-col items-center justify-start">
      <div className=" flex  items-center justify-center">
        <img src="/assets/logo.png" alt="Mentoons Logo" className="w-[30%]" />
      </div>

      <SignUp signInUrl="/sign-in" />

    </div>
  );
};

export default Register;
