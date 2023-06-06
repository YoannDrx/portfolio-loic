import Image from "next/image";
import Link from "next/link";
import sidebarData from "../../data/sidebarData";
import CopyRight from "../CopyRight";
import { isActiveLink } from "../../utilis/linkActiveChecker";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const Sidebar = () => {
    const router = useRouter();
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const isDesktop = useMediaQuery({ minWidth: 992 });
    const [isShortScreen, setIsShortScreen] = useState(false);

    useEffect(() => {
        if (click) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        const handleResize = () => {
            if (window.innerHeight < 750) {
                setIsShortScreen(true);
            } else {
                setIsShortScreen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [click]);

    useEffect(() => {
        const handleRouteChange = () => {
            document.body.classList.remove("no-scroll");
        };

        router.events.on("routeChangeStart", handleRouteChange);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, [router]);

    return (
        <>
            <div className="header">
                <div className="header-inner">
                    <div className="logo">
                        <Link className="navbar-brand" href="/">
                            <Image width={270} height={40} src="/img/logo/logo-loic-music.svg" alt="brand" />
                        </Link>
                    </div>
                    {/* End logo */}

                    <div className="my_trigger" onClick={handleClick}>
                        <div className={click ? "hamburger hamburger--collapse-r is-active" : "hamburger"}>
                            <div className="hamburger-box">
                                <div className="hamburger-inner"></div>
                            </div>
                        </div>
                        {/* End hamburger menu */}
                    </div>
                </div>
            </div>
            {/* Header */}

            {/* START LEFT MENU CONTENT */}
            <div
                className={click ? "leftpart active" : "leftpart"}
                style={{
                    overflowY: isDesktop && !isShortScreen ? "visible" : "scroll",
                }}
            >
                <div className="leftpart_inner">
                    <div className="content">
                        <div className="logo shadow">
                            <Link className="navbar-brand" href="/">
                                <Image width={270} height={40} src="/img/logo/logo-loic-music.svg" alt="brand" />
                            </Link>
                        </div>
                        {/* END LOGO */}

                        <div className="menu menucontent">
                            <ul>
                                {sidebarData.map((item) => (
                                    <li key={item.id} onClick={handleClick}>
                                        <Link className={`${isActiveLink(item.routePath, router.asPath) ? "active " : ""}`} href={item.routePath}>
                                            <Image width={15} height={15} className="svg" src={item.icon} alt="homerun" />
                                            <span className="menu_content">{item.menuName}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* END MENU */}

                        <div
                            className={`soundcloud-player`}
                            dangerouslySetInnerHTML={{
                                __html: `
            <iframe 
                width="100%" 
                height="500" 
                scrolling="no" 
                frameborder="no" 
                allow="autoplay" 
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1342377886%3Fsecret_token%3Ds-0WB6x1mRFeB&color=%23070a17&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
                </iframe>
          `,
                            }}
                        />

                        {/* END COPYRIGHT */}
                        <CopyRight />
                    </div>
                </div>
            </div>
            {/* END LEFT MENU CONTENT */}
        </>
    );
};

export default Sidebar;
