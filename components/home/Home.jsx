import React from "react";
import Typed from "react-typed";
import Social from "../Social";

const Home = () => {
  return (
    <>
      <div className="tokyo_tm_home">
        <div className="home_content">
          <div className="avatar">
            <div
              className="image avatar_img"
              style={{
                backgroundImage: "url(/img/slider/1.jpg)",
              }}
            ></div>
            {/* END AVATAR IMAGE */}
          </div>
          {/* END AVATAR */}
          <div className="details">
            <h3 className="name">Loïc Ghanem</h3>
            <h4 className="typer">
              <Typed
                strings={[
                  "Compositeur",
                  "Producteur",
                  "Ingénieur du son",
                  "Beatmaker",
                ]}
                loop
                typeSpeed={80}
              />
            </h4>

            <p className="job">
              Compositeur basé à Paris. Je sonorise tous vos projets, je suis spécialisé dans la composition de musiques de films, de jeux vidéos et de publicités.
            </p>
            {/* END JOB */}
            <Social />
          </div>
          {/* END DETAILS */}
        </div>
        {/* END HOME CONTENT */}
      </div>
      {/* END HOME */}
    </>
  );
};

export default Home;

