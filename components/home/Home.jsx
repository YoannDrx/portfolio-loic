import React from "react";
import Typed from "react-typed";
import Social from "../Social";

const Home = () => {
  return (
    <>
      <div className="tokyo_tm_home">
        <div className="home_content">
          <div className="avatar">
            {/* 1920 x 1114 */}
            <div
              className="image avatar_img"
              style={{
                backgroundImage: "url(/img/slider/loic-studio-front.jpg)",
              }}></div>
            {/* END AVATAR IMAGE */}
          </div>
          {/* END AVATAR */}
          <div className="details">
            <h3 className="name">Loïc Ghanem</h3>
            <h4 className="typer">
              <Typed strings={["music composer", "music producer"]} loop typeSpeed={80} />
            </h4>

            <p className="job">
              Composer based in Paris. I bring your projects to life with sound, specializing in composing music for films, video
              games, and commercials. Elevate your narratives with my unique soundscapes.
            </p>
            <p className="job">
              Nominated in 2023 for Best Rock and Hip-Hop Songs at the{" "}
              <a href={"https://pmamusic.com/events/mark-awards/"} target="_blank" rel="noopener noreferrer">
                Los Angeles Mark Awards
              </a>
              , winning in the Rock category ! Also nominated for the Rock category at the{" "}
              <a href={"https://www.productionmusicawards.com/nominations-2023/"} target="_blank" rel="noopener noreferrer">
                London Music Production Awards
              </a>
              .
            </p>
            <p style={{ marginBottom: "20px" }}>
              Check out my last video{" "}
              <a href="https://www.youtube.com/watch?v=sG9J5pcNco4" className="last-video">
                "Dark Industry"
              </a>
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
