import "./sidebar.scss";
import React, { useEffect, useState } from 'react';
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../images/logo.png';
import PendingIcon from '@mui/icons-material/Pending';
import { useAuth } from '../../PrivateRoute';
import { getPendingCounts } from '../../DataCenter/apiService';
import Badge from "@mui/material/Badge";

const Sidebar = ({isSuccess}) => {
const [pendingCount, setPendingCount] = useState('');
  const { userId } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
          async function fetchProjects() {
              const data = await getPendingCounts(userId);
              setPendingCount(data);
              console.log("Pending Counts:", pendingCount);
          }
          fetchProjects();
      }, [isSuccess, userId]);


  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Remove JWT token from localStorage
    navigate('/'); // Redirect to the login page
  };

  const handleProfileClick = () => {
    navigate('/myprofile'); // Redirect to My Profile page
  };

  return (
    <div className="sidebar">
      <div className="top">
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <span><img src={logo} alt="Logo" className="logo" /></span>
        </NavLink>
      </div>
      <hr />
      <div className="center">
        <ul>


          <li>
            <NavLink to="/Trustee/inprogress-list" style={({ isActive }) => ({
              textDecoration: "none",
              // backgroundColor: isActive ? '#dcdcdc' : 'transparent',
              backgroundColor: isActive ? '#ece8ff' : 'transparent',
              borderRadius: "10px 0px 0px 10px ",
              padding: "10px 4px",
              width: "100%",
              margin: isActive ? 'margin: 5px 0px 5px 5px' : "0px",
              display: "flex",
              alignItems: "center"
            })} >
               <div style={{ display: "flex", alignItems: "center" }}>
                <PendingIcon className="icon" style={{ color: "black", marginTop: "5px" }} />
                <Badge
                  badgeContent={pendingCount.approvalCount}
                  color="success"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  sx={{
                    "& .MuiBadge-badge": {
                      color: "white ! important",
                      fontSize: "0.7rem",
                      height: "16px",
                      minWidth: "16px"
                    }
                  }}
                >
                  <span style={{ "margin-left": "-2%" , paddingTop: "2px" }}>Approval Center</span>
                </Badge>
              </div>
            </NavLink>
          </li>



          <li>
            <NavLink to="/Trustee/review-list" style={({ isActive }) => ({
              textDecoration: "none",
              // backgroundColor: isActive ? '#dcdcdc' : 'transparent',
              backgroundColor: isActive ? '#ece8ff' : 'transparent',
              borderRadius: "10px 0px 0px 10px ",
              padding: "10px 4px",
              width: "100%",
              margin: isActive ? 'margin: 5px 0px 5px 5px' : "0px",
              display: "flex",
              alignItems: "center"
            })} >
             <div style={{ display: "flex", alignItems: "center" }}>
                <RateReviewOutlinedIcon className="icon" style={{ color: "black", marginTop: "5px" }} />
                <Badge
                  badgeContent={pendingCount.rejectionCount}
                  color="error"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  sx={{
                    "& .MuiBadge-badge": {
                      color: "white ! important",
                      fontSize: "0.7rem",
                      height: "16px",
                      minWidth: "16px"
                    }
                  }}
                >
                  <span style={{ "margin-left": "-2%", paddingTop: "2px" }}>Rejection Center</span>
                </Badge>
              </div>
            </NavLink>
          </li>

          <li>
            <NavLink to="/Trustee/resolution-list" style={({ isActive }) => ({
              textDecoration: "none",
              // backgroundColor: isActive ? '#dcdcdc' : 'transparent',
              backgroundColor: isActive ? '#ece8ff' : 'transparent',
              borderRadius: "10px 0px 0px 10px ",
              padding: "10px 4px",
              width: "100%",
              margin: isActive ? 'margin: 5px 0px 5px 5px' : "0px",
            })} >
              <FormatListBulletedIcon className="icon" style={{ color: "black" }} />
              <span>Resolution View</span>
            </NavLink>
          </li>

          <li> {/* Profile click handler */}
            <NavLink
              to="/myprofile"
              style={({ isActive }) => ({
                textDecoration: "none",
                // backgroundColor: isActive ? '#dcdcdc' : 'transparent',
                backgroundColor: isActive ? '#ece8ff' : 'transparent',
                borderRadius: "10px 0px 0px 10px ",
                padding: "10px 4px",
                width: "100%",
                margin: isActive ? 'margin: 5px 0px 5px 5px' : "0px",
              })}
            >
              <AccountCircleOutlinedIcon className="icon" style={{ color: "black" }} />
              <span>Profile</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                textDecoration: "none",
                // backgroundColor: isActive ? '#dcdcdc' : 'transparent',
                backgroundColor: isActive ? '#ece8ff' : 'transparent',
                borderRadius: "10px 0px 0px 10px ",
                padding: "10px 4px",
                width: "100%",
                margin: isActive ? 'margin: 5px 0px 5px 5px' : "0px",
              })}
            >
              <ExitToAppIcon className="icon" style={{ color: "black" }} />
              <span onClick={handleLogout}>Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
