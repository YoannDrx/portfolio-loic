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
                    year: "2010 - 2012",
                    institute: "Rise of the northstar",
                    degree: "Guitarist",
                    style: "Hardcore",
                    link: "https://www.youtube.com/watch?v=NulC3-rQX24&ab_channel=RiseOfTheNorthstar",
                },
                {
                    id: 2,
                    year: "2011 - 2014",
                    institute: "Confront",
                    degree: "Producer and Guitarist",
                    style: "Electronic / Metal",
                    link: "https://www.youtube.com/watch?v=8m4W1IuVRco&ab_channel=ConfrontOfficial",
                },
                {
                    id: 3,
                    year: "2011 - 2015",
                    institute: "EarlySeason",
                    degree: "Guitarist",
                    style: "Métalcore",
                    link: "https://www.youtube.com/watch?v=o8c9h2Vzrhw&ab_channel=ArteryRecordings",
                },
                {
                    id: 4,
                    year: "2017 - Present",
                    institute: "Voyager1",
                    degree: "Producer - Current Project",
                    style: "Hiphop and Bass Music",
                    link: "https://www.youtube.com/watch?v=aPJUTPMEukM&ab_channel=Voyager1",
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
