// import { SignIn } from "@clerk/clerk-react";
import Signin from "../../components/dashboard/signIn";

const LogIn = () => {
  return (
    <section className="flex justify-center items-center bg-[#F7941D] min-h-screen p-10 overflow-hidden">
      <div className="flex flex-col justify-center items-center sm:gap-2">
        <img
          src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
          alt="mentoons-icon"
          className="w-32"
        />
        <h1 className="poppins font-medium text-xl sm:text-4xl">Admin Login</h1>
        <Signin />
      </div>
    </section>
  );
};

export default LogIn;
