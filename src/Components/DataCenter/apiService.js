import axios from 'axios';

const BASE_URL = 'http://localhost:8080/admin'; // Update with your actual API URL
const PM_BASE_URL = 'http://localhost:8080/user/pm';

// Fetch all Projects created by PM **(Riya to use while add Beneficiary)
export const getUserProjects = async (userId) => {
    try {
        const response = await axios.get(`${PM_BASE_URL}/projects/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Projects by USERID:', error);
        throw error;
    }
};

// Fetch all verticals
export const getVerticals = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/verticals`);
        return response.data;
    } catch (error) {
        console.error("Error fetching verticals:", error);
        return [];
    }
};

// Fetch components based on selected vertical
export const getComponents = async (vertical) => {
    try {
        const response = await axios.get(`${BASE_URL}/components`, { params: { vertical } });
        return response.data;
    } catch (error) {
        console.error("Error fetching components:", error);
        return [];
    }
};

// Fetch components based on selected Project **(Riya to use while add Beneficiary)
export const getComponentsByProject = async (project) => {
    try {
        const response = await axios.get(`${PM_BASE_URL}/components`, { params: { project } });
        return response.data;
    } catch (error) {
        console.error("Error fetching components:", error);
        return [];
    }
};

// Fetch activities based on selected component
export const getActivities = async (component) => {
    try {
        const response = await axios.get(`${BASE_URL}/activities`, { params: { component } });
        return response.data;
    } catch (error) {
        console.error("Error fetching activities:", error);
        return [];
    }
};

// Fetch tasks for editing
export const getTasks = async (activity) => {
    try {
        const response = await axios.get(`${BASE_URL}/tasks`, { params: { activity } });
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
};

// Fetch tasks by its ID for editing
export const getTaskById = async (taskId) => {
    try {
        const response = await axios.get(`${BASE_URL}/task/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        throw error;
    }
};

// Save the configuration
export const saveConfiguration = async (projectConfig) => {
    try {
        const response = await axios.post(`${BASE_URL}/configuration/save`, projectConfig);
        return response.data;
    } catch (error) {
        console.error("Error saving configuration:", error);
    }
};

// Save the project **(Riya to use in Add Project)
export const saveBeneficiaryConfiguration = async (projectDto) => {
    try {
        const response = await axios.post(`${PM_BASE_URL}/project/save`, projectDto);
        return response.data;
    } catch (error) {
        console.error("Error saving Project:", error);
    }
};

// Update an existing task
export const updateTask = async (taskId, updatedTask) => {
    try {
        await axios.put(`${BASE_URL}/task/${taskId}`, updatedTask, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error updating task:", error);
    }
};

export const getBeneficiary = async (projectName) => {
    try {
        const response = await axios.get(`${BASE_URL}/${projectName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        throw error;
    }
};
