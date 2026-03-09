import React from 'react'
import {Link} from 'react-router-dom'
import {List,ListItem} from '@mui/material'
import './Sidebar.scss'
import img1 from "../Header/images/Ellipse 16.png"
import logo from './images/KIKSTART logo no words Full Color (1) 1.png'

function Sidebar() {
    const logo_path = "/home"
    const options = [
        {
            image_path : img1,
            name : "Dashboard",
            path : "/dashboard"
        },
        {
            image_path : "img2",
            name : "Programs",
            path : "/programs"
        },
        {
            image_path : "img3",
            name : "Children Profile",
            path : "/children-profile"
        },
        {
            image_path : "img4",
            name : "My Transactions",
            path : "/my-transactions"
        },
        {
            image_path : "img5",
            name : "Messages",
            path : "/messages"
        },
        {
            image_path : "img6",
            name : "Logout",
            path : "/logout"
        }
    ]
  return (
    <div className='sidebar'>
        <div className="logo_img">
            <Link to={logo_path}>
                <img src={logo} alt="Logo"/>
            </Link>
        </div>
        <List>
            {
                options.map((items) => (
                    <ListItem>
                        <Link to={items.path}>
                            <div className="items">
                            <img src= {img1} alt={items.image_path} srcset="" />
                            
                                <p>{items.name}</p>
                            
                        </div>
                        </Link>
                        
                    </ListItem>
                ))
            }
        </List>
    </div>
  )
}

export default Sidebar