import React from "react";

const CopyRight = () => {
    return (
        <div className="copyright">
                Created by
            <span>
                <a href="https://www.yodev.fr/" target="_blank" rel="noreferrer">
                &copy; Yodev 
                </a>
            </span>
            <span> {new Date().getFullYear()}</span>
        </div>
    );
};

export default CopyRight;
