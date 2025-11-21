import React from 'react';
import type { Album } from '@/types';

export function getAlbumsData(locale: string): Album[] {
  const isFr = locale === 'fr';

  return [
  {
    id: 1,
    title: 'The Queens',
    img: '/img/albums/the-queens.jpg',
    poster: 'Loïc Ghanem',
    date: 'June 2023',
    sortedDate: '06-2023',
    style: 'All Music Genres',
    listenLink: 'https://fanlink.tv/TheQueens',
    collabName:
      'Novine, Kinnie Lane, Voyager1, Lou.C, Devmo, Meganne, Lina Stalyte, London Mars, Extra Special, Emy Smith, Yulia, Magdala ',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;The Queens&apos;</em> est un album ambitieux et contemporain. Conçu par Loïc Ghanem en juin 2023, il propose
            une exploration audacieuse de genres musicaux intemporels. Entrelaçant harmonieusement des éléments de punk rock avec
            les rythmes pulsants de la drill music, l&apos;album marque une rupture audacieuse avec la norme. Ce chef-d&apos;œuvre
            sonore éclectique a été créé avec la collaboration d&apos;artistes internationaux notables -{' '}
            <span className="hover-green">
              Novine, Kinnie Lane, Voyager1, Lou.C, Devmo, Meganne, Lina Stalyte, London Mars, Extra Special, Emy Smith, Yulia,
              Magdala
            </span>
            , apportant leurs touches uniques au mélange.
          </p>
          <p className="bigger">
            La pochette visuellement frappante, ornée de l&apos;image des reines, donne un aperçu de la musique puissante qu&apos;elle
            contient. Chaque morceau témoigne de la polyvalence de la musique, repoussant les frontières tout en rendant hommage
            à différents styles musicaux. L&apos;album est non seulement un témoignage de la polyvalence de Loïc en tant qu&apos;artiste,
            mais aussi des possibilités illimitées de la collaboration et de la transformation musicales.
          </p>
          <p className="bigger">
            <em>&apos;The Queens&apos;</em> constitue un voyage captivant à travers le paysage varié de la musique, laissant
            les auditeurs impatients de découvrir le prochain rebondissement. Ce n&apos;est pas seulement un album ; c&apos;est
            un voyage audacieux au cœur de ce qui rend la musique intemporelle et continuellement fascinante. Écoutez &quot;The Queens&quot;
            et laissez-vous emporter par son mélange révolutionnaire de punk rock, de drill music et d&apos;autres genres.
            L&apos;album est sorti sous le label{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
          <p className="bigger tracklist-title">Tracklist :</p>
          <ul className=" bigger tracklist">
            <li>1. Mother - Novine - 04:28</li>
            <li>2. Like A Lightning - Kinnie Lane - 02:44</li>
            <li>3. Supervillain - Voyager1, Lou.C, Devmo - 03:29</li>
            <li>4. Paper Plane - Voyager1, Meganne - 03:37</li>
            <li>5. Nature - Lina Stalyte - 04:31</li>
            <li>6. Forget My Name - London Mars - 02:31</li>
            <li>7. I&apos;ll Be Fine - Extra Special - 03:29</li>
            <li>8. Watch Me Dance - Emy Smith - 02:22</li>
            <li>9. Sky Is The Limit - Yulia - 02:55</li>
            <li>10. Don&apos;t Like This Game - Magdala - 04:37</li>
          </ul>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;The Queens&apos;</em> is an ambitious and contemporary album. Crafted by Loïc Ghanem in June 2023, it bears
            an audacious exploration of timeless music genres. Seamlessly intertwining elements of punk rock with the pulsating
            beats of drill music, the album marks a bold departure from the norm. This eclectic sonic masterpiece was brought to
            life with the collaboration of notable international artists -{' '}
            <span className="hover-green">
              Novine, Kinnie Lane, Voyager1, Lou.C, Devmo, Meganne, Lina Stalyte, London Mars, Extra Special, Emy Smith, Yulia,
              Magdala
            </span>
            , adding their unique flavors to the mix.
          </p>
          <p className="bigger">
            The visually striking album cover, emblazoned with the image of the queens, gives a hint to the powerful music
            contained within. Every track is a testament to the versatility of music, breaking boundaries while paying homage to
            different music styles. The album is not just a testament to Loïc&apos;s versatility as an artist, but also to the
            limitless possibilities of musical collaboration and transformation.
          </p>
          <p className="bigger">
            <em>&apos;The Queens&apos;</em> serves as a captivating journey through the varied landscape of music, leaving
            listeners eager for the next twist or turn. It&apos;s not just an album; it&apos;s an audacious voyage into the heart
            of what makes music timeless and continually fascinating. Listen to &quot;The Queens&quot; and allow its revolutionary
            blend of punk rock, drill music, and other genres to sweep you off your feet. The album was released under the label{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
          <p className="bigger tracklist-title">Tracklist:</p>
          <ul className=" bigger tracklist">
            <li>1. Mother - Novine - 04:28</li>
            <li>2. Like A Lightning - Kinnie Lane - 02:44</li>
            <li>3. Supervillain - Voyager1, Lou.C, Devmo - 03:29</li>
            <li>4. Paper Plane - Voyager1, Meganne - 03:37</li>
            <li>5. Nature - Lina Stalyte - 04:31</li>
            <li>6. Forget My Name - London Mars - 02:31</li>
            <li>7. I&apos;ll Be Fine - Extra Special - 03:29</li>
            <li>8. Watch Me Dance - Emy Smith - 02:22</li>
            <li>9. Sky Is The Limit - Yulia - 02:55</li>
            <li>10. Don&apos;t Like This Game - Magdala - 04:37</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 2,
    title: 'Make Me Feel',
    img: '/img/albums/mmf.jpg',
    poster: 'Loïc Ghanem',
    date: 'May 2022',
    sortedDate: '05-2022',
    style: 'Hip-Hop/RnB',
    listenLink: 'https://fanlink.tv/Voyager1MakeMeFeel',
    collabName: 'Quincy Thompson, Novine, Tim Moyo, Julaiah, Lou.C',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Make Me Feel&apos;</em> est un mélange vibrant de Hip-Hop et RnB, sorti en mai 2022. Cet album présente ma
            collaboration avec des artistes internationaux tels que <span className="hover-green">Quincy Thompson</span>,{' '}
            <span className="hover-green">Novine</span>, <span className="hover-green">Tim Moyo</span>,{' '}
            <span className="hover-green">Julaiah</span> et <span className="hover-green">Lou.C</span>. Signé sous mon nom d&apos;artiste,
            Voyager1, cet album est également destiné à l&apos;édition musicale. L&apos;album est sorti sous le label{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Make Me Feel&apos;</em> is a vibrant blend of Hip-Hop and RnB, released in May 2022. This album showcases my
            collaboration with international artists such as <span className="hover-green">Quincy Thompson</span>,{' '}
            <span className="hover-green">Novine</span>,<span className="hover-green">Tim Moyo</span>,{' '}
            <span className="hover-green">Julaiah</span>, and <span className="hover-green">Lou.C</span>. Signed under my artist
            name, Voyager1, this album is also intended for publishing. The album was released under the label{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 3,
    title: 'Ambient Guitar',
    img: '/img/albums/1.jpg',
    poster: 'Loïc Ghanem',
    date: 'Sept 2020',
    sortedDate: '09-2020',
    style: 'Ambient Guitar',
    listenLink: 'https://fanlink.tv/ambientguitar',
    collabName: 'Michel-Yves Kochmann',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Ambient Guitar&apos;</em> est un mélange émotionnel de sons ambiants et de mélodies de guitare. Sorti en
            septembre 2020, cet album est un effort collaboratif avec l&apos;artiste renommé{' '}
            <span className="hover-green">Michel-Yves Kochmann</span>. Signé sous mon nom d&apos;artiste, Voyager1, cet album
            était principalement destiné à l&apos;édition musicale. L&apos;album est sorti sous le label{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Ambient Guitar&apos;</em> is a soulful blend of ambient sounds and melodious guitar tunes. Released in
            September 2020, this album is a collaborative effort with renowned artist{' '}
            <span className="hover-green">Michel-Yves Kochmann</span>. Signed under my artist name, Voyager1, this album was aimed
            primarily for publishing. The album was released under the label Montmorency{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 4,
    title: 'Bass Music',
    img: '/img/albums/2.jpg',
    poster: 'Loïc Ghanem',
    date: 'Jan 2022',
    sortedDate: '01-2022',
    style: 'Bass Music',
    listenLink: 'https://fanlink.tv/Voyager1BassMusic',
    collabName: 'Olynda, Lou.C, Twild',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Bass Music&apos;</em> est un mélange diversifié de future house, bass house, DnB, psy trance et G-house, sorti
            en janvier 2022. Cet album présente des collaborations avec <span className="hover-green">Olynda, Lou.C et Twild</span>
            , et met en vedette <span className="hover-green">Lou.C, Marty Degenne et Magdala</span>. Comme mes autres œuvres, cet album
            est signé sous mon nom d&apos;artiste, Voyager1, et est également destiné à l&apos;édition. L&apos;album est sorti sous le label
            Justement Music et l&apos;éditeur <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Bass Music&apos;</em> is a diverse mix of future house, bass house, DnB, psy trance, and G-house, released
            in January 2022. This album features collaborations with <span className="hover-green">Olynda, Lou.C, and Twild</span>
            , and features <span className="hover-green">Lou.C, Marty Degenne, and Magdala</span>. Like my other works, this album
            is signed under my artist name, Voyager1, and is also intended for publishing. The album was released under the label
            Justement Music and the publisher <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 5,
    title: 'Cyberpunk',
    img: '/img/albums/3.jpg',
    poster: 'Loïc Ghanem',
    date: 'Apr 2020',
    sortedDate: '04-2020',
    style: 'Cyberpunk',
    listenLink: 'https://fanlink.tv/cyberpunkLoicGhanem',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Cyberpunk&apos;</em> est un mélange immersif de musique électronique cinématique et futuriste, rappelant
            Blade Runner, sorti en avril 2020. Ce projet, bien que principalement un album d&apos;édition, porte une touche
            profondément personnelle, le distinguant comme une bande-son potentielle pour les jeux vidéo. L&apos;album est sorti
            sous le label <a href="https://www.superpitch.co/">Superpitch</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Cyberpunk&apos;</em> is an immersive blend of futuristic, cinematic electronic music, reminiscent of Blade
            Runner, released in April 2020. This project, whilst primarily a publishing album, bears a deeply personal touch,
            making it stand out as a potential soundtrack for video games. The album was released under the label{' '}
            <a href="https://www.superpitch.co/">Superpitch</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 6,
    title: 'Get Trapped',
    img: '/img/albums/4.jpg',
    poster: 'Loïc Ghanem',
    date: 'May 2021',
    sortedDate: '05-2021',
    style: 'Hip-Hop',
    listenLink: 'https://fanlink.tv/Voyager1GetTrapped',
    collabName: 'Lou.C',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Get Trapped&apos;</em> est un mélange unique de Hip-Hop, Trap, RnB et LoFi, sorti en mai 2021. Cet album
            présente des collaborations avec <span className="hover-green">Lou.C</span> et met en vedette{' '}
            <span className="hover-green">Novine, Stige, Loris Geisen et Lou.C</span>. Signé sous mon nom d&apos;artiste, Voyager1,
            cet album est également destiné à l&apos;édition. L&apos;album est sorti sous le label{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Get Trapped&apos;</em> is a unique blend of Hip-Hop, Trap, RnB, and LoFi, released in May 2021. This album
            features collaborations with <span className="hover-green">Lou.C</span> and features{' '}
            <span className="hover-green">Novine, Stige, Loris Geisen, and Lou.C</span>. Signed under my artist name, Voyager1,
            this album is also intended for publishing. The album was released under the label{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 7,
    title: 'Pop Punk',
    img: '/img/albums/5.jpg',
    poster: 'Loïc Ghanem',
    date: 'Apr 2021',
    sortedDate: '04-2021',
    style: 'Pop Punk',
    listenLink: 'https://fanlink.tv/PopPunk',
    collabName: 'Dory-Loup, Fran Darras',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Pop Punk&apos;</em> est un mélange dynamique de pop et de punk, sorti en avril 2021. Cet album présente
            des collaborations avec <span className="hover-green">Dory-Loup</span> et{' '}
            <span className="hover-green">Fran Darras</span>. Signé sous mon nom d&apos;artiste, Voyager1, cet album est également
            destiné à l&apos;édition. L&apos;album est sorti sous le label Justement Music et l&apos;éditeur{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Pop Punk&apos;</em> is a lively blend of pop and punk, released in April 2021. This album features
            collaborations with <span className="hover-green">Dory-Loup</span> and{' '}
            <span className="hover-green">Fran Darras</span>. Signed under my artist name, Voyager1, this album is also intended
            for publishing. The album was released under the label Justement Music and the publisher{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 8,
    title: 'Hardcore',
    img: '/img/albums/hardcore.png',
    poster: 'Loïc Ghanem',
    date: 'July 2020',
    sortedDate: '07-2020',
    style: 'Hardcore',
    listenLink: 'https://fanlink.tv/hardcoreLoicghanem',
    collabName: 'Terence Langlois',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Hardcore&apos;</em> est un mélange intense de rythmes puissants, sorti en juillet 2020. Cet album
            met en lumière ma collaboration avec <span className="hover-green">Terence Langlois</span>, qui a magistralement arrangé
            la batterie, ajoutant une couche supplémentaire d&apos;intensité aux compositions. Le projet faisait partie du label
            Stereoscopic et a été publié par <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Hardcore&apos;</em> is an intense blend of powerful beats and rhythm, released in July 2020. This album
            highlights my collaboration with <span className="hover-green">Terence Langlois</span>, who masterfully arranged the
            drums, adding an extra layer of intensity to the compositions. The project was a part of the label Stereoscopic and
            published by <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 9,
    title: 'Synthwave',
    img: '/img/albums/synthwave.png',
    poster: 'Loïc Ghanem',
    date: 'Oct 2019',
    sortedDate: '10-2019',
    style: 'Synthwave',
    listenLink: 'https://fanlink.tv/loicghanemsynthwave',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Synthwave&apos;</em> est un mélange nostalgique d&apos;électro revival des années 80, sorti en octobre 2019.
            Cet album est un hommage au genre Synthwave, reflétant son style iconique. L&apos;album a été produit pour l&apos;édition
            et sorti sous le label <span className="hover-green">Stereoscopic</span> et publié par{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Synthwave&apos;</em> is a nostalgic blend of &apos;80s revival electro, released in October 2019. This album
            is an homage to the Synthwave genre, reflecting its iconic style. The album was produced for publishing and released
            under the label <span className="hover-green">Stereoscopic</span> and published by{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 10,
    title: 'Fast Metal',
    img: '/img/albums/8.jpg',
    poster: 'Loïc Ghanem',
    date: 'July 2020',
    sortedDate: '07-2020',
    style: 'Metalcore/Speed Metal',
    listenLink: 'https://fanlink.tv/FastMetal',
    collabName: 'Sham Makdessi, Terence Langlois, Aaron Matts',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Fast Metal&apos;</em> est une fusion énergique de Metalcore et Speed Metal, sortie en juillet 2020. Cet
            album résume ma collaboration avec des artistes talentueux tels que <span className="hover-green">Sham Makdessi</span>,{' '}
            <span className="hover-green">Terence Langlois</span>, qui a brillamment arrangé la batterie, et une performance en
            vedette de <span className="hover-green">Aaron Matts</span>. Cet album faisait partie du label Justement et a été
            publié par <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Fast Metal&apos;</em> is a high-energy fusion of Metalcore and Speed Metal, released in July 2020. This
            album encapsulates my collaboration with talented artists such as <span className="hover-green">Sham Makdessi</span>,{' '}
            <span className="hover-green">Terence Langlois</span>, who brilliantly arranged the drums, and a featured performance
            by <span className="hover-green">Aaron Matts</span>. This album was part of the label Justement and published by{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 11,
    title: 'Kick-ass Metal Jacket',
    img: '/img/albums/9.jpg',
    poster: 'Loïc Ghanem',
    date: 'June 2020',
    sortedDate: '06-2020',
    style: 'Metalcore',
    listenLink: 'https://fanlink.tv/Kick-assMetalJacket',
    collabName: 'Terence Langlois',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Kick-ass Metal Jacket&apos;</em> est un mélange puissant de Metalcore, sorti en juin 2020. Cet album marque
            une autre collaboration avec <span className="hover-green">Terence Langlois</span>, qui a habilement arrangé la batterie,
            ajoutant une énergie distincte aux compositions. L&apos;album faisait partie du label Superpitch et était principalement
            destiné à l&apos;édition.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Kick-ass Metal Jacket&apos;</em> is a powerful blend of Metalcore, released in June 2020. This album marks
            another collaboration with <span className="hover-green">Terence Langlois</span>, who skillfully arranged the drums,
            adding a distinct energy to the compositions. The album was part of the Superpitch label and was intended primarily
            for publishing.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 12,
    title: 'Metalcore',
    img: '/img/albums/12.jpg',
    poster: 'Loïc Ghanem',
    date: 'Mar 2019',
    sortedDate: '03-2019',
    style: 'Metalcore',
    listenLink: 'https://fanlink.tv/Metalcore',
    collabName: 'Terence, Aaron',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Metalcore&apos;</em> est un mélange puissant de metal et hardcore, sorti en mars 2019. Cet album présente
            des collaborations avec <span className="hover-green">Terence</span> et <span className="hover-green">Aaron</span> sur
            plusieurs morceaux. Signé sous mon nom d&apos;artiste, cet album a été produit pour l&apos;édition et sorti sous le label{' '}
            <span className="hover-green">Justement</span> et l&apos;éditeur{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Metalcore&apos;</em> is a potent blend of metal and hardcore, released in March 2019. This album features
            collaborations with <span className="hover-green">Terence</span> and <span className="hover-green">Aaron</span> on
            several tracks. Signed under my artist name, this album was produced for publishing and released under the label{' '}
            <span className="hover-green">Justement</span> and the publisher{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 13,
    title: 'Death Metal',
    img: '/img/albums/11.jpg',
    poster: 'Loïc Ghanem',
    date: 'Mar 2019',
    sortedDate: '03-2019',
    style: 'Death Metal',
    listenLink: 'https://fanlink.tv/Deathmetal',
    collabName: 'Terence, Aaron',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Death Metal&apos;</em> est un mélange puissant de death metal et deathcore, sorti en mars 2019. Cet album
            présente des collaborations avec <span className="hover-green">Terence</span> et{' '}
            <span className="hover-green">Aaron</span> sur plusieurs morceaux. Signé sous mon nom d&apos;artiste, cet album a été
            produit pour l&apos;édition et sorti sous le label <span className="hover-green">Justement</span> et l&apos;éditeur{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Death Metal&apos;</em> is a potent blend of death metal and deathcore, released in March 2019. This album
            features collaborations with <span className="hover-green">Terence</span> and{' '}
            <span className="hover-green">Aaron</span> on several tracks. Signed under my artist name, this album was produced for
            publishing and released under the label <span className="hover-green">Justement</span> and the publisher{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 14,
    title: 'Metalcore II',
    img: '/img/albums/metalcore2.jpg',
    poster: 'Loïc Ghanem',
    date: 'Feb 2024',
    sortedDate: '02-2024',
    style: 'Metalcore',
    listenLink: 'https://fanlink.tv/Metalcore2',
    collabName: 'Terence, Aaron',
    collabLink: '',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Metalcore II&apos;</em> est un ajout électrisant au genre Metalcore, sorti sous le label Justement
            Music par Montmorency Music Agency (MYMA) en février 2024. Cet album marque le retour de la collaboration
            dynamique de Loïc Ghanem avec des talents de l&apos;industrie ; mettant en vedette <span className="hover-green">Aaron Matts</span> au
            chant sur deux morceaux et <span className="hover-green">Terence Langlois</span> aux arrangements de batterie. Il témoigne
            de l&apos;évolution du son du Metalcore, présentant des compositions complexes et des performances vocales puissantes.
            Un incontournable pour les passionnés cherchant à plonger dans les dernières innovations du genre.
            <span className="hover-green">Justement</span> et l&apos;éditeur{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Metalcore II&apos;</em> is an electrifying addition to the Metalcore genre, released under the Justement
            Music label by Montmorency Music Agency (MYMA) in February 2024. This album sees the return of Loïc Ghanem&apos;s
            dynamic collaboration with industry talents; featuring <span className="hover-green">Aaron Matts</span> on vocals for
            two tracks and <span className="hover-green">Terence Langlois</span> on drum arrangements. It stands as a testament to
            the evolving sound of Metalcore, showcasing intricate compositions and powerful vocal performances. A must-listen for
            enthusiasts looking to dive deep into the genre&apos;s latest innovations.
            <span className="hover-green">Justement</span> and the publisher{' '}
            <a href="https://myma-music.com/">Montmorency Music Agency, MYMA</a>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 15,
    title: 'Dystopia',
    img: '/img/albums/dystopia.png',
    poster: 'Loïc Ghanem',
    date: 'Jun 2024',
    sortedDate: '06-2024',
    style: 'Cinematic Metal Ambient',
    listenLink: 'https://fanlink.tv/LoicGhanemDystopia',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Dystopia&apos;</em> marque un tournant audacieux dans le monde du metal avec une fusion unique de metal
            cinématique et ambiant, créé et interprété par Loïc Ghanem. Sorti sous le prestigieux label{' '}
            <a href="https://www.cezamemusic.com/infinity-scores-label-141693.html/">Infinity Scores</a>, fondé par{' '}
            <span className="hover-green">Gabriel Saban</span>, connu pour son influence significative dans l&apos;industrie, cet album est
            publié par <a href="https://www.cezamemusic.com/">Cezame Music Agency</a>. Sans collaboration externe, Loïc
            Ghanem démontre son talent multifacette en gérant tous les aspects de la création. &apos;Dystopia&apos; est une œuvre
            essentielle pour les passionnés de metal à la recherche de sons profonds et immersifs, mêlant force et finesse pour
            une expérience musicale épique.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&apos;Dystopia&apos;</em> marks a bold turning point in the metal world with a unique fusion of cinematic metal
            and ambient, created and performed by Loïc Ghanem. Released under the prestigious{' '}
            <a href="https://www.cezamemusic.com/infinity-scores-label-141693.html/">Infinity Scores</a> label, founded by{' '}
            <span className="hover-green">Gabriel Saban</span>, known for his significant influence in the industry, this album is
            published by <a href="https://www.cezamemusic.com/">Cezame Music Agency</a>. Without external collaboration, Loïc
            Ghanem demonstrates his multifaceted talent by handling all aspects of creation. &apos;Dystopia&apos; is an essential
            work for metal enthusiasts seeking deep and immersive sounds, blending strength and finesse for an epic musical
            experience.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 16,
    title: 'Terra',
    img: '/img/albums/terra.png',
    poster: 'Loïc Ghanem',
    date: 'Jan 2025',
    sortedDate: '01-2025',
    style: 'Ambient Orchestral',
    listenLink: 'https://fanlink.tv/LoicGhanemTerra',
    descriptions: isFr ? (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&quot;Terra&quot;</em> est un album orchestral ambiant conçu pour des visuels tournant autour de la nature, de la faune,
            de la flore et des thèmes environnementaux. Composé par <strong>Loïc Ghanem</strong>, l&apos;album est sorti sous le label{' '}
            <a href="https://www.cezamemusic.com/infinity-scores-label-141693.html/">Infinity Scores</a> et publié par{' '}
            <a href="https://www.cezamemusic.com/">Cezame Music Agency</a>.
            <br />
            Avec <em>Terra</em>, Loïc offre un voyage sonore immersif et contemplatif conçu pour enrichir la narration écologique
            et axée sur la nature.
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="descriptions">
          <p className="bigger">
            <em>&quot;Terra&quot;</em> is an ambient orchestral album crafted for visuals revolving around nature, wildlife,
            flora, and environmental themes. Composed by <strong>Loïc Ghanem</strong>, the album is released under the{' '}
            <a href="https://www.cezamemusic.com/infinity-scores-label-141693.html/">Infinity Scores</a> label and published by{' '}
            <a href="https://www.cezamemusic.com/">Cezame Music Agency</a>.
            <br />
            With <em>Terra</em>, Loïc delivers an immersive and contemplative sonic journey designed to enhance ecological and
            nature-driven storytelling.
          </p>
        </div>
      </>
    ),
  },
];
}
