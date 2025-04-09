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
              }}
            ></div>
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
              Winner of the Best Rock Song at the{" "}
              <a
                href="https://pmamusic.com/events/mark-awards/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-green"
              >
                Los Angeles Mark Awards in 2023
              </a>
              .
              <br />
              <p style={{ marginTop: 10 }}>Also nominated for:</p>
              <ul style={{ marginTop: "5px", marginBottom: "5px", paddingLeft: "20px" }}>
                <li>
                  Best Hip-Hop Song at the{" "}
                  <a
                    href="https://pmamusic.com/events/mark-awards/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-green"
                  >
                    Los Angeles Mark Awards in 2023
                  </a>
                </li>
                <li>
                  Best Metal Song at the{" "}
                  <a
                    href="https://www.productionmusicawards.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-green"
                  >
                    London Music Production Awards in 2024
                  </a>
                </li>
              </ul>
              These nominations reflect my versatility across genres and my commitment to excellence in music production.
            </p>
            <p style={{ marginBottom: "20px" }}>
              Check out my last video{" "}
              <a
                href="https://www.youtube.com/watch?v=_B-8cHjcsac"
                className="hover-green"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Mother (Feat Novine)&quot;
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
