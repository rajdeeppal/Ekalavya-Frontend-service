import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
const BASE_URL = 'http://3.111.84.98:61002/admin'; // Update with your actual API URL
const PM_BASE_URL = 'http://3.111.84.98:61002/user/pm';

const BENEFICIARY_BASE_URL='http://3.111.84.98:61002/beneficiary';

const getToken = () => localStorage.getItem('jwtToken');
const getAuthorizationHeader = () => {
    const token = getToken();
    return token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }:{};
};
// const userId=jwtDecode(getToken()).sub;
// Fetch all Projects created by PM **(Riya to use while add Beneficiary)
export const getUserProjects = async (userId) => {
  
    try {
        const response = await axios.get(`${PM_BASE_URL}/projects/${userId}`,{
         headers:getAuthorizationHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Projects by USERID:', error);
        throw error;
    }
};

// Fetch all verticals
export const getVerticals = async () => {
   
    try {
        const response = await axios.get(`${BASE_URL}/verticals`,{
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error("Error fetching verticals:", error);
        return [];
    }
};

// Fetch components based on selected vertical
export const getComponents = async (vertical) => {
   
    try {
        const response = await axios.get(`${BASE_URL}/components`, { params: { vertical },
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error("Error fetching components:", error);
        return [];
    }
};

// Fetch components based on selected Project **(Riya to use while add Beneficiary)
export const getComponentsByProject = async (project) => {
    
    try {
        const response = await axios.get(`${PM_BASE_URL}/components`, { params: { project } ,
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error("Error fetching components:", error);
        return [];
    }
};

// Fetch activities based on selected component
export const getActivities = async (component) => {
 
    try {
        const response = await axios.get(`${BASE_URL}/activities`, { params: { component } ,
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error("Error fetching activities:", error);
        return [];
    }
};

// Fetch tasks for editing
export const getTasks = async (activity) => {
  
    try {
        const response = await axios.get(`${BASE_URL}/tasks`, { params: { activity } ,
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
};

// Fetch tasks by its ID for editing
export const getTaskById = async (taskId) => {

    try {
        const response = await axios.get(`${BASE_URL}/task/${taskId}`,{
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        throw error;
    }
};

// Save the configuration
export const saveConfiguration = async (projectConfig) => {
    try {
        const response = await axios.post(`${BASE_URL}/configuration/save`, projectConfig,{
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error("Error saving configuration:", error);
    }
};

// Save the project **(Riya to use in Add Project)
export const saveBeneficiaryConfiguration = async (projectDto) => {
    try {
        
        const response = await axios.post(`${BENEFICIARY_BASE_URL}/create`, projectDto,{
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error("Error saving Project:", error);
    }
};

export const saveProjectConfiguration = async (userId,projectDto) => {
    try {  
        const response = await axios.post(`${PM_BASE_URL}/project/save/${userId}`, projectDto,{
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error("Error saving Project:", error);
    }
};


// Update an existing task
export const updateTask = async (taskId, updatedTask) => {
    try {
        await axios.put(`${BASE_URL}/task/${taskId}`, updatedTask, {
            headers: getAuthorizationHeader(),
        });
    } catch (error) {
        console.error("Error updating task:", error);
    }
};

export const getBeneficiaryByProjectName = async (projectName) => {
    try {
        const response = await axios.get(`${BASE_URL}/${projectName}`,{
            headers: getAuthorizationHeader(),
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        throw error;
    }
};

export const getBeneficiary = async (userId,data) => {
    // http://localhost:61002/beneficiary/filter/1001?projectName=GTA&componentName=CON&stage=sanction
    try {
        // const response = await axios.post(`${BENEFICIARY_BASE_URL}/criteriaSearch`,object,{
        //     headers:getAuthorizationHeader()
        //   });
        console.log(data);
        const {stateName,districtName,projectName,componentName}=data;
        const response = await axios.get(`http://3.111.84.98:61002/beneficiary/filter/${userId}?projectName=${projectName}&componentName=${componentName}&stateName=${stateName}&districtName=${districtName}&stage=sanction`,{
                headers:getAuthorizationHeader()
              });
        return response.data.beneficiaries;
    } catch (error) {
        console.error('Error fetching beneficiary:', error);
        throw error;
    }
};

export const updateActivityTask = async (taskId,object)=>{
    try {
        const response = await axios.put(`${BENEFICIARY_BASE_URL}/addTask/${taskId}`,object,{
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching beneficiary:', error);
        throw error;
    }
}

export const updatedBeneficiarySubTask = async (taskId,object)=>{
    try {
        const response = await axios.post(`${BENEFICIARY_BASE_URL}/addTaskUpdate/${taskId}`,object,{
            headers:{...getAuthorizationHeader(),
                "Content-Type": "multipart/form-data"
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching beneficiary:', error);
        throw error;
    }
}

export const getStateDetails = async () => {
  
    try {
        const response = await axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/states`);
        return response.data.states;
    } catch (error) {
        console.error('Error fetching Projects by USERID:', error);
        throw error;
    }
};

export const getDistrictDetails = async (state_id) => {
  
    try {
        const response = await axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`);
        return response.data.districts;
    } catch (error) {
        console.error('Error fetching Projects by USERID:', error);
        throw error;
    }
};


export const getAadharDetails = async (aadhar_id) => {
  
    try {
        const response = await axios.get(`${BENEFICIARY_BASE_URL}/search/beneficiary-aadhar/${aadhar_id}`,{
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching Projects by USERID:', error);
        throw error;
    }
};