import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CourseInfoCard from "./CourseInfoCard";
// import { motion, AnimatePresence } from "framer-motion";
import "./css/CourseCard.css";
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function CourseSlider(props) {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const { courses } = props;
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
        <div key={index}>
          {/* <AnimatePresence> */}
          <div
            onClick={() => handleCardClick(index)}
            className={
              "sliderCard card card-container"
              // (expandedIndex === index ? " expanded" : "")
            }
          >
            <img
              src={course.image}
              alt={"COURSE NAME"}
              width="100%"
              className={"sliderCardImage"}
            />
            <h3 >
              {course}
            </h3>

            <CourseInfoCard
              courseId={course}
              isShown={expandedIndex === index}
            />
          </div>
          {/* </AnimatePresence> */}
        </div>
      ))}
    </Carousel>
  );
}
