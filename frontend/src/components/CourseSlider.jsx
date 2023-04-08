import React, { useContext, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CoursePreviewCard from "./CoursePreviewCard";
// import { motion, AnimatePresence } from "framer-motion";
import "./css/CourseCard.css";
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1200 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1200, min: 600 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
  },
};

export default function CourseSlider(props) {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const { courses, ...cardProps } = props;
  const handleCardClick = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(-1);
    } else {
      setExpandedIndex(index);
    }
  };
  return (
    <Carousel responsive={responsive} itemWidth={300}>
      {courses.map((course, index) => (
        <div key={index} style={{ width: "100%" }}>
          <div
            onClick={() => handleCardClick(index)}
            className={"sliderCard card card-container"}
          >
            <CoursePreviewCard courseId={course} {...cardProps} />
          </div>
        </div>
      ))}
    </Carousel>
  );
}
