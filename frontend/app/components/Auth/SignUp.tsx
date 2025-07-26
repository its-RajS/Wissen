"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible, AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { style } from "../../styles/style";
import { ISignUp } from "../../@types/components/signUp";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

const schema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email !").required("Required"),
  password: Yup.string().required("Required").min(6),
});

const SignUp: FC<ISignUp> = ({ setRoute }) => {
  const [show, setShow] = useState(false); //* To see the password

  //? Redux
  const [register, { data, isLoading, isSuccess, isError, error }] =
    useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data.message || "Registration successfull";
      toast.success(message);
      setRoute("Verification");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  //* Form validation
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = { name, email, password };
      await register(data);
    },
  });

  const { handleSubmit, handleChange, values, errors, touched } = formik; //* Form validation
  return (
    <div className="w-full">
      <h1 className={`${style.title}`}>Join Wissen</h1>
      <form onSubmit={handleSubmit}>
        <div className="w-full relative ">
          <label htmlFor="name" className={style.label}>
            Name
          </label>
          <input
            className={`${style.input} ${
              errors.name && touched.name ? "border-red-500" : ""
            }`}
            type="text"
            id="name"
            placeholder="Enter your name"
            onChange={handleChange}
            value={values.name}
          />
          {errors.name && touched.name ? (
            <span className="text-red-500 text-sm block pt-2">
              {errors.name}
            </span>
          ) : null}
        </div>
        <div className="w-full relative mt-5 mb-1">
          <label htmlFor="email" className={style.label}>
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
          <label htmlFor="password" className={style.label}>
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
          {isLoading ? (
            <button className={`${style.button} bg-gray-500 `} type="button">
              Loading...
            </button>
          ) : (
            <button
              className={`${style.button} bg-blue-500 `}
              type="submit"
              value="SignUp"
            >
              Sign Up
            </button>
          )}
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
          Already have an account?{" "}
          <span
            className="text-blue-400 pl-1 cursor-pointer "
            onClick={() => setRoute("Login")}
          >
            Login
          </span>
        </h5>
      </form>
    </div>
  );
};

export default SignUp;
