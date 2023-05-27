import Seo from "../components/Seo";
import Albums from "../components/album/Albums";
import Sidebar from "../components/sidebar/Sidebar";

const index = () => {
  return (
    <>
      <Seo pageTitle="Blog" />
      {/* End page title for seo */}

      <Sidebar />
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
                        <span>Hot tracks</span>
                        <h3>Latest Albums</h3>
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
