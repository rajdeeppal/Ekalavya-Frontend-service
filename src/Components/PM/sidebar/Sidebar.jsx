import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../images/logo.png';

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
         
          <Link to="/beneficiary" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon"
                style={{ color: "black" }}
              />
              <span>Beneficiary List</span>
            </li>
          </Link>
        
          <Link to="/inprogress" style={{ textDecoration: "none" }} >
            <li>
              <StoreIcon className="icon"  style={{ color: "black" }}/>
              <span>In-Progress List</span>
            </li>
          </Link>
          <Link to="/finalpreview" style={{ textDecoration: "none" }} >
            <li>
              <StoreIcon className="icon"  style={{ color: "black" }}/>
              <span>Final Preview</span>
            </li>
          </Link>
          <Link to="/resolution" style={{ textDecoration: "none" }} >
            <li>
              <StoreIcon className="icon"  style={{ color: "black" }}/>
              <span>Resolution</span>
            </li>
          </Link>
          <Link to="/rejectedList" style={{ textDecoration: "none" }} >
            <li>
              <StoreIcon className="icon"  style={{ color: "black" }}/>
              <span>Rejection List</span>
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
