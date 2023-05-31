import React from "react";

const Intro = () => {
    const introContent = {
        // 1920 x 1114
        image: "/img/slider/loic-back.jpg",
        name: "Loïc Ghanem",
        designation: "Music Composer, Music Producer",
        text: (
            <>
                <p>
                    Hello ! I&apos;m Loïc Ghanem, a Paris-based composer and music producer with a passion for soundscaping narratives. My journey into the world of music began at a young age, and for
                    the past decade, it has been my purpose and profession.
                </p>
                <p>
                    From film scores to video game soundtracks, to jingles for commercials, I&apos;ve lent my sonic signature to various projects, enriching them with depth and emotion. One of my
                    strengths lies in my ability to take a raw idea and transform it into a full-blown auditory experience. My work doesn&apos;t just exist in the background; it amplifies the story,
                    setting the tone and enriching the viewer&apos;s or player&apos;s experience.
                </p>
                <p>
                    I pride myself on delivering unique, contemporary, and engaging soundscapes that resonate and create lasting impressions. Leveraging my extensive understanding of the intricate
                    mechanics of music production and sound design, I excel at delivering compositions that require minimal maintenance, yet perform impeccably over time. I invite you to explore my
                    portfolio and immerse yourself in the diverse musical worlds I&apos;ve had the pleasure of creating.
                </p>
                <p>I look forward to collaborating with you on your next project, elevating it with my music.</p>
            </>
        ),
    };

    return (
        <>
            <div className="top_author_image">
                <img src={introContent.image} alt="about" />
            </div>
            <div className="about_title">
                <h3>{introContent.name}</h3>
                <span>{introContent.designation}</span>
            </div>
            <div className="about_text">{introContent.text}</div>
        </>
    );
};

export default Intro;
