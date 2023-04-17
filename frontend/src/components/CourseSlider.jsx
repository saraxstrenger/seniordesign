import React, { useContext, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { RecommendationsContext } from "../context";
import CoursePreviewCard from "./CoursePreviewCard";
import Chevron from "react-chevron";
import "./css/Buttons.css";
// import { motion, AnimatePresence } from "framer-motion";
import "./css/Card.css";
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
  const setFocusedCourse = useContext(RecommendationsContext).setFocusedCourse;

  const ButtonGroup = ({ next, previous, ...rest }) => {
    const {
      carouselState: { currentSlide, totalItems, slidesToShow },
    } = rest;
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          right: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "fit-content",
          }}
        >
          <div style={{ zIndex: 2 }}>
            {currentSlide > 0 && (
              <button className="btn-slider" onClick={() => previous()}>
                <Chevron direction="left" color="gray" />
              </button>
            )}
          </div>
          <div style={{ zIndex: 2 }}>
            {currentSlide < totalItems - slidesToShow && (
              <button className="btn-slider" onClick={() => next()}>
                <div style={{ marginLeft: 5 }}>
                  <Chevron direction="right" color="gray" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Carousel
      responsive={responsive}
      itemWidth={300}
      arrows={false}
      customButtonGroup={<ButtonGroup />}
    >
      {courses.map((course, index) => (
        <CoursePreviewCard courseId={course} {...cardProps} key={index} />
      ))}
    </Carousel>
  );
}
