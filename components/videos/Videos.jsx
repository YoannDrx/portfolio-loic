import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import ModalVideo from "react-modal-video";
import Modal from "react-modal";
import dynamic from "next/dynamic";
import Image from "next/image";
import videoData from "../../data/videoData";

Modal.setAppElement("#__next");

const ReactTooltip = dynamic(() => import("react-tooltip"), {
    ssr: false,
});

const Videos = () => {
    const [isOpenYoutube, setOpenYoutube] = useState({ isOpen: false, videoId: null });
    const [selectedTab, setSelectedTab] = useState("All");

    const renderVideoList = (type) => (
        <ul className="portfolio_list" data-aos="fade-right" data-aos-duration="1200">
            {videoData
                .filter((video) => type === "All" || video.type === type)
                .map((video) => (
                    <li key={video.id}>
                        <div className="inner">
                            <div className="entry tokyo_tm_portfolio_animation_wrap">
                                <Image
                                    width={300}
                                    height={300}
                                    src={video.img}
                                    alt={video.title}
                                    data-tip
                                    data-for={video.title}
                                    onClick={() =>
                                        setOpenYoutube({
                                            isOpen: true,
                                            videoId: video.videoId,
                                        })
                                    }
                                />
                                <ReactTooltip
                                    id={video.title}
                                    place="bottom"
                                    type="light"
                                    effect="float"
                                    className="tooltip-wrapper"
                                >
                                    <div>
                                        <h5>{video.title}</h5>
                                        <span>{video.type}</span>
                                    </div>
                                </ReactTooltip>
                            </div>
                        </div>
                    </li>
                ))}
        </ul>
    );

    return (
        <>
            <Gallery>
                <Tabs>
                    <TabList>
                        <Tab onClick={() => setSelectedTab("All")}>All</Tab>
                        <Tab onClick={() => setSelectedTab("Film")}>Film</Tab>
                        <Tab onClick={() => setSelectedTab("Advertisement")}>Advertisement</Tab>
                        <Tab onClick={() => setSelectedTab("Live")}>Video clip</Tab>
                        <Tab onClick={() => setSelectedTab("Music Video")}>Music Video</Tab>
                    </TabList>

                    <div className="list_wrapper">
                        <TabPanel>{renderVideoList("All")}</TabPanel>
                        <TabPanel>{renderVideoList("Film")}</TabPanel>
                        <TabPanel>{renderVideoList("Advertisement")}</TabPanel>
                        <TabPanel>{renderVideoList("Live")}</TabPanel>
                        <TabPanel>{renderVideoList("Music Video")}</TabPanel>
                    </div>
                </Tabs>
            </Gallery>

            <ModalVideo
                channel="youtube"
                autoplay
                isOpen={isOpenYoutube.isOpen}
                videoId={isOpenYoutube.videoId}
                onClose={() =>
                    setOpenYoutube({
                        isOpen: false,
                        videoId: null,
                    })
                }
            />
        </>
    );
};

export default Videos;