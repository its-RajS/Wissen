"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading.utils";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  return (
    <div>
      <Heading
        title="Wissen"
        description="Wissen is a platform that connects teachers and students"
        keywords="Learning, Courses, Education, Teachers, Students, Knowledge, Skill, Development"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} />
      <HeroSection />
    </div>
  );
};

export default Page;
