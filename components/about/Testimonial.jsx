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
            text: `Incredibly fast as always...Looking forward to the next time!`,
            avatar: "url(/img/testimonials/4.jpg)",
            name: "Julien Ho-Tong",
            publisher: "Musician, Producer",
            date: "about a year ago",
        },
        {
            id: 5,
            text: `Very professional, thank you for your fast and rigorous work `,
            avatar: "url(/img/testimonials/mima.jpg)",
            name: "Kaz N.",
            publisher: "Musician",
            date: "about a year ago",
        },
        {
            id: 6,
            text: `Always a pleasure to work with Loïc. This’s my second project with him (the quality, communication...) are always part of our journey. Highly recommended 🔥!`,
            avatar: "url(/img/testimonials/parigomusic.jpg)",
            name: "Rex L",
            publisher: "Songwriter",
            date: "about a year ago",
        },
        {
            id: 7,
            text: `3rd time I've been working With Loïc, he is an incredible mixing and mastering engineer. Thank you so much!`,
            avatar: "url(/img/testimonials/4.jpg)",
            name: "Julien Ho-Tong",
            publisher: "Musician, Producer",
            date: "about a year ago",
        },
        {
            id: 8,
            text: `Loïc is an amazing mixing and mastering engineer. He's the fastest guy around here. Thank you so much dude!`,
            avatar: "url(/img/testimonials/4.jpg)",
            name: "Julien Ho-Tong",
            publisher: "Musician, Producer",
            date: "about a year ago",
        },
        {
            id: 9,
            text: `I just finished a project with Loïc and his way of doing things is just impressive, (talent, professional, work gives on time) in short, this is my first project and i can’t wait for the next one with him. Merci loïc🙏`,
            avatar: "url(/img/testimonials/parigomusic.jpg)",
            name: "Rex L",
            publisher: "Songwriter",
            date: "about a year ago",
        },
        {
            id: 10,
            text: `Great producer even better collaborator 😎10 `,
            avatar: "url(/img/testimonials/4.jpg)",
            name: "Quincy Thompson",
            publisher: "Songwriter-Vocalist-Producer",
            date: "2 years ago",
        },
        {
            id: 11,
            text: `AMAZING, patient, and super professional <3`,
            avatar: "url(/img/testimonials/11.jpg)",
            name: "Britney Jayy",
            publisher: "Songwriter/Singer/ R&B lover",
            date: "2 years ago",
        },
        {
            id: 13,
            text: `Loic is an outstanding mixing and mastering engineer. He took care of my track within 24h, as I had a strict deadline. Will definitely work with him again.`,
            avatar: "url(/img/testimonials/4.jpg)",
            name: "Julien Ho-Tong",
            publisher: "Musician, Producer",
            date: "2 years ago",
        },
        {
            id: 14,
            text: `A great producer, i hired him to produce me a very specific song on a little self project and he got me exactly what i wanted ! He's really responsive and open to discussion, and i really appreciate that kind of professionalism. I also was impressed by the mix, didn't ask for any mixing done as i'm mixer myself, by i honestly didn't have much more work to do on the song. Great job, thanks again man !`,
            avatar: "url(/img/testimonials/4.jpg)",
            name: "Kevin Kazuguel",
            publisher: "Mixer engineer/Recording Tech",
            date: "2 years ago",
        },
        {
            id: 15,
            text: `Loic has delivered outstanding work, and exceeded my expectations. I thank him a lot and I will probably be contacting him for future projects.15`,
            avatar: "url(/img/testimonials/15.jpg)",
            name: "Thomas L",
            publisher: "Musician, Singer",
            date: "2 years ago",
        },
        {
            id: 16,
            text: `Was brilliant to work with Loïc. Great communication - Good Ideas ! I look forward to working with him again in the future!          `,
            avatar: "url(/img/testimonials/gum.jpg)",
            name: "Alex Math",
            publisher: "Composer",
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
