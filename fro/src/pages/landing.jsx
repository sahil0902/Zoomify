import React from 'react'
import "../App.css"
import { Link } from 'react-router-dom'
export default function LandingPage() {
  return (
    <div className='landingPageContainer'>
    <nav>
        <div className='navHeader'><h2>Zoomify</h2></div>
        <div className='navlist'>
          <p>Join as Guest</p>
          <p>Register</p>
          <div role='button'>
            <p>Login</p>
          </div>
        </div>
    </nav>

    <div className="landingMainContainer">
        <div>
            <h1><span style={{color:"#8CAAD2"}}>Cherish the connections that matter most</span></h1>
       <p>Cover your distance with Zoomify!</p>
       <div role='button'>
        <Link to={"/auth"} style={{color:"white"}}>Get Started</Link>
       </div>
        </div>
               <div className='landingImages'>
          <img src="/svgs/meeting1.svg" alt="Media" className="responsiveImage" />
        </div>
    </div>
    </div>
  )
}
