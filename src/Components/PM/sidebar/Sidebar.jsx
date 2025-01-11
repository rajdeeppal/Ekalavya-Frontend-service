import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import PreviewIcon from '@mui/icons-material/Preview';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../images/logo.png';

const Sidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Remove JWT token from localStorage
    navigate('/'); // Redirect to the login page
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
              <ChecklistRtlIcon className="icon" style={{ color: "black" }} />
              <span>Inprogress List</span>
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
              <PlaylistRemoveIcon className="icon" style={{ color: "black" }} />
              <span>Rejection Center</span>
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
