import React from "react";

const FunFact = () => {
  const funFactContent = [
    {
      id: 1,
      number: "150+",
      meta: "Projects Completed",
    },
    {
      id: 2,
      number: "30+",
      meta: "Happy Clients",
    },
    {
      id: 3,
      number: "300 hours",
      meta: "Music composed",
    },
  ];
  return (
    <>
      {funFactContent.map((item) => (
        <li key={item.id}>
          <div className="list_inner">
            <h3>{item.number}</h3>
            <span>{item.meta}</span>
          </div>
        </li>
      ))}
    </>
  );
};

export default FunFact;
