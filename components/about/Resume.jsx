import React from "react";

const Resume = () => {
    const resumeContent = [
        {
            id: 1,
            colClass: "right",
            title: "Musician Experience",
            resume: [
                {
                    id: 1,
                    year: "2013 - 2015",
                    institute: "Rise of the northstar",
                    degree: "Guitarist",
                    style: "Hardcore",
                    link: "https://open.spotify.com/artist/5vDfbSPkurKQxpVVXALJ4K?si=j9AujCK0T3e_IK-8r4_v8A",
                },
                {
                    id: 2,
                    year: "2015 - 2020",
                    institute: "EarlySeason",
                    degree: "Guitarist",
                    style: "Métalcore",
                    link: "https://open.spotify.com/artist/2CEQ7Zi4GFz0vZMAdIJauH?si=GALGlvYkQaSPWDyhRtm4pA",
                },
                {
                    id: 3,
                    year: "2017 - 2019",
                    institute: "Confront",
                    degree: "Producer and Guitarist",
                    style: "Electronic / Metal",
                    link: "Listening Link",
                },
                {
                    id: 4,
                    year: "2018 - Present",
                    institute: "Voyager1",
                    degree: "Producer - Current Project",
                    style: "All music styles",
                    link: "https://open.spotify.com/artist/0YsVcXoD5tnnhqVHcBkJNG?si=GslOnlppQJeON87iMDABfg",
                },
            ],
        },
    ];
    return (
        <>
            {resumeContent.map((item) => (
                <div className={item.colClass} key={item.id}>
                    <div className="tokyo_section_title">
                        <h3>{item.title}</h3>
                    </div>
                    <div className="tokyo_tm_resume_list">
                        <ul>
                            {item?.resume?.map((value) => (
                                <li key={value.id}>
                                    <div className="list_inner">
                                        <div className="time">
                                            <span>{value.year}</span>
                                        </div>
                                        <div className="place">
                                            <h3>{value.institute}</h3>
                                            <div>{value.degree}</div>
                                            <div>{value.style}</div>
                                            <a href={value.link} target="_blank" rel="noopener noreferrer" style={{ color: "lightgreen", textDecoration: "none" }}>
                                                Listen Here
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Resume;
