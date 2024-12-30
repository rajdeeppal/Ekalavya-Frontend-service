import axios from "axios";
// import { jwtDecode } from 'jwt-decode';
const BASE_URL = "http://localhost:61002/admin"; // Update with your actual API URL http://3.111.84.98:61002/admin
const PM_BASE_URL = "http://localhost:61002/user/pm";
const BASE_PUBLIC_URL = "http://localhost:61002/self-service";

const BENEFICIARY_BASE_URL = "http://localhost:61002/beneficiary";
const SUBMIT_BASE_URL = "http://localhost:61002/ops/pm";

const getToken = () => localStorage.getItem("jwtToken");
const getAuthorizationHeader = () => {
  const token = getToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {};
};
// const userId=jwtDecode(getToken()).sub;
// Fetch all Projects created by PM **(Riya to use while add Beneficiary)
export const getUserProjects = async (userId) => {
  try {
    const response = await axios.get(`${PM_BASE_URL}/projects/${userId}`, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};

// Fetch all verticals
export const getVerticals = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/verticals`, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching verticals:", error);
    return [];
  }
};

export const getPublicVerticals = async () => {
  try {
    const response = await axios.get(`${BASE_PUBLIC_URL}/verticals`);
    return response.data;
  } catch (error) {
    console.error("Error fetching verticals:", error);
    return [];
  }
};
// Fetch components based on selected vertical
export const getComponents = async (verticalId) => {
  try {
    const response = await axios.get(`${BASE_URL}/components`, {
      params: { verticalId },
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching components:", error);
    return [];
  }
};

export const getPublicComponents = async (verticalId) => {
  try {
    const response = await axios.get(`${BASE_PUBLIC_URL}/components`, {
      params: { verticalId },
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching components:", error);
    return [];
  }
};

// Fetch All components
export const getRestrictedComponents = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/restrict/components`, {
            headers:getAuthorizationHeader()
          });
        return response.data;
    } catch (error) {
        console.error("Error fetching components:", error);
        return [];
    }
};

