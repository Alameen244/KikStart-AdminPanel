import { Box } from '@mui/material'
import React, { Children } from 'react'
import Sidebar from '../../Dashboard/Sidebar/Sidebar'
import Footer from '../../Dashboard/Footer/Footer'
import styled from '@emotion/styled'
import { Outlet } from "react-router-dom";


export default function DashboardSection({children}) {
  return (
    <DashboardSectionWrap sx = {{display:"flex"}}>
      
      <div className="main-sidebar">
        <Sidebar/>
      </div>
      <Box sx = {{flex:1}} className = "main_body">
        <div className="main_content">
          <Outlet/>
        </div>
        {/* <Footer/> */}
      </Box>
    </DashboardSectionWrap>
  )
}
const DashboardSectionWrap = styled(Box)`

.main_content{
border:1px solid black;
width: calc(100% - 300px);
margin-left:auto;
padding-left: 0;
}
.main-sidebar{
position:fixed;
top:0;
left:0;
width:300px;
background-color:#FFFFFF;
}


`

