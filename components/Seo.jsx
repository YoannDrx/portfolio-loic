import Head from "next/head";

const Seo = ({ pageTitle }) => {
  return (
    <Head>
      <title>
        {pageTitle &&
          `${pageTitle} || Tokyo - Personal Portfolio React Nextjs Template}`}
      </title>
    </Head>
  );
};

export default Seo;