// Fetch components based on selected Project **(Riya to use while add Beneficiary)
export const getComponentsByProject = async (projectId) => {
  try {
    const response = await axios.get(`${PM_BASE_URL}/components`, {
      params: { projectId },
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching components:", error);
    return [];
  }
};

// Fetch activities based on selected component
export const getActivities = async (componentId) => {
  try {
    const response = await axios.get(`${BASE_URL}/activities`, {
      params: { componentId },
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

// Fetch tasks for editing
export const getTasks = async (activityId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks`, {
      params: { activityId },
      headers: getAuthorizationHeader(),
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
    const response = await axios.get(`${BASE_URL}/task/${taskId}`, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};

// Save the configuration
export const saveConfiguration = async (projectConfig) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/configuration/save`,
      projectConfig,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving configuration:", error);
  }
};

// Save the project **(Riya to use in Add Project)
export const saveBeneficiaryConfiguration = async (projectDto) => {
  try {
    const response = await axios.post(
      `${BENEFICIARY_BASE_URL}/create`,
      projectDto,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving Project:", error);
  }
};

export const saveProjectConfiguration = async (userId, projectDto) => {
  try {
    const response = await axios.post(
      `${PM_BASE_URL}/project/save/${userId}`,
      projectDto,
      {
        headers: getAuthorizationHeader(),
      }
    );
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
    const response = await axios.get(`${BASE_URL}/${projectName}`, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};

export const getBeneficiary = async (userId, data, category) => {
    try {
      const { stateName, districtName, projectName, componentName } = data;
      
      // Start building the query parameters
      let url = `http://localhost:61002/beneficiary/filter/${userId}`;
      const params = new URLSearchParams();
  
      // Add parameters if they are provided
      if (componentName) params.append("componentName", componentName);
      if (stateName) params.append("stateName", stateName);
      if (districtName) params.append("districtName", districtName);

    // Construct the final URL
    url = `${url}?${params.toString()}&projectName=${projectName}&stage=${category}`;

    // Send the request with authorization headers
    const response = await axios.get(url, {
      headers: getAuthorizationHeader(),
    });

    return response.data.beneficiaries;
  } catch (error) {
    console.error("Error fetching beneficiary:", error);
    throw error;
  }
};

export const updateActivityTask = async (taskId, object) => {
  try {
    const response = await axios.put(
      `${BENEFICIARY_BASE_URL}/addTask/${taskId}`,
      object,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching beneficiary:", error);
    throw error;
  }
};

export const newBeneficiarySubTask = async (taskId, object) => {
  try {
    const response = await axios.post(
      `${BENEFICIARY_BASE_URL}/addTaskUpdate/${taskId}`,
      object,
      {
        headers: {
          ...getAuthorizationHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching beneficiary:", error);
    throw error;
  }
};

export const deletedBeneficiaryTask = async (taskId) => {
  try {
    const response = await axios.delete(
      `${BENEFICIARY_BASE_URL}/${taskId}`,
      {
        headers:getAuthorizationHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching beneficiary:", error);
    throw error;
  }
};

export const updatedBeneficiarySubTask = async (rowId, object) => {
  try {
    const response = await axios.put(
      `${BENEFICIARY_BASE_URL}/addTaskUpdate/${rowId}`,
      object,
      {
        headers: {
          ...getAuthorizationHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching beneficiary:", error);
    throw error;
  }
};

export const updatedResubmitBeneficiarySubTask = async (rowId, object) => {
  try {
    const response = await axios.put(
      `http://localhost:61002/ops/pm/resubmit/${rowId}`,
      object,
      {
        headers: {
          ...getAuthorizationHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching beneficiary:", error);
    throw error;
  }
};

export const updatedResubmitSubTask = async (userId,rowId,remarks) => {
  try {
    const response = await axios.post(
      `http://localhost:61002/ops/user/resubmit/${userId}/${rowId}?remarks=${remarks}`,
      {
        headers: getAuthorizationHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching beneficiary:", error);
    throw error;
  }
};

export const getPaymentDetails = async (data, category) => {
  try {
    const { startDate, endDate } = data;
    
    // Start building the query parameters
    let url = `http://localhost:61002/ao/payments/pending`;
    const params = new URLSearchParams();

    // Add parameters if they are provided
    if (endDate) params.append("endDate", endDate);
    if (startDate) params.append("startDate", startDate);

  // Construct the final URL
  url = `${url}?${params.toString()}`;

  // Send the request with authorization headers
  const response = await axios.get(url, {
    headers: getAuthorizationHeader(),
  });

  return response.data;
} catch (error) {
  console.error("Error fetching beneficiary:", error);
  throw error;
}
};

export const getStateDetails = async () => {
  
    try {
        const response = await axios.get(`http://localhost:61002/api/states`,{
            headers:getAuthorizationHeader()
          });
        return response.data.states;
    } catch (error) {
        console.error('Error fetching Projects by USERID:', error);
        throw error;
    }
};

export const getDistrictDetails = async (state_id) => {
  
    try {
        const response = await axios.get(`http://localhost:61002/api/districts/${state_id}`,{
            headers:getAuthorizationHeader()
          });
        return response.data.districts;
    } catch (error) {
        console.error('Error fetching Projects by USERID:', error);
        throw error;
    }
};

export const getAadharDetails = async (aadhar_id) => {
  try {
    const response = await axios.get(
      `${BENEFICIARY_BASE_URL}/search/beneficiary-aadhar/${aadhar_id}`,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};

export const uploadDetails = async (userId, object) => {
  try {
    const response = await axios.post(
      `${BENEFICIARY_BASE_URL}/resolution/upload/${userId}`,
      object,
      {
        headers: {
          ...getAuthorizationHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};

export const getUploadDetails = async (projectName) => {
  try {
    const response = await axios.get(
      `${BENEFICIARY_BASE_URL}/resolution/view?projectName=${projectName}`,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};

export const submitDetails = async (object) => {
  try {
    const response = await axios.post(
      `${SUBMIT_BASE_URL}/sanction/submit`,object,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};

export const bulkSubmitDetails = async (object) => {
  try {
    const response = await axios.post(
      `${SUBMIT_BASE_URL}/sanction/bulkSubmit`,object,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};

export const submitInProgressDetails = async (object) => {
  try {
    const response = await axios.post(
      `${SUBMIT_BASE_URL}/inprogress/submit`,object,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};

export const bulkInProgressSubmitDetails = async (object) => {
  try {
    const response = await axios.post(
      `${SUBMIT_BASE_URL}/inprogress/bulkSubmit`,object,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};

export const domainDetails = async (taskId) => {
  try {
    const response = await axios.get(
      `http://localhost:61002/user/search/domain-expert/${taskId}`,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};


export const approveDomainDetails = async (employeeId,taskId,remarks) => {
  try {
    const response = await axios.post(
      `http://localhost:61002/ops/user/approve/${employeeId}/${taskId}?remarks=${remarks}`,
       null, // No request body
            {
              headers: {
                ...getAuthorizationHeader() // Authorization headers
              }
            }
          );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by approveDomainDetails:", error);
    throw error;
  }
};

export const rejectDomainDetails = async (employeeId,taskId,remarks) => {
  try {
    const response = await axios.post(
      `http://localhost:61002/ops/user/rejection/${employeeId}/${taskId}?remarks=${remarks}`, // URL
      null, // No request body
      {
        headers: {
          ...getAuthorizationHeader() // Authorization headers
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by approveDomainDetails:", error);
    throw error;
  }
};

export const generatedVoucherDetails = async (object) => {
  try {
    const response = await axios.post(
      `http://localhost:61002/ao/voucher/generate`, // URL
      object, // No request body
      {
        headers: getAuthorizationHeader(),
        responseType: 'blob',
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by generatedVoucherDetails:", error);
    throw error;
  }
};