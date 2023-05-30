import React from "react";

const PersonalInfo = () => {
    const personalInfoContent = [
        {
            id: 1,
            colClass: "left",
            info: [
                {
                    id: 1,
                    name: "Address",
                    content: "Paris, France",
                },
                {
                    id: 2,
                    name: "Email",
                    content: (
                        <>
                            <a
                                href="mailto:loic.ghanem@outlook.com
"
                            >
                                loic.ghanem@outlook.com
                            </a>
                        </>
                    ),
                },
                {
                  id: 3,
                  name: "Spoken Languages",
                  content: "English, French",
              },
            ],
        },
        {
            id: 2,
            colClass: "right",
            info: [
                {
                    id: 1,
                    name: "Musician",
                    content: "Piano, Guitar",
                },
                {
                    id: 2,
                    name: "Interests",
                    content: "Music, Cinema, Video Games",
                },
            ],
        },
    ];
    return (
        <>
            {personalInfoContent.map((item) => (
                <div className={item.colClass} key={item.id}>
                    <div className="tokyo_tm_info">
                        <ul>
                            {item?.info?.map((value) => (
                                <li key={value.id}>
                                    <span>{value.name}:</span>
                                    <span>{value.content}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </>
    );
};

export default PersonalInfo;
