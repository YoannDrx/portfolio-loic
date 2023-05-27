import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import ModalVideo from "react-modal-video";
import Modal from "react-modal";
import dynamic from "next/dynamic";
import Image from "next/image";
import ModalOne from "./modal/ModalOne";
import ModalTwo from "./modal/ModalTwo";
import videoData from "../../data/videoData";

Modal.setAppElement("#__next");

const ReactTooltip = dynamic(() => import("react-tooltip"), {
    ssr: false,
});

// Modal.setAppElement("#__next");

const Portfolio = () => {
    // for popup video for youtube
    const [isOpenYoutube, setOpenYoutube] = useState({ isOpen: false, videoId: null });

    // for tabs
    const [selectedTab, setSelectedTab] = useState("All");

    return (
        <>
            <Gallery>
                <Tabs>
                    {/* START FILTER TABLIST */}
                    <TabList>
                    <Tab onClick={() => setSelectedTab("Film")}>All</Tab>
                        <Tab onClick={() => setSelectedTab("Film")}>Film</Tab>
                        <Tab onClick={() => setSelectedTab("Advertisement")}>Advertisement</Tab>
                        <Tab onClick={() => setSelectedTab("Corporate")}>Corporate</Tab>
                        <Tab onClick={() => setSelectedTab("Live")}>Video clip</Tab>
                        <Tab onClick={() => setSelectedTab("Static Youtube")}>Static Youtube</Tab>
                    </TabList>
                    {/* END FILTER TABLIST */}

                    <div className="list_wrapper">
                        {/* START ALL PORTFOLIO */}
                        <TabPanel>
                            <ul className="portfolio_list" data-aos="fade-right" data-aos-duration="1200">
                                {videoData.map((video) => (
                                    <li key={video.id}>
                                        <div className="inner">
                                            <div className="entry tokyo_tm_portfolio_animation_wrap">
                                              {/* 500 x 550 */}
                                                <Image
                                                    width={300}
                                                    height={300}
                                                    src={video.img}
                                                    alt={video.title}
                                                    data-tip
                                                    data-for={video.title}
                                                    onClick={() => setOpenYoutube({ isOpen: true, videoId: video.videoId })}
                                                />
                                                <ReactTooltip id={video.title} place="bottom" type="light" effect="float" className="tooltip-wrapper">
                                                    <div>
                                                        <h5>{video.title}</h5>
                                                        <span>{video.detail}</span>
                                                    </div>
                                                </ReactTooltip>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </TabPanel>
                        {/* END ALL PORTFOLIO */}

                        {/* START VIDEOS */}
                        <TabPanel>
                            <ul className="portfolio_list" data-aos="fade-right" data-aos-duration="1200">
                                <li>
                                    <div className="inner">
                                        <div className="entry tokyo_tm_portfolio_animation_wrap">
                                            <Image width={300} height={300} src="/img/portfolio/2.jpg" alt="Youtube" data-tip data-for="youtube" onClick={() => setOpenYoutube(true)} />
                                            <ReactTooltip id="youtube" place="bottom" type="light" effect="float" className="tooltip-wrapper">
                                                <div>
                                                    <h5>Ashely Flores</h5>
                                                    <span>Youtube</span>
                                                </div>
                                            </ReactTooltip>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </TabPanel>

                        {/* START PHOTOGRAHY */}
                        <TabPanel>
                            <ul className="portfolio_list" data-aos="fade-right" data-aos-duration="1200"></ul>
                        </TabPanel>

                        {/* START PORTFOLIO DETAILS */}
                        <TabPanel>
                            <ul className="portfolio_list" data-aos="fade-right" data-aos-duration="1200"></ul>
                        </TabPanel>
                    </div>
                    {/* END LIST WRAPPER */}
                </Tabs>
            </Gallery>

            {/* START YOUTUBE VIDEO POPUP */}
            <ModalVideo channel="youtube" autoplay isOpen={isOpenYoutube.isOpen} videoId={isOpenYoutube.videoId} onClose={() => setOpenYoutube({ isOpen: false, videoId: null })} />
            {/* EMD YOUTUBE VIDEO POPUP */}
        </>
    );
};

export default Portfolio;
