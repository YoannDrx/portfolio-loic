import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";

const Testimonial = () => {
  var settings = {
    dots: false,
    arrow: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const testimonialContent = [
    {
      id: 1,
      text: `Loïc is a gifted composer and a pleasure to work with. His unbridled passion permeates every note he plays. I highly recommend him!`,
      avatar: "url(/img/testimonials/mima.jpg)",
      firstName: "Marie",
      lastName: "Dupont",
      name: "Mima",
      publisher: "Music Publisher",
    },
    {
      id: 2,
      text: `Loïc's creative prowess is breathtaking. His compositions are unique, authentic and have that certain je ne sais quoi. A true pro!`,
      avatar: "url(/img/testimonials/gum.jpg)",
      firstName: "Pierre",
      lastName: "Leroy",
      name: "Gum",
      publisher: "Music Publisher",
    },
    {
      id: 3,
      text: `Loïc is a gifted composer and a consummate professional. He nailed our expectations and we were thrilled with our collaboration.`,
      avatar: "url(/img/testimonials/parigomusic.jpg)",
      firstName: "Sophie",
      lastName: "Martin",
      name: "Parigomusic",
      publisher: "Music Publisher",
    },
  ];

  return (
    <ul className="testimonila-slider-wrapper">
      <Slider {...settings} arrows={false}>
        {testimonialContent.map((item) => (
          <li key={item.id}>
            <div className="list_inner">
              <div className="text">
                <p>{item.text}</p>
              </div>
              <div className="details">
                <div className="image">
                  <div
                    className="main"
                    style={{
                      backgroundImage: item.avatar,
                    }}
                  />
                </div>
                <div className="info">
                  <h3>{item.name} ({item.firstName} {item.lastName})</h3>
                  <span>{item.publisher}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </Slider>
    </ul>
  );
};

export default Testimonial;