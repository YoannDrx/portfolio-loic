import Image from "next/image";
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
  { iconName: "soundbetter-logo", link: "https://soundbetter.com/profiles/402365-lo%C3%AFc-ghanem--voyager1" },
];
const Social = () => {
  return (
    <>
      <ul className="social">
        {SocialShare.map((val, i) => (
          <li key={i}>
            <a href={`${val.link}`} target="_blank" rel="noreferrer">
              <Image
                src={`/img/svg/social/${val.iconName}.png`}
                alt="social"
                width={24}
                height={24}
                className="svg"
                style={{ width: "100%", height: "auto" }}
              />
            </a>
          </li>
        ))}
      </ul>
      {/* END SOCIAL */}
    </>
  );
};

export default Social;
