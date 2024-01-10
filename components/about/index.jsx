import React from "react";
import Modal from "react-modal";
import Testimonial from "./Testimonial";
import Intro from "./Intro";
import KnowledgeInterest from "./KnowledgeInterest";
import PersonalInfo from "./PersonalInfo";
import Resume from "./Resume";
import Skills from "./Skills";
import Image from "next/image";

Modal.setAppElement("#__next");

const AboutMain = () => {
  return (
    <>
      <div className="container">
        <div className="tokyo_tm_about">
          <div className="tokyo_tm_title">
            <div className="title_flex">
              <div className="left">
                <span>About</span>
                <h3>About Me</h3>
              </div>
            </div>
          </div>
          {/* End title */}

          <Intro />
          <div className="tokyo_tm_short_info">
            <PersonalInfo />
          </div>
          {/* End personal info */}

          <div className="tokyo_tm_button" data-position="left">
            <a href="/img/cv_loic_ghanem.pdf" download>
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </div>
      {/* End .container */}

      <div className="container">
        <h1>Latest Achievements</h1>
        <p>Discover my recent awards and musical milestones.</p>

        <div className="news_content">
          <div
            className="award_section"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
            <div className="award_text">
              <h4 className="award_title">The Production Music Awards</h4>
              <p>
                A celebration of the best and brightest in the field of production music, the Production Music Awards are a
                testament to creative excellence and innovation. Being a part of this event was not only an honor but also an
                opportunity to connect with some of the most talented individuals in the industry.
              </p>
              <br />
              <p>
                The awards showcase a wide range of musical genres, honoring composers and producers whose work elevates media
                across the globe.
              </p>
              <p>
                <a href="https://www.productionmusicawards.com/" target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              </p>
            </div>
            <img
              src="/img/about/PMA-2023-Rock-nomination.jpg"
              alt="Production Music Awards Nomination"
              style={{ width: "60%", height: "auto" }}
            />
          </div>

          <div
            className="award_section"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
            <div className="award_text">
              <h4 className="award_title">The Mark Awards</h4>
              <p>
                Recognizing the outstanding achievements in the field of production music, the Mark Awards set a high standard for
                creativity and excellence. Participating in the Mark Awards was an exhilarating experience, bringing together a
                community of passionate and dedicated music professionals.
              </p>
              <br />
              <p>
                These awards are a true reflection of the hard work and dedication that goes into production music, celebrating
                the incredible talent and creativity that drives our industry forward.
              </p>
              <p>
                <a href="https://pmamusic.com/events/mark-awards/" target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              </p>
            </div>
            <img src="/img/about/Marks-Awards.jpg" alt="Mark Awards" style={{ width: "60%", height: "auto" }} />
          </div>
        </div>
      </div>

      {/* <div className="tokyo_tm_progressbox">
                <div className="container">
                    <div className="in">
                        <Skills />
                    </div>
                </div>
            </div> */}
      {/* End tokyo_tm_progressbox */}

      {/* <div className="tokyo_tm_skillbox">
        <div className="container">
          <div className="in">
            <KnowledgeInterest />
          </div>
        </div>
      </div> */}
      {/* End .tokyo_tm_skillbox */}

      <div className="tokyo_tm_resumebox">
        <div className="container">
          <div className="in">
            <Resume />
          </div>
        </div>
      </div>
      {/* End tokyo_tm_resumebox */}

      <div className="tokyo_tm_testimonials">
        <div className="container">
          <div className="tokyo_section_title">
            <h3>Testimonials</h3>
            <a
              href={"https://soundbetter.com/profiles/402365-lo%C3%AFc-ghanem--voyager1"}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "lightgreen", textDecoration: "none" }}>
              Check out the SoundBetter reviews
            </a>
          </div>
          <div className="list">
            <Testimonial />
          </div>
        </div>
      </div>
      {/* End tokyo_tm_testimonials */}

      {/* /ABOUT */}
    </>
  );
};

export default AboutMain;
