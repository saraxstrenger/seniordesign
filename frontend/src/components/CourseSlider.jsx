import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
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
  background: "#F7F5F3",
  padding: "10px",
//   border: "2px solid black",
  margin: "8px",
  borderRadius: "10px",
  filter: "drop-shadow(1px 1px 2px #2B4162)",
};

export default function CourseSlider(props) {
  const [flippedIndex, setFlippedIndex] = useState(-1);

  const { courses } = props;
  const handleCardClick = (index) => {
    if (flippedIndex === index) {
      setFlippedIndex(-1);
    } else {
      setFlippedIndex(index);
    }
  };
  return (
    <Carousel responsive={responsive} itemWidth={300} >
      {courses.map((course, index) => (
        <div key={index}>
          <ReactCardFlip
            isFlipped={flippedIndex === index}
            flipDirection="vertical"
            key={index}
            flipSpeedBackToFront={0.75}
            flipSpeedFrontToBack={0.75}
            width={"30%"}
          >
            <div
              className={`card card-container`}
              onClick={() => handleCardClick(index)}
              style={sliderCardStyle} // set background style on front of card
            >
              <img src={course.image} alt={course.name} width="100%" />
              <div style={{ marginTop: 10 }}>{course.name}</div>
            </div>
            <div
              className={`card card-container`}
              onClick={() => handleCardClick(index)}
              style={sliderCardStyle} // set background style on front of card
            >
              <div style={{ marginTop: 10 }}>Card Back</div>
            </div>
          </ReactCardFlip>
        </div>
      ))}
    </Carousel>
  );
}
