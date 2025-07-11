"use client";
import React, { FC } from "react";
import Heading from "./utils/Heading.utils";

interface Props {}

const Page: FC<Props> = (props) => {
  return (
    <div>
      <Heading
        title="Wissen"
        description="Wissen is a platform that connects teachers and students"
        keywords="Learing, Courses, Education, Teachers, Students, Knowledge, Skill, Development"
      />
    </div>
  );
};

export default Page;
