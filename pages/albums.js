import Seo from "../components/Seo";
import Albums from "../components/album/Albums";

const index = () => {
  return (
    <>
      <Seo pageTitle="Blog" />
      {/* End page title for seo */}

      {/* END LEFT MENU CONTENT */}

      {/* START RIGHT PART CONTENT */}
      <div className="rightpart">
        <div className="rightpart_in">
          <div className="tokyo_tm_section">
            <div data-aos="fade-right" data-aos-duration="1200">
              <div className="container">
                <div className="tokyo_tm_news">
                  <div className="tokyo_tm_title">
                    <div className="title_flex">
                      <div className="left">
                        <span>Latest</span>
                        <h3> Albums</h3>
                      </div>
                    </div>
                  </div>
                  {/* END TITLE */}
                  <Albums />
                </div>
              </div>
              {/* End .container */}
            </div>
          </div>
        </div>
      </div>
      {/* END RIGHT PART CONTENT */}
    </>
  );
};

export default index;
