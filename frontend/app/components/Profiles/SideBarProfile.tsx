import { ISideBar } from "@/app/@types/components/profile";
import Image from "next/image";
import React, { FC } from "react";
import userDefault from "../../../public/avatarDefault.png";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";

const SideBarProfile: FC<ISideBar> = ({
  user,
  active,
  setActive,
  avatar,
  logoutHandler,
}) => {
  return (
    <div className="w-full ">
      <div
        className={` w-full flex items-center cursor-pointer px-3 py-4 ${
          active === 1 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        } `}
        onClick={() => setActive(1)}
      >
        <Image
          src={user.avatar || avatar ? user.avatar || avatar : userDefault}
          alt=""
          className="w-[20px] h-[20px] md:w-[30px] md:h-[30px] cursor-pointer rounded-full "
        />
        <h5 className="pl-2 md:block hiidden font-Poppins dark:text-white text-black ">
          My Account
        </h5>
      </div>
      <div
        className={` w-full flex items-center cursor-pointer px-3 py-4 ${
          active === 2 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        } `}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} fill="#fff" />
        <h5 className="pl-2 md:block hiidden font-Poppins dark:text-white text-black ">
          Change Password
        </h5>
      </div>
      <div
        className={` w-full flex items-center cursor-pointer px-3 py-4 ${
          active === 3 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        } `}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} fill="#fff" />
        <h5 className="pl-2 md:block hiidden font-Poppins dark:text-white text-black ">
          Enrolled Courses
        </h5>
      </div>
      <div
        className={` w-full flex items-center cursor-pointer px-3 py-4 ${
          active === 4 ? "dark:bg-slate-800 bg-white" : "bg-transparent"
        } `}
        onClick={() => logoutHandler()}
      >
        <AiOutlineLogout size={20} fill="#fff" />
        <h5 className="pl-2 md:block hiidden font-Poppins dark:text-white text-black ">
          Logout
        </h5>
      </div>
    </div>
  );
};

export default SideBarProfile;
