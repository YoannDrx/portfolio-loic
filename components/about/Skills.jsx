import React from "react";

const Skills = () => {
  const skillsContent = [
    {
      id: 1,
      colClass: "left",
      title: "Music Production Skills",
      progress: [
        {
          id: 1,
          skillName: "Composition",
          skillValue: "95",
        },
        {
          id: 2,
          skillName: "Production",
          skillValue: "90",
        },
        {
          id: 3,
          skillName: "Arranging",
          skillValue: "90",
        },
        {
          id: 4,
          skillName: "Mixing",
          skillValue: "85",
        },
        {
          id: 5,
          skillName: "Mastering",
          skillValue: "90",
        },
      ],
    },
    {
      id: 2,
      colClass: "right",
      title: "Versatility & Adaptability",
      progress: [
        {
          id: 1,
          skillName: "Film Scoring",
          skillValue: "95",
        },
        {
          id: 2,
          skillName: "Video Game Music",
          skillValue: "85",
        },
        {
          id: 3,
          skillName: "Advertising Jingles",
          skillValue: "90",
        },
        {
          id: 4,
          skillName: "Pop Music Production",
          skillValue: "90",
        },
        {
          id: 5,
          skillName: "Electronic Music Production",
          skillValue: "95",
        },
      ],
    },
  ];
  return (
    <>
      {skillsContent.map((item) => (
        <div className={item.colClass} key={item.id}>
          <div className="tokyo_section_title">
            <h3>{item.title}</h3>
          </div>

          <div className="tokyo_progress">
            {item?.progress?.map((skill) => (
              <div
                className="progress_inner"
                data-value={skill.skillValue}
                key={skill.id}
              >
                <span>
                  <span className="label">{skill?.skillName}</span>
                  <span className="number">{skill?.skillValue}%</span>
                </span>
                <div className="background">
                  <div className="bar">
                    <div
                      className="bar_in"
                      style={{ width: skill?.skillValue + "%" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default Skills;