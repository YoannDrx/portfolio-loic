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
                            <Image width={140} height={20} src="/img/logo/logo-loic-music.png" alt="brand" />
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
                    paddingBottom: isDesktop && !isShortScreen ? "" : "10vh",
                    paddingTop: isDesktop && !isShortScreen ? "" : "40vh",
                }}
            >
                <div className="leftpart_inner">
                    <div className="logo">
                        <Link className="navbar-brand" href="/">
                            <Image width={135} height={20} src="/img/logo/logo-loic-music.png" alt="brand" />
                        </Link>
                    </div>
                    {/* END LOGO */}

                    <div className="menu">
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
                height="${isDesktop ? "400" : "300"}" 
                scrolling="no" 
                frameborder="no" 
                allow="autoplay" 
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1440693976&color=%238c7b67&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=${isDesktop}">
                </iframe>
          `,
                        }}
                    />

                    {/* END COPYRIGHT */}
                    <CopyRight />
                </div>
            </div>
            {/* END LEFT MENU CONTENT */}
        </>
    );
};

export default Sidebar;
