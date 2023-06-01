const { default: Image } = require("next/image");

module.exports = [
    {
        id: 1,
        title: "Make Me Feel",
        img: "/img/albums/mmf.jpg",
        poster: "Loïc Ghanem",
        date: "May 2022",
        style: "Hip-Hop/RnB",
        listenLink: "https://fanlink.to/Voyager1MakeMeFeel",
        collabName: "Quincy Thompson, Novine, Tim Moyo, Julaiah, Lou.C",
        collabLink: "",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        "Make Me Feel" is a vibrant blend of Hip-Hop and RnB, released in May 2022. This album showcases my collaboration with international artists such as{" "}
                        <span className="collab-name">Quincy Thompson</span>, <span className="collab-name">Novine</span>,<span className="collab-name">Tim Moyo</span>,{" "}
                        <span className="collab-name">Julaiah</span>, and <span className="collab-name">Lou.C</span>. Signed under my artist name, Voyager1, this album is also intended for publishing.
                        The album was released under the label Montmorency Music Agency (MYMA).
                    </p>
                </div>
            </>
        ),
    },
    {
        id: 2,
        title: "Ambient Guitar",
        img: "/img/albums/1.jpg",
        poster: "Loïc Ghanem",
        date: "Sept 2020",
        style: "Ambient Guitar",
        listenLink: "https://fanlink.to/ambientguitar",
        collabName: "Michel-Yves Kochmann",
        collabLink: "",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        "Ambient Guitar" is a soulful blend of ambient sounds and melodious guitar tunes. Released in September 2020, this album is a collaborative effort with renowned artist
                        <span className="collab-name">Michel-Yves Kochmann</span>. Signed under my artist name, Voyager1, this album was aimed primarily for publishing. The album was released under
                        the label Montmorency Music Agency (MYMA).
                    </p>
                </div>
            </>
        ),
    },
    {
        id: 3,
        title: "Bass Music",
        img: "/img/albums/2.jpg",
        poster: "Loïc Ghanem",
        date: "Jan 2022",
        style: "Bass Music",
        listenLink: "https://fanlink.to/Voyager1BassMusic",
        collabName: "Olynda, Lou.C, Twild",
        collabLink: "",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        "Bass Music" is a diverse mix of future house, bass house, DnB, psy trance, and G-house, released in January 2022. This album features collaborations with{" "}
                        <span className="collab-name">Olynda, Lou.C, and Twild</span>, and features <span className="collab-name">Lou.C, Marty Degenne, and Magdala</span>. Like my other works, this
                        album is signed under my artist name, Voyager1, and is also intended for publishing. The album was released under the label Justement Music and the publisher MYMA.
                    </p>
                </div>
            </>
        ),
    },
    {
        id: 4,
        title: " ?? ",
        // 1200 x 675
        img: "/img/albums/3.jpg",
        poster: "Loïc Ghanem",
        date: "Apr 2021",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        Just because we can&apos;t get out and about like we normally would, doesn’t mean we have to stop taking pictures. There’s still plenty you can do, provided you&apos;re
                        prepared to use some imagination. Here are a few ideas to keep you shooting until normal life resumes.
                    </p>
                    <p>
                        Most photographers love to shoot the unusual, and you don’t get much more unusual than These Unprecedented Times. Right now everything counts as out of the ordinary. There are
                        a number of remarkable things about these lockdown days that are worth photographing now so we can remember them when it is all over.
                    </p>
                    <div className="quotebox">
                        <div className="icon">
                            <Image width={56} height={50} className="svg" src="/img/svg/quote.svg" alt="tumb" />
                        </div>
                        <p>
                            Most photographers find it hard to see interesting pictures in places in which they are most familiar. A trip somewhere new seems always exactly what our photography
                            needed, as shooting away from home consistently inspires us to new artistic heights.
                        </p>
                    </div>
                    {/* END QUOTEBOX */}
                    <p>
                        The trick here is to look slowly, and then look again. Take the time to look in detail and to look at the same thing from different angles, with different light, long lenses
                        and wide lenses. Then move to the left a bit. You may never feel the need to leave the house again.
                    </p>
                </div>
            </>
        ),
    },
    {
        id: 5,
        title: "Get Trapped",
        img: "/img/albums/4.jpg",
        poster: "Loïc Ghanem",
        date: "May 2021",
        style: "Hip-Hop",
        listenLink: "https://fanlink.to/Voyager1GetTrapped",
        collabName: "Lou.C",
        collabLink: "",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        "Get Trapped" is a unique blend of Hip-Hop, Trap, RnB, and LoFi, released in May 2021. This album features collaborations with <span className="collab-name">Lou.C</span> and
                        features <span className="collab-name">Novine, Stige, Loris Geisen, and Lou.C</span>. Signed under my artist name, Voyager1, this album is also intended for publishing. The
                        album was released under the label Montmorency Music Agency (MYMA).
                    </p>
                </div>
            </>
        ),
    },
    {
        id: 6,
        title: "Pop Punk",
        img: "/img/albums/5.jpg",
        poster: "Loïc Ghanem",
        date: "Apr 2021",
        style: "Pop Punk",
        listenLink: "https://fanlink.to/PopPunk",
        collabName: "Dory-Loup, Fran Darras",
        collabLink: "",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        "Pop Punk" is a lively blend of pop and punk, released in April 2021. This album features collaborations with <span className="collab-name">Dory-Loup</span> and{" "}
                        <span className="collab-name">Fran Darras</span>. Signed under my artist name, Voyager1, this album is also intended for publishing. The album was released under the label
                        Justement Music and the publisher (MYMA).
                    </p>
                </div>
            </>
        ),
    },
    {
        id: 7,
        title: "Hardcore",
        img: "/img/albums/6.jpg",
        poster: "Loïc Ghanem",
        date: "July 2020",
        style: "Hardcore",
        listenLink: "https://fanlink.to/hardcoreLoicghanem",
        collabName: "Terence Langlois",
        collabLink: "",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        "Hardcore" is an intense blend of powerful beats and rhythm, released in July 2020. This album highlights my collaboration with{" "}
                        <span className="collab-name">Terence Langlois</span>, who masterfully arranged the drums, adding an extra layer of intensity to the compositions. The project was a part of the
                        label Stereoscopic and published by Montmorency Music Agency (MYMA).
                    </p>
                </div>
            </>
        ),
    },
    {
        id: 8,
        title: "??",
        // 1200 x 675
        img: "/img/albums/7.jpg",
        poster: "Loïc Ghanem",
        date: "Apr 2021",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        Just because we can&apos;t get out and about like we normally would, doesn’t mean we have to stop taking pictures. There’s still plenty you can do, provided you&apos;re
                        prepared to use some imagination. Here are a few ideas to keep you shooting until normal life resumes.
                    </p>
                    <p>
                        Most photographers love to shoot the unusual, and you don’t get much more unusual than These Unprecedented Times. Right now everything counts as out of the ordinary. There are
                        a number of remarkable things about these lockdown days that are worth photographing now so we can remember them when it is all over.
                    </p>
                    <div className="quotebox">
                        <div className="icon">
                            <Image width={56} height={50} className="svg" src="/img/svg/quote.svg" alt="tumb" />
                        </div>
                        <p>
                            Most photographers find it hard to see interesting pictures in places in which they are most familiar. A trip somewhere new seems always exactly what our photography
                            needed, as shooting away from home consistently inspires us to new artistic heights.
                        </p>
                    </div>
                    {/* END QUOTEBOX */}
                    <p>
                        The trick here is to look slowly, and then look again. Take the time to look in detail and to look at the same thing from different angles, with different light, long lenses
                        and wide lenses. Then move to the left a bit. You may never feel the need to leave the house again.
                    </p>
                </div>
            </>
        ),
    },
    {
        id: 9,
        title: "Fast Metal",
        img: "/img/albums/8.jpg",
        poster: "Loïc Ghanem",
        date: "July 2020",
        style: "Metalcore/Speed Metal",
        listenLink: "https://fanlink.to/FastMetal",
        collabName: "Sham Makdessi, Terence Langlois, Aaron Matts",
        collabLink: "",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        "Fast Metal" is a high-energy fusion of Metalcore and Speed Metal, released in July 2020. This album encapsulates my collaboration with talented artists such as{" "}
                        <span className="collab-name">Sham Makdessi</span>, <span className="collab-name">Terence Langlois</span>, who brilliantly arranged the drums, and a featured performance by{" "}
                        <span className="collab-name">Aaron Matts</span>. This album was part of the label Justement and published by Montmorency Music Agency (MYMA).
                    </p>
                </div>
            </>
        ),
    },
    {
        id: 10,
        title: "Kick-ass Metal Jacket",
        img: "/img/albums/9.jpg",
        poster: "Loïc Ghanem",
        date: "June 2020",
        style: "Metalcore",
        listenLink: "https://fanlink.to/Kick-assMetalJacket",
        collabName: "Terence Langlois",
        collabLink: "",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        "Kick-ass Metal Jacket" is a powerful blend of Metalcore, released in June 2020. This album marks another collaboration with{" "}
                        <span className="collab-name">Terence Langlois</span>, who skillfully arranged the drums, adding a distinct energy to the compositions. The album was part of the Superpitch
                        label and was intended primarily for publishing.
                    </p>
                </div>
            </>
        ),
    },
];
