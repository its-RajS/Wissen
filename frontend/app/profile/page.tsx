"use client";
import React, { FC, useState } from "react";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading.utils";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import Profile from "../components/Profiles/Profile";

const page = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login"); //?initial for the PopUp
  const { user } = useSelector((state: any) => state.auth);
  return (
    <div>
      <Protected>
        <Heading
          title={`${user?.name}'s Profile`}
          description="Wissen is a platform that connects teachers and students"
          keywords="Learning, Courses, Education, Teachers, Students, Knowledge, Skill, Development"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
      </Protected>
    </div>
  );
};

export default page;
