import "./sidebar.scss";
import React, { useEffect, useState } from 'react';
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import PreviewIcon from '@mui/icons-material/Preview';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../images/logo.png';
import { getPendingCounts } from '../../DataCenter/apiService';
import Badge from "@mui/material/Badge";
import { useAuth } from '../../PrivateRoute';

const Sidebar = ({ isSuccess }) => {
  const [pendingCount, setPendingCount] = useState('');
  const [showTrainingMenu, setShowTrainingMenu] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  useEffect(() => {
    async function fetchProjects() {
      const data = await getPendingCounts(userId);
      setPendingCount(data);
      console.log("Pending Counts:", pendingCount);
    }
    fetchProjects();
  }, [isSuccess, userId]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  const toggleTrainingMenu = () => {
    setShowTrainingMenu((prev) => !prev);
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
            <NavLink
              to="/beneficiary"
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
              <PersonOutlineIcon className="icon" style={{ color: "black" }} />
              <span>Sanction List</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/inprogress"
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <ChecklistRtlIcon className="icon" style={{ color: "black" }} />
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
                  <span style={{ "margin-left": "-2%", paddingTop: "2px" }}>Inprogress List</span>
                </Badge>
              </div>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/finalpreview"
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
              <PreviewIcon className="icon" style={{ color: "black" }} />
              <span>Final Preview</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/resolution"
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
              <CloudUploadIcon className="icon" style={{ color: "black" }} />
              <span>Resolution Upload</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/rejectedList"
              style={({ isActive }) => ({
                textDecoration: "none",
                // backgroundColor: isActive ? '#dcdcdc' : 'transparent',
                backgroundColor: isActive ? '#ece8ff' : 'transparent',
                borderRadius: "10px 0px 0px 10px ",
                padding: "10px 4px",
                width: "100%",

              })}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <PlaylistRemoveIcon className="icon" style={{ color: "black" }} />
                <Badge
                  badgeContent={pendingCount.rejectionCount}
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
                  <span style={{ "margin-left": "-2%", paddingTop: "2px" }}>Rejection Center</span>
                </Badge>
              </div>
            </NavLink>
          </li>

         <li
            className="training-section"
          >
            <div
              className="training-header"
              onClick={toggleTrainingMenu}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <StoreIcon className="icon" style={{ color: "black" }} />
                <span style={{ marginLeft: "8px" }}>Training Session</span>
              </div>
              {showTrainingMenu ? (
                <ExpandLessIcon className="expand-icon" />
              ) : (
                <ExpandMoreIcon className="expand-icon" />
              )}
            </div>

            {showTrainingMenu && (
              <ul className="submenu">
                <li>
                  <NavLink
                    to="/training"
                    className="submenu-link"
                    style={({ isActive }) => ({
                      textDecoration: "none",
                      // backgroundColor: isActive ? '#dcdcdc' : 'transparent',
                      backgroundColor: isActive ? '#ece8ff' : 'transparent',
                      borderRadius: "10px 0px 0px 10px ",
                      padding: "10px 4px",
                      width: "100%",

                    })}>
                    <PlaylistRemoveIcon className="icon" style={{ color: "black" }} />
                    <Badge
                      
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
                      <span style={{ "margin-left": "-2%", paddingTop: "2px" }}>Training Center</span>
                    </Badge>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/training-in-progress"
                    className="submenu-link"
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
                    <CloudUploadIcon className="icon" style={{ color: "black" }} />
                    <span>Training In Progress</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </li>



          <li> 
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
