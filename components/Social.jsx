import React from "react";

const SocialShare = [
  {
    iconName: "facebook",
    link: "https://www.facebook.com/loic.leduc.54",
  },
  {
    iconName: "youtube",
    link: "https://www.youtube.com/@LoicGhanem",
  },
  { iconName: "soundcloud", link: "https://soundcloud.com/loic-ghanem" },
  { iconName: "linkedin", link: "https://www.linkedin.com/in/lo%C3%AFc-ghanem/" },

];
const Social = () => {
  return (
    <>
      <ul className="social">
        {SocialShare.map((val, i) => (
          <li key={i}>
            <a href={`${val.link}`} target="_blank" rel="noreferrer">
              <img
                className="svg"
                src={`/img/svg/social/${val.iconName}.png`}
                alt="social"
              ></img>
            </a>
          </li>
        ))}
      </ul>
      {/* END SOCIAL */}
    </>
  );
};

export default Social;
