import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { Link, useNavigate } from "react-router-dom";
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
        <Link to="/" style={{ textDecoration: "none" }}>
          <span><img src={logo} alt="Logo" className="logo" /></span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
        
          <Link to="/inprogress-list" style={{ textDecoration: "none" }} >
            <li>
              <PendingIcon className="icon"  style={{ color: "black" }}/>
              <span>InProgress Table</span>
            </li>
          </Link>

          <Link to="/review-list" style={{ textDecoration: "none" }} >
            <li>
              <RateReviewOutlinedIcon className="icon"  style={{ color: "black" }}/>
              <span>ReviewList</span>
            </li>
          </Link>

          <Link to="/resolution-list" style={{ textDecoration: "none" }} >
            <li>
              <FormatListBulletedIcon className="icon"  style={{ color: "black" }}/>
              <span>ResolutionList</span>
            </li>
          </Link>
         
          <li onClick={handleProfileClick}> {/* Profile click handler */}
            <AccountCircleOutlinedIcon className="icon" style={{ color: "black" }}/>
            <span>Profile</span>
          </li>
          <li>
            <ExitToAppIcon className="icon" style={{ color: "black" }}/>
            <span onClick={handleLogout}>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
