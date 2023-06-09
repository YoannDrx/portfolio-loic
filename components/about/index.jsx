import React from "react";
import Modal from "react-modal";
import Testimonial from "./Testimonial";
import Intro from "./Intro";
import KnowledgeInterest from "./KnowledgeInterest";
import PersonalInfo from "./PersonalInfo";
import Resume from "./Resume";
import Skills from "./Skills";

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
                            style={{ color: "lightgreen", textDecoration: "none" }}
                        >
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
