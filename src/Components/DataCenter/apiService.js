import axios from "axios";
// import { jwtDecode } from 'jwt-decode';
const BASE_URL = "https://projects.ekalavya.net/api/admin"; // Update with your actual API URL https://projects.ekalavya.net/api/admin
const PM_BASE_URL = "https://projects.ekalavya.net/api/user/pm";
const GENERIC_BASE_URL = "https://projects.ekalavya.net/api/user";
const BASE_PUBLIC_URL = "https://projects.ekalavya.net/api/self-service";

const BENEFICIARY_BASE_URL = "https://projects.ekalavya.net/api/beneficiary";
const SUBMIT_BASE_URL = "https://projects.ekalavya.net/api/ops/pm";

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
    const response = await axios.get(`${GENERIC_BASE_URL}/projects/${userId}`, {
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

export const updateProjectConfiguration = async (userId, updatedProject) => {
  try {
    const response = await axios.post(
      `${PM_BASE_URL}/project/edit/${userId}`,
      updatedProject,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
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

    // Use URLSearchParams to encode all query parameters
    const params = new URLSearchParams();

    if (componentName) params.append("componentName", componentName);
    if (stateName) params.append("stateName", stateName);
    if (districtName) params.append("districtName", districtName);
    if (projectName) params.append("projectName", projectName);
    if (category) params.append("stage", category);

    const url = `${BENEFICIARY_BASE_URL}/filter/${userId}?${params.toString()}`;

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
      `https://projects.ekalavya.net/api/ops/pm/resubmit/${rowId}`,
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
      `https://projects.ekalavya.net/api/ops/user/resubmit/${userId}/${rowId}?remarks=${remarks}`,
      null, // No request body
      {
        headers: {
          ...getAuthorizationHeader() // Authorization headers
        }
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
    let url = `https://projects.ekalavya.net/api/ao/payments/pending`;
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

export const getUpdatedPaymentDetails = async (data) => {
  try {
    const { startDate, endDate } = data;
    
    // Start building the query parameters
    let url = `https://projects.ekalavya.net/api/ao/statement/view`;
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
        const response = await axios.get(`https://projects.ekalavya.net/api/states`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Projects by USERID:', error);
        throw error;
    }
};

export const getDistrictDetails = async (state_id) => {
  
    try {
        const response = await axios.get(`https://projects.ekalavya.net/api/districts/${state_id}`);
        return response.data;
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
      `https://projects.ekalavya.net/api/user/search/domain-expert/${taskId}`,
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
      `https://projects.ekalavya.net/api/ops/user/approve/${employeeId}/${taskId}?remarks=${remarks}`,
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
      `https://projects.ekalavya.net/api/ops/user/rejection/${employeeId}/${taskId}?remarks=${remarks}`, // URL
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
      `https://projects.ekalavya.net/api/ao/voucher/generate`, // URL
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

export const getVoucherDetails = async (voucher_id) => {
  try {
    const response = await axios.get(
      `https://projects.ekalavya.net/api/ao/voucher/search/${voucher_id}`,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response; // Return the full response object
  } catch (error) {
    console.error("Error fetching voucher details:", error);
    throw error; // Re-throw the error so it can be caught in the frontend
  }
};

export const getVoucherDetailsUsingId = async (voucher_id) => {
  try {
    const response = await axios.get(
      `https://projects.ekalavya.net/api/ao/voucher/click-pay/${voucher_id}`,
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response; // Return the full response object
  } catch (error) {
    console.error("Error fetching voucher details:", error);
    throw error; // Re-throw the error so it can be caught in the frontend
  }
};

export const getProfileDetails = async (userId) => {
  try {
    const response = await axios.get(
      `https://projects.ekalavya.net/api/user/profile/${userId}`,
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

export const updateProfileDetails = async (userId, profileData) => {
  try {
    const response = await axios.put(
      `https://projects.ekalavya.net/api/user/profile/${userId}`,
      profileData,
      { headers: getAuthorizationHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};



export const generatedPaymentDetails = async (object) => {
  try {
    const response = await axios.post(
      `https://projects.ekalavya.net/api/ao/payments/process`, // URL
      object, // No request body
      {
        headers: getAuthorizationHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by generatedPaymentDetails:", error);
    throw error;
  }
};

export const exportPaymentDetails = async (userId, data) => {
  try {
    const { startDate, endDate } = data;
    
    // Start building the query parameters
    let url = `https://projects.ekalavya.net/api/ao/statement/export/${userId}`;
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

export const exportCEOPaymentDetails = async (userId, data, componentName) => {
  try {
    const { startDate, endDate } = data;
    
    // Start building the query parameters
    let url = `https://projects.ekalavya.net/api/download/payee/excel/${userId}`;
    const params = new URLSearchParams();

    // Add parameters if they are provided
    if (endDate) params.append("endDate", endDate);
    if (startDate) params.append("startDate", startDate);
    if (componentName) params.append("componentName", componentName);

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

export const exportBeneficiaryDetails = async (userId, data) => {
  try {
    const { startDate, endDate, stateName, districtName, projectName, componentName } = data;
    
    // Start building the query parameters
    let url = `https://projects.ekalavya.net/api/reports/beneficiary/${userId}`;
    const params = new URLSearchParams();

    // Add parameters if they are provided
    if (projectName) params.append("projectName", projectName);
    if (componentName) params.append("componentName", componentName);
    if (stateName) params.append("stateName", stateName);
    if (districtName) params.append("districtName", districtName);
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

export const exportComponentDetails = async (userId, data) => {
  try {
    const { startDate, endDate, stateName, districtName, projectName, componentName } = data;
    
    // Start building the query parameters
    let url = `https://projects.ekalavya.net/api/reports/component/${userId}`;
    const params = new URLSearchParams();

    // Add parameters if they are provided
    if (projectName) params.append("projectName", projectName);
    if (componentName) params.append("componentName", componentName);
    if (stateName) params.append("stateName", stateName);
    if (districtName) params.append("districtName", districtName);
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

export const exportFinalPreviewDetails = async (userId, data) => {
  try {
    const { stateName, districtName, projectName, componentName } = data;
    
    // Start building the query parameters
    let url = `https://projects.ekalavya.net/api/download/beneficiary/excel/${userId}`;
    const params = new URLSearchParams();

    // Add parameters if they are provided
    if (projectName) params.append("projectName", projectName);
    if (componentName) params.append("componentName", componentName);
    if (stateName) params.append("stateName", stateName);
    if (districtName) params.append("districtName", districtName);

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

export const exportInProgressDetails = async (userId, data) => {
  try {
    const { stateName, districtName, projectName, componentName } = data;
    
    // Start building the query parameters
    let url = `https://projects.ekalavya.net/api/download/beneficiary/progress/excel/${userId}`;
    const params = new URLSearchParams();

    // Add parameters if they are provided
    if (projectName) params.append("projectName", projectName);
    if (componentName) params.append("componentName", componentName);
    if (stateName) params.append("stateName", stateName);
    if (districtName) params.append("districtName", districtName);

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

export const exportSanctionDetails = async (userId, data) => {
  try {
    const { stateName, districtName, projectName, componentName } = data;
    
    // Start building the query parameters
    let url = `https://projects.ekalavya.net/api/download/beneficiary/sanction/excel/${userId}`;
    const params = new URLSearchParams();

    // Add parameters if they are provided
    if (projectName) params.append("projectName", projectName);
    if (componentName) params.append("componentName", componentName);
    if (stateName) params.append("stateName", stateName);
    if (districtName) params.append("districtName", districtName);

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


export const getSuccessPaymentDetails = async (data, category) => {
  try {
    const { startDate, endDate } = data;
    
    // Start building the query parameters
    let url = `https://projects.ekalavya.net/api/ao/voucher/list/approve`;
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

export const getRejectPaymentDetails = async (data, category) => {
  try {
    const { startDate, endDate } = data;
    
    // Start building the query parameters
    let url = `https://projects.ekalavya.net/api/ao/voucher/list/reject`;
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

export const getVCPaymentDetails = async (data, category) => {
  try {
    const { startDate, endDate } = data;
    
    // Start building the query parameters
    let url = `https://projects.ekalavya.net/api/vc/vouchers/list`;
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

export const approveVCPaymentDetails = async (employeeId, taskId, remarks) => {
  try {
    const response = await axios.post(
      `https://projects.ekalavya.net/api/vc/vouchers/approved/${employeeId}/${taskId}?remarks=${remarks}`,
       null, // No request body
            {
              headers: {
                ...getAuthorizationHeader() // Authorization headers
              }
            }
          );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by approveVCDetails:", error);
    throw error;
  }
};

export const rejectVCPaymentDetails = async (employeeId, taskId, remarks) => {
  try {
    const response = await axios.post(
      `https://projects.ekalavya.net/api/vc/vouchers/reject/${employeeId}/${taskId}?remarks=${remarks}`,
       null, // No request body
            {
              headers: {
                ...getAuthorizationHeader() // Authorization headers
              }
            }
          );
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by approveVCDetails:", error);
    throw error;
  }
};


export const getPendingCounts = async (userId) => {
  try {
    const response = await axios.get(`${GENERIC_BASE_URL}/approval-rejection-count/${userId}`, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};


export const getAOPendingCounts = async (userId) => {
  try {
    const response = await axios.get(`https://projects.ekalavya.net/api/ao/task-count/${userId}`, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};

export const getVCPendingCounts = async (userId) => {
  try {
    const response = await axios.get(`https://projects.ekalavya.net/api/vc/vouchers/list/count/${userId}`, {
      headers: getAuthorizationHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Projects by USERID:", error);
    throw error;
  }
};
