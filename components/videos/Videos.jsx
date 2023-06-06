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


    const renderVideoList = (type) => {
        const sortedVideos = [...videoData]
            .filter((video) => type === "All" || video.type === type)
            .sort((a, b) => {
                const aDate = a.date.split("/").reverse().join("-");
                const bDate = b.date.split("/").reverse().join("-");
                return new Date(bDate) - new Date(aDate);
            });

        return (
            <ul className="portfolio_list" data-aos="fade-right" data-aos-duration="1200">
                {sortedVideos.map((video) => (
                    <li key={video.id}>
                        <div className="inner">
                            <div className="entry ">
                                {/* <Image
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
                                /> */}
                                <iframe
                                    width="300"
                                    height="300"
                                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=0`}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    playsinline
                                    data-tip
                                    data-for={video.title}
                                    onClick={() =>
                                        setOpenYoutube({
                                            isOpen: true,
                                            videoId: video.videoId,
                                        })
                                    }
                                />
                                <ReactTooltip id={video.title} place="bottom" type="light" effect="float" className="tooltip-wrapper">
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
    };

    return (
        <>
            <Gallery>
                <Tabs>
                    <TabList>
                        <Tab onClick={() => setSelectedTab("All")}>All</Tab>
                        <Tab onClick={() => setSelectedTab("Sync")}>Sync</Tab>
                        <Tab onClick={() => setSelectedTab("OriginalMusic")}>Original Music</Tab>
                        <Tab onClick={() => setSelectedTab("MusicToPicture")}>Music to Picture</Tab>
                    </TabList>

                    <div className="list_wrapper">
                        <TabPanel>{renderVideoList("All")}</TabPanel>
                        <TabPanel>{renderVideoList("Sync")}</TabPanel>
                        <TabPanel>{renderVideoList("OriginalMusic")}</TabPanel>
                        <TabPanel>{renderVideoList("MusicToPicture")}</TabPanel>
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
