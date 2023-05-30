const { default: Image } = require("next/image");

module.exports = [
    {
        id: 1,
        title: "Make Me Feel",
        img: "/img/albums/mmf.jpg",
        poster: "Loïc Ghanem",
        date: "May 2022",
        style: "Hip-Hop/RnB",
        listenlLink: "",
        collabName: "Quincy Thompson, Novine, Tim Moyo, Julaiah, Lou.C",
        collabLink: "",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        "Make Me Feel" is a vibrant blend of Hip-Hop and RnB, released in May 2022. This album showcases my collaboration with international artists such as Quincy Thompson, Novine,
                        Tim Moyo, Julaiah, and Lou.C. Signed under my artist name, Voyager1, this album is also intended for publishing. The album was released under the label Montmorency Music Agency
                        (MYMA).
                    </p>
                </div>
            </>
        ),
    },
    {
        id: 2,
        title: "Ambient Guitar",
        // 1200 x 709
        img: "/img/albums/1.jpg",
        poster: "Loïc Ghanem",
        date: "May 2022",
        style: "",
        listenlLink: "",
        collabName: "",
        collabLink: "",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        Just because we can&apos;t get out and about like we normally would, doesn’t mean we have to stop taking pictures. There’s still plenty you can do, provided you&apos;re
                        prepared to use some imagination. Here are a few ideas to keep you shooting until normal life resumes.
                    </p>

                    <p>
                        Streets empty that are usually busy are remarkable and can evoke the sense of historical pictures from before the invention of the motorcar. Other things that are different at
                        the moment will be queues to get into stores and the lines marked out on the floor to show how far apart we should be.
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
      id: 3,
      title: "Bass Music",
      img: "/img/albums/2.jpg",
      poster: "Loïc Ghanem",
      date: "January 2022",
      style: "Bass Music",
      listenlLink: "",
      collabName: "Olynda, Lou.C, Twild",
      collabLink: "",
      descriptions: (
          <>
              <div className="descriptions">
                  <p className="bigger">
                      "Bass Music" is a diverse mix of future house, bass house, DnB, psy trance, and G-house, released in January 2022. This album features collaborations with Olynda, Lou.C, and Twild, and features Lou.C, Marty Degenne, and Magdala. Like my other works, this album is signed under my artist name, Voyager1, and is also intended for publishing. The album was released under the label Justement Music and the publisher MYMA.
                  </p>
              </div>
          </>
      ),
  },
    {
        id: 4,
        title: "Why every photographer should shoot film, even in 2022",
        // 1200 x 675
        img: "/img/albums/3.jpg",
        poster: "Loïc Ghanem",
        date: "15 APRIL 2021",
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
      listenlLink: "",
      collabName: "Lou.C",
      collabLink: "",
      descriptions: (
          <>
              <div className="descriptions">
                  <p className="bigger">
                      "Get Trapped" is a unique blend of Hip-Hop, Trap, RnB, and LoFi, released in May 2021. This album features collaborations with Lou.C and features Novine, Stige, Loris Geisen, and Lou.C. Signed under my artist name, Voyager1, this album is also intended for publishing. The album was released under the label Montmorency Music Agency (MYMA).
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
    date: "April 2021",
    style: "Pop Punk",
    listenlLink: "https://fanlink.to/PopPunk",
    collabName: "Dory-Loup, Fran Darras",
    collabLink: "",
    descriptions: (
        <>
            <div className="descriptions">
                <p className="bigger">
                    "Pop Punk" is a lively blend of pop and punk, released in April 2021. This album features collaborations with Dory-Loup and Fran Darras. Signed under my artist name, Voyager1, this album is also intended for publishing. The album was released under the label Justement Music and the publisher MYMA. Listen to the album <a href="https://fanlink.to/PopPunk">here</a>.
                </p>
            </div>
        </>
    ),
},
    {
        id: 7,
        title: "Sony announced two new full frame cameras with zero fanfare",
        // 12000 x 700
        img: "/img/albums/6.jpg",
        poster: "Loïc Ghanem",
        date: "05 APRIL 2021",
        descriptions: (
            <>
                <div className="descriptions">
                    <p className="bigger">
                        Just because we can&apos;t get out and about like we normally would, doesn’t mean we have to stop taking pictures. There’s still plenty you can do, provided you&apos;re
                        prepared to use some imagination. Here are a few ideas to keep you shooting until normal life resumes.
                    </p>
                    <p>
                        Streets empty that are usually busy are remarkable and can evoke the sense of historical pictures from before the invention of the motorcar. Other things that are different at
                        the moment will be queues to get into stores and the lines marked out on the floor to show how far apart we should be.
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
        id: 8,
        title: "Why every photographer should shoot film, even in 2022",
        // 1200 x 675
        img: "/img/albums/7.jpg",
        poster: "Loïc Ghanem",
        date: "15 APRIL 2021",
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
        title: "Exemple Card",
        // 1200 x 800
        img: "/img/albums/7.jpg",
        poster: "Loïc Ghanem",
        date: "12 APRIL 2021",
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
                    <p>
                        Streets empty that are usually busy are remarkable and can evoke the sense of historical pictures from before the invention of the motorcar. Other things that are different at
                        the moment will be queues to get into stores and the lines marked out on the floor to show how far apart we should be.
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
                        Pretend everything is new and that you haven’t seen it before, and then you will be free to notice the leading lines, the places where one edge meets another in delightful
                        geometric harmony, and how the ordinary things in the kitchen are transformed when the light is on or off.
                    </p>
                    <p>
                        The trick here is to look slowly, and then look again. Take the time to look in detail and to look at the same thing from different angles, with different light, long lenses
                        and wide lenses. Then move to the left a bit. You may never feel the need to leave the house again.
                    </p>
                </div>
            </>
        ),
    },
];
