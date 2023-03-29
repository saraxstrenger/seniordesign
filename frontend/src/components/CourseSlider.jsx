import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CourseInfoCard from "./CourseInfoCard";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const sliderCardStyle = {
  background: "#FFFFFF",
  padding: "10px",
  margin: "8px",
  borderRadius: "10px",
  border: "1px solid var(--card-border-color, #2B4162)",
  boxShadow: "1px 1px 1px var(--card-shadow-color, #2B4162)",
  transition: "all 0.5s ease-out",
  height: "70px", // initial height of the card
  overflow: "hidden",
};  

const sliderCardExpandedStyle = {
  ...sliderCardStyle,
  height: "370px", // expanded height of the card
  background: "#F5F5F5",
};

const sliderCardImageStyle = {
  borderRadius: "5px",
};

const sliderCardHoverStyle = {
  border: "2px solid #2B4162",
  boxShadow: "0px 4px 4px rgba(0,0,0,0.4)",
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
          <div
            className={`card card-container`}
            onClick={() => handleCardClick(index)}
            style={expandedIndex === index ? {...sliderCardExpandedStyle, ...sliderCardHoverStyle} : sliderCardStyle}
          >
            <img src={course.image} alt={course.name} width="100%" style={sliderCardImageStyle} />
            <div style={{ marginTop: 15, fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>{course.name}</div>
            {expandedIndex === index ? (
              <CourseInfoCard courseId={"CIS 1600"} />
            ) : null}
          </div>
        </div>
      ))}
    </Carousel>
  );
}