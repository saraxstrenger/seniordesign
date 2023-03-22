import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactCardFlip from "react-card-flip";

const courses = [
  { name: "Course 1", image: "/course1.jpg" },
  { name: "Course 2", image: "/course2.jpg" },
  { name: "Course 3", image: "/course3.jpg" },
  { name: "Course 4", image: "/course4.jpg" },
  { name: "Course 5", image: "/course5.jpg" },
];



const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "60px",
  swipeToSlide: true,
  draggable: true,
  swipe: true,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
  // add this CSS customization for the card height
  customHeight: {
    height: "400px",
    overflow: "hidden",
  },
  // add this CSS customization for the card background color
  cardStyle: {
    background: "pink",
  },
};



const sliderTitleStyle = {
  fontWeight: "bold",
  fontSize: "1.5rem",
  marginBottom: "1rem",
};

const sliderCardStyle = {
  background: "#E9EDDE",
  padding: "10px",
  border: "2px solid black",
  margin: "25px",
  borderRadius: "10px",
  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
};

function SliderComponent() {

  const [flippedIndex, setFlippedIndex] = React.useState(-1);
  
  const handleCardClick = (index) => {
    if (flippedIndex === index) {
      setFlippedIndex(-1);
    } else {
      setFlippedIndex(index);
    }
  };

  return (
    <Slider {...settings}>
      {courses.map((course, index) => (
        <div
          key={index}
          style={{ minWidth: 300, marginRight: 20, padding: 10 }}
        >
          <ReactCardFlip
            isFlipped={flippedIndex === index}
            flipDirection="vertical"
            key={index}
            flipSpeedBackToFront={0.75}
            flipSpeedFrontToBack={0.75}
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
      ))}{" "}
    </Slider>
  );
}

export default SliderComponent;
