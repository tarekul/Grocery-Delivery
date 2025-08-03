import { useEffect, useState } from "react";
import missionImage from "./mission.png";
import "./mission.styles.css";

const Mission = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mission-container">
      {loaded && (
        <>
          <h2 className="mission-title">Our Mission</h2>
          <p className="mission-description">
            We bridge the gap between beloved local grocery stores and their
            customers through modern delivery solutions. Our mission is twofold:
            to help traditional local grocers embrace the digital age without
            the technical hurdles, and to ensure customers can continue
            supporting their favorite local stores regardless of distance.
          </p>
        </>
      )}
      <img
        className="mission-image"
        src={missionImage}
        alt="Grocery Store"
        onLoad={() => setLoaded(true)}
      />
      {loaded && (
        <>
          <p className="mission-description">
            By providing a simple, accessible platform, we empower local grocery
            stores to extend their reach beyond physical boundaries while
            helping customers maintain their connection to the local businesses
            they trust and value. Together, we're preserving the heart of local
            commerce while making it more convenient for everyone.
          </p>
        </>
      )}
    </div>
  );
};

export default Mission;
