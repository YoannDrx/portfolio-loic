import Head from "next/head";

const Seo = ({ pageTitle }) => {
  return (
    <Head>
      <title>
        {pageTitle &&
          `${pageTitle} || Loïc Ghanem Music`}
      </title>
    </Head>
  );
};

export default Seo;
