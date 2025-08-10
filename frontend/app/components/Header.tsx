"use client";
import React, { FC, useState, useEffect } from "react";
import { IHeader } from "../@types/components/header";
import Link from "next/link";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModel from "../utils/CustomModel";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import userDefault from "../../public/avatarDefault.png";

const Header: FC<IHeader> = ({
  activeItem,
  open,
  setOpen,
  setRoute,
  route,
}) => {
  const [active, setActive] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useSession();
  const [socialAuth, { isLoading, isSuccess, error }] = useSocialAuthMutation();

  useEffect(() => {
    if (!user) {
      if (data) {
        socialAuth({
          email: data.user?.email,
          name: data.user?.name,
          avatar: data.user?.image,
        });
      }
    }
    if (data !== null) {
      if (isSuccess) toast.success("Login Successfully");
    }

    if (error) toast.error("Error");
  }, [data, user, isSuccess, error]);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  console.log(data);

  const handleCloseSidebar = (e: any) => {
    if (e.target.id === "screen") setOpenSidebar(false);
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-black dark:to-gray-800 fixed top-0 left-0 w-full h-[80px] z-[80] border-b border-[#ffffff75] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow duration-500 "
        }`}
      >
        <div className="w-[95%] md:w-[90%] h-full m-auto py-2 ">
          <div className="flex items-center justify-between w-full h-[80px] ">
            {/* Logo */}
            <div className="py-4">
              <Link
                href={"/"}
                className={`text-2xl font-Poppins font-bold text-black dark:text-white`}
              >
                Wissen
              </Link>
            </div>
            {/* Navigation and Theme Switcher */}
            <div className="flex items-center space-x-4">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* //? Only for mobile screens */}
              <div className="md:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  onClick={() => setOpenSidebar(true)}
                  className="cursor-pointer dark:text-white text-black "
                />
              </div>
              {user ? (
                <Link href={"/profile"}>
                  <Image
                    src={user?.avatar ? user.avatar : userDefault}
                    alt={user?.name}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer hover:opacity-80"
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="hidden md:block cursor-pointer dark:text-white text-black "
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
        {/* //* Mobile SideBar */}
        {openSidebar && (
          <div
            className="h-screen w-[85%] fixed top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024] "
            onClick={handleCloseSidebar}
            id="screen"
          >
            <div className="h-screen w-[70%] fixed top-0 right-0 bg-white dark:bg-slate-900 dark:bg-opacity-90  ">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer dark:text-white text-black ml-5 mt-5 "
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              <p className="text-sm mt-20 px-2 pl-5 dark:text-white text-black ">
                Copyright &copy; 2025 Wissen
              </p>
            </div>
          </div>
        )}
      </div>
      {route === "Login" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
            />
          )}
        </>
      )}
      {route === "SignUp" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModel
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
