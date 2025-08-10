import type { IProfile } from "@/app/@types/components/profile";
import React, { FC, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import ProfileInfo from "./ProfileInfo";

const Profile: FC<IProfile> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [logout, setLogout] = useState(false);

  //? Redux
  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const logoutHandler = async () => {
    await signOut();
    setLogout(true);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  return (
    <div className="w-[85%] mx-auto pt-5 ">
      <div
        className={`w-[60px] h-[450px] md:w-[310px] dark:bg-slate-900 bg-white bg-opacity-90 border dark:border-[#ffffff1d] border-[#ffffff05]  rounded-[5px] shadow-lg dark:shadow-sm mt-[80px] mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px] `}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logoutHandler}
        />
      </div>
      {active === 1 && (
        <div className="w-full h-full bg-transparent ">
          <ProfileInfo user={user} avatar={avatar} />
        </div>
      )}
    </div>
  );
};

export default Profile;
