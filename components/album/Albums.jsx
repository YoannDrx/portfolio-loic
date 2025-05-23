import Image from "next/image";
import React, { useState } from "react";
import Modal from "react-modal";
import albumsData from "../../data/albumsData";
import ShareSocial from "../social-share/ShareSocial";
import { FaMusic } from "react-icons/fa";

Modal.setAppElement("#__next");

const Albums = () => {
  const [singleData, setSingleData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const handleblogsData = (id) => {
    const find = albumsData.find((item) => item?.id === id);
    setSingleData(find);
    setIsOpen(true);
  };

  const handleModle = (id) => {
    handleblogsData(id);
  };

  const sortedAlbumsData = [...albumsData].sort((a, b) => {
    const aDate = new Date(a.sortedDate.split("-").reverse().join("/"));
    const bDate = new Date(b.sortedDate.split("-").reverse().join("/"));
    return bDate - aDate;
  });

  return (
    <>
      <ul>
        {sortedAlbumsData.map((item) => (
          <li key={item.id}>
            <div className="list_inner" onClick={() => handleModle(item?.id)}>
              <Image
                className="full_size"
                src={item.img}
                alt=""
                width={1920}
                height={1114}
                style={{ width: "100%", height: "auto" }}
              />
              {/* END IMAGE */}
              <div className="details">
                <p className="date">
                  By <a href="#">{item.poster}</a>
                  <span>{item.date}</span>
                </p>

                <h3 className="title">{item.title}</h3>
                <div className="tokyo_tm_read_more">
                  <div className="read-more">
                    <span>Read More</span>
                  </div>
                </div>
                {/* END READ MORE BUTTON */}
              </div>
              {/* END DETAILS */}
            </div>
          </li>
        ))}

        {/* END SINGLE BLOG */}
      </ul>
      {/* START MODAL */}
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="My dialog"
        className="mymodal"
        overlayClassName="myoverlay"
        closeTimeoutMS={500}
      >
        <div className="tokyo_tm_modalbox_news">
          <button className="close-modal" onClick={() => setIsOpen(false)}>
            <Image width={45} height={45} src="/img/svg/cancel.svg" alt="close icon" />
          </button>
          {/* END CLOSE ICON */}

          <div className="box_inner">
            <div className="description_wrap scrollable">
              {/* FULL SIZE IMG */}
              <Image
                className="full_size"
                src={singleData?.img}
                alt=""
                width={1920}
                height={1114}
                style={{ width: "100%", height: "auto" }}
              />
              {/* <div className="image">
                <div
                  className="main"
                  style={{
                    backgroundImage: `url(${singleData?.img})`,
                  }}
                ></div>
              </div> */}
              {/* END IMAGE */}
              <div className="details">
                <div className="extra">
                  <p className="date">
                    By <a href="#">{singleData?.poster}</a>
                    <span>{singleData?.date}</span>
                  </p>
                </div>
                <h3 className="title">{singleData?.title}</h3>
                <div className="news_share">
                  <span>
                    <a
                      href={singleData?.listenLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 28 }}
                      className="hover-green"
                    >
                      <FaMusic />
                      {"  "}Listen to this album here
                    </a>
                  </span>
                </div>
              </div>
              {/* END DETAILS */}
              <div className="main_content ">
                {singleData?.descriptions}
                {/* END DESCRIPTION */}
                {/* END NEWS SHARE */}
              </div>
            </div>
          </div>
          {/* END BOX INNER */}
        </div>
        {/* END MODALBOX NEWS */}
      </Modal>
      {/* END MODAL */}
    </>
  );
};

export default Albums;
