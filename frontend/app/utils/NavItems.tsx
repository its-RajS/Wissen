"use client";
import React, { FC } from "react";
import { INavItems } from "../@types/utils/navItems";
import Link from "next/link";

export const NavItemData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

const NavItems: FC<INavItems> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden md:flex">
        {NavItemData &&
          NavItemData.map((item, index) => (
            <Link href={item.url} key={index} passHref>
              <span
                className={`${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[crimson]"
                    : "dark:text-white text-black"
                } text-lg px-6 font-Poppins font-semibold `}
              >
                {item.name}
              </span>
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="md:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href={"/"} passHref>
              <span
                className={`text-lg font-Poppins font-bold text-black dark:text-white`}
              >
                Wissen
              </span>
            </Link>
          </div>
          {NavItemData &&
            NavItemData.map((item, index) => (
              <Link href={item.url} key={index} passHref>
                <span
                  className={`${
                    activeItem === index
                      ? "dark:text-[#37a39a] text-[crimson]"
                      : "dark:text-white text-black"
                  } block text-lg px-6 py-5 font-Poppins font-semibold `}
                >
                  {item.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};
export default NavItems;
