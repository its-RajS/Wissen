"use client";
import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible, AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { ILogin } from "../../@types/components/login";
import { style } from "../../styles/style";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email !").required("Required"),
  password: Yup.string().required("Required").min(6),
});

const Login: FC<ILogin> = ({ setRoute }) => {
  const [show, setShow] = useState(false); //* To see the password

  //* Form validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: ({ email, password }) => {
      console.log(email, password);
    },
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik; //* Form validation
  return (
    <div className="w-full">
      <h1 className={`${style.title}`}>Login with Wissen</h1>
      <form onSubmit={handleSubmit}>
        <div className="w-full relative ">
          <label htmlFor="email" className={`${style.label}`}>
            Email
          </label>
          <input
            className={`${style.input} ${
              errors.email && touched.email ? "border-red-500" : ""
            }`}
            type="email"
            id="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={values.email}
          />
          {errors.email && touched.email ? (
            <span className="text-red-500 text-sm block pt-2">
              {errors.email}
            </span>
          ) : null}
        </div>
        <div className="w-full relative mt-5 mb-1 ">
          <label htmlFor="password" className={`${style.label}`}>
            Password
          </label>
          <input
            className={`${style.input} ${
              errors.password && touched.password ? "border-red-500" : ""
            }`}
            type={show ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={values.password}
          />
          {show ? (
            <AiFillEye
              className="absolute bottom-3 right-3 cursor-pointer z-1 "
              onClick={() => setShow(!show)}
              size={18}
            />
          ) : (
            <AiFillEyeInvisible
              className="absolute bottom-3 right-3 cursor-pointer z-1 "
              size={18}
              onClick={() => setShow(!show)}
            />
          )}
        </div>
        {errors.password && touched.password ? (
          <span className="text-red-500 text-sm block pt-2">
            {errors.password}
          </span>
        ) : null}
        <div className="w-full mt-5">
          <button
            className={`${style.button} bg-blue-500 `}
            type="submit"
            value="Login"
          >
            Login
          </button>
        </div>
        <br />
        <h5 className="text-center pt-2 font-Poppins text-[14px] ">
          Or join with
        </h5>
        <div className="flex justify-center items-center my-4">
          <FcGoogle size={25} className="cursor-pointer mr-2 " />
          <AiFillGithub size={25} className="cursor-pointer ml-2" />
        </div>
        <h5 className="text-center font-Poppins pt-4 text-[14px] ">
          Don't have an account?{" "}
          <span
            className="text-blue-400 pl-1 cursor-pointer "
            onClick={() => setRoute("SignUp")}
          >
            Sign up
          </span>
        </h5>
      </form>
    </div>
  );
};

export default Login;
