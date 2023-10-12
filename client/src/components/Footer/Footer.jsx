import Heading from "../Header/Heading";
import "./footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="footer__container__row">
          <div className="col-fot1">
            <Heading />
          </div>
          <div className="col-fot5">
            <h4 className="footer-title">Newsletter</h4>
            <div className="footer-email">
              <p>
                Subscribe to our newsletter system now to get latest news from
                us
              </p>
              <form className="footer-email-form ">
                <input type="email" placeholder="Enter your email" />
                <div>
                  <button className="footer-email-submit">Subscribe now</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
