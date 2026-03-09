import React from 'react'
import './Header.scss'
import profile_pic from "./images/Ellipse 16.png"
function Header() {
    const name = "John"
    const page = "Initial"
  return (
    <div className='header'>
        <div className="main_content">
            <div className="page">
                {page}
            </div>
            <div className="profile">
                <img src={profile_pic} alt="" />
                <p>
                    Welcome, {name}
                </p>
            </div>
        </div>
    </div>
  )
}

export default Header