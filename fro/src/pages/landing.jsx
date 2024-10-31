// LandingPage.jsx
import React from 'react';
import "../App.css";
import { Link } from 'react-router-dom';
import styles from "../styles/Landing.module.css"; 

export default function LandingPage() {
  return (
    <div className='landingPageContainer'>
      <nav className={styles.navbar}>
        <div className={styles.navHeader}>
          <h2>Zoomify</h2>
        </div>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/auth" className={styles.navLink}>
              Join as Guest
            </Link>
            <span className={styles.comingSoon}>Coming Soon</span>
          </li>
          <li className={styles.navItem}>
            <Link to="/auth" className={styles.navLink}>
              Register
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/auth" className={styles.navLink}>
              Login
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.landingMainContainer}>
        <div className={styles.warningMessage}>
          ⚠️ For the best experience, please use a laptop or desktop device.
        </div>
        <div className={styles.textContainer}>
          <h1>
            <span className={styles.highlightedText}>
              Cherish the connections that matter most
            </span>
          </h1>
          <p>Cover your distance with Zoomify!</p>
          <div className={styles.getStartedButton}>
            <Link to="/auth" className={styles.link}>
              Get Started
            </Link>
          </div>
        </div>
        <div className={styles.landingImages}>
          <img
            src="/svgs/meeting1.svg"
            alt="People in a meeting"
            className={styles.responsiveImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/svgs/default.svg";
            }}
          />
        </div>
      </div>
    </div>
  );
}