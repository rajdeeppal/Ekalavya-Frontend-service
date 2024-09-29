import axios from 'axios';
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
// Fetch all Projects created by PM **(Riya to use while add Beneficiary)
export const getUserProjects = async (username) => {
   
    try {
        const response = await axios.get(`${PM_BASE_URL}/projects/${username}`,{
         header:getAuthorizationHeader()
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

export const getBeneficiary = async (object) => {
    try {
        const response = await axios.post(`${BENEFICIARY_BASE_URL}/criteriaSearch`,object,{
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching beneficiary:', error);
        throw error;
    }
};

export const updateActivityTask = async (taskId,object)=>{
    try {
        const response = await axios.post(`${BENEFICIARY_BASE_URL}/addTask/${taskId}`,object,{
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching beneficiary:', error);
        throw error;
    }
}