import React from "react";

const CopyRight = () => {
  return (
    <div className="copyright">
      <p>
        &copy; {new Date().getFullYear()} Tokyo <br /> Created by
        <a
          href="https://www.yodev.fr/"
          target="_blank"
          rel="noreferrer"
        >
          Yodev
        </a>
      </p>
    </div>
  );
};

export default CopyRight;
