"use client";

import { Fragment } from "react";
import HeroSliderNine from "./HeroSliderNine";
import SectionTitleWithText from "./SectionTitleWithText";
import ShowCase from "./ShowCase";

const HomeFashion = () => {
  return (
    <Fragment>
      <HeroSliderNine />
      <SectionTitleWithText spaceTopClass="pt-[95px]" spaceBottomClass="pb-[90px]" />
      <ShowCase />
    </Fragment>
  );
};

export default HomeFashion;
