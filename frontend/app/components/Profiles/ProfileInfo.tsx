import Image from "next/image";
import React, { FC, useState } from "react";
import userDefault from "../../../public/avatarDefault.png";
import { AiOutlineCamera } from "react-icons/ai";

type Props = {
  user: any;
  avatar: string | null;
};

const ProfileInfo: FC<Props> = ({ user, avatar }) => {
  const [name, setName] = useState(user && user.name);
  const imageHandler = async (e: any) => {};
  const handleSubmit = async (e: any) => {};

  return (
    <>
      <div className="w-full flex justify-center ">
        <div className="relative">
          <Image
            src={
              user.avatar || avatar ? user.avatar.url || avatar : userDefault
            }
            alt="user_Image"
            className="w-[120px] h-[120px] cursor-pointer border-[3px] rounded-full border-[#34b6e4ab] "
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] dark:bg-slate-800 bg-white rounded-full bottom-2 absolute right-2 flex items-center justify-center cursor-pointer ">
              <AiOutlineCamera size={20} fill="#fff" className="z-1" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 md:pl-10 ">
        <form action=""></form>
      </div>
    </>
  );
};

export default ProfileInfo;
