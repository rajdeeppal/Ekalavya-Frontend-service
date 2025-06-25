import "./sidebar.scss";
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

const Sidebar = () => {

  const navigate = useNavigate();

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
            <NavLink to="/VCS/dashboard" style={({ isActive }) => ({
              textDecoration: "none",
              // backgroundColor: isActive ? '#dcdcdc' : 'transparent',
              backgroundColor: isActive ? '#ece8ff' : 'transparent',
              borderRadius: "10px 0px 0px 10px ",
              padding: "10px 4px",
              width: "100%",
              margin: isActive ? 'margin: 5px 0px 5px 5px' : "0px",
            })} >
              <PendingIcon className="icon" style={{ color: "black" }} />
              <span>Approval Center</span>
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
