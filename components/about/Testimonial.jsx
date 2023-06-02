import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css"; 


const Testimonial = () => {
    var settings = {
        dots: false,
        arrow: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
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
            text: `Loïc is very easy and nice to work with! talented producer/songwriter. Hope to work with him again on other projects!`,
            avatar: "url(/img/testimonials/1.jpg)",
            name: "Wild Fox",
            publisher: "Topliner, Singer, writer",
            date: "2 months ago",
        },
        {
            id: 2,
            text: `Very fun working with Loïc. He knows exactly what he wants and together we made something awesome! He gave great feedback and was a very nice person. I hope to work together again!`,
            avatar: "url(/img/testimonials/2.jpg)",
            name: "Amelia Bushell",
            publisher: "Vocalist",
            date: "4 months ago",
        },
        {
            id: 3,
            text: `I had a great experience working with Loic! His production is well-elaborated, current and rich in sound! He is really supportive when working with artists, the communication is great and the whole process is exceptionally professional! Looking forward to working on more projects together!`,
            avatar: "url(/img/testimonials/3.jpg)",
            name: "Julaiah",
            publisher: "Topliner, Singer, writer",
            date: "about a year ago",
        },
        {
            id: 4,
            text: `Great producer even better collaborator 😎10 `,
            avatar: "url(/img/testimonials/16.jpg)",
            name: "Quincy Thompson",
            publisher: "Songwriter-Vocalist-Producer",
            date: "2 years ago",
        },
        {
            id: 5,
            text: `AMAZING, patient, and super professional <3`,
            avatar: "url(/img/testimonials/11.jpg)",
            name: "Britney Jayy",
            publisher: "Songwriter/Singer/ R&B lover",
            date: "2 years ago",
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
                                    <h3>{item.name}</h3>
                                    <span>{item.publisher}</span>
                                    <div>
                                        <span>{item.date}</span>
                                    </div>
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
