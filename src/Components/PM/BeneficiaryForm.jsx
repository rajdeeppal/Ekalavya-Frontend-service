import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Container, Dialog, DialogTitle, DialogContent, Button, TextField, FormControl, InputLabel, Select, MenuItem, Alert, Autocomplete, CircularProgress } from '@mui/material';
import ActivityIframe from './ActivityIframe';
import { getAadharDetails, getStateDetails, getDistrictDetails, getUserProjects, getComponentsByProject, getActivities, getTasks, saveBeneficiaryConfiguration, searchBeneficiariesByAadhar } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

const BeneficiaryForm = ({ addBeneficiary }) => {
  const { userId } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [beneficiary, setBeneficiary] = useState({
    beneficiaryName: '',
    guardianName: '',
    villageName: '',
    mandalName: '',
    districtName: '',
    stateName: '',
    aadharNumber: '',
    surveyNumber: '',
  });

  const [projects, setProjects] = useState([]);
  const [components, setComponents] = useState([

  ]);
  const [activities, setActivities] = useState([

  ]);
  const [tasks, setTasks] = useState([
  ]);

  const [selectedProject, setSelectedProject] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [taskDetails, setTaskDetails] = useState({});
  const [typeOfUnit, setTypeOfUnit] = useState('');
  const [unitRate, setUnitRate] = useState('');
  const [states, setStates] = useState([]);
  const [district, setDistrict] = useState([]);
  const [errors, setErrors] = useState({}); 
  const [aadharDetails, setAadharDetails] = useState({});
  const [beneficiarySearchResults, setBeneficiarySearchResults] = useState([]);
  const [beneficiarySearchLoading, setBeneficiarySearchLoading] = useState(false);
  const [showEditFields, setShowEditFields] = useState(false);
  const [aadharSearchCompleted, setAadharSearchCompleted] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      const data = await getUserProjects(userId);
      setProjects(Array.isArray(data) ? data : []);
    }
    fetchProjects();
  }, [userId]);

  useEffect(() => {
    async function fetchStates() {
      const data = await getStateDetails();
      setStates(Array.isArray(data) ? data : []);
      console.log(states);
    }
    fetchStates();
  }, []);

  useEffect(() => {
    async function fetchDistricts() {
      if (!beneficiary.stateName) return;
      const state = states.find(s => s.state_name === beneficiary.stateName);
      if (state) {
        const data = await getDistrictDetails(state.id);
        setDistrict(Array.isArray(data) ? data : []);
      }
    }
    fetchDistricts();
  }, [beneficiary.stateName, states]);

  useEffect(() => {
    async function fetchComponents() {
      const id=projects.find(item => item.projectName === selectedProject)?.id;
      if (!selectedProject) return;
      const data = await getComponentsByProject(id);
      setComponents(Array.isArray(data) ? data : []);
    }
    fetchComponents();
  }, [selectedProject,projects]);

  useEffect(() => {
    async function fetchActivities() {
      const id=components.find(item => item.componentName === selectedComponent)?.id;
      if (!selectedComponent) return;
      try {
        const data = await getActivities(id);
        setActivities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    }
    fetchActivities();
  }, [selectedComponent, components]);

  useEffect(() => {
    async function fetchTasks() {
      const id=activities.find(item => item.activityName === selectedActivity)?.id;
      if (!selectedActivity) return;
      try {
        const data = await getTasks(id);
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching Tasks:', error);
      }
    }
    fetchTasks();
  }, [selectedActivity, activities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBeneficiary({ ...beneficiary, [name]: value });

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleAadharSearch = async (searchValue) => {
    if (!searchValue || searchValue.length < 2) {
      setBeneficiarySearchResults([]);
      if (!searchValue) {
        setBeneficiary({
          beneficiaryName: '',
          guardianName: '',
          villageName: '',
          mandalName: '',
          districtName: '',
          stateName: '',
          aadharNumber: '',
          surveyNumber: '',
        });
        setShowEditFields(false);
        setAadharSearchCompleted(false);
      }
      return;
    }
    
    if (searchValue.length === 12) {
      setAadharSearchCompleted(true);
      setBeneficiary(prev => ({ ...prev, aadharNumber: searchValue }));
      setBeneficiarySearchLoading(true);
      try {
        const response = await searchBeneficiariesByAadhar(searchValue, 0, 10);
        setBeneficiarySearchResults(response.content || []);
        if (!response.content || response.content.length === 0) {
          setShowEditFields(true);
        }
      } catch (error) {
        console.error('Error searching beneficiaries:', error);
        setBeneficiarySearchResults([]);
        setShowEditFields(true);
      } finally {
        setBeneficiarySearchLoading(false);
      }
    } else if (searchValue.length >= 2) {
      setBeneficiarySearchLoading(true);
      try {
        const response = await searchBeneficiariesByAadhar(searchValue, 0, 10);
        setBeneficiarySearchResults(response.content || []);
      } catch (error) {
        console.error('Error searching beneficiaries:', error);
        setBeneficiarySearchResults([]);
      } finally {
        setBeneficiarySearchLoading(false);
      }
    }
  };

  const handleBeneficiarySelect = async (beneficiaryData) => {
    if (!beneficiaryData) return;

    setAadharSearchCompleted(true);
    try {
      const fullData = await getAadharDetails(beneficiaryData.aadharNumber);
      
      const hasEmptyFields = !fullData.beneficiaryName || !fullData.guardianName || 
                            !fullData.villageName || !fullData.mandalName || 
                            !fullData.stateName || !fullData.districtName;

      setBeneficiary({
        ...beneficiary,
        beneficiaryName: fullData.beneficiaryName || '',
        guardianName: fullData.guardianName || '',
        villageName: fullData.villageName || '',
        mandalName: fullData.mandalName || '',
        stateName: fullData.stateName || '',
        districtName: fullData.districtName || '',
        aadharNumber: fullData.aadharNumber || '',
        surveyNumber: fullData.surveyNumber || ''
      });

      setShowEditFields(hasEmptyFields);
    } catch (error) {
      console.error('Error fetching full beneficiary details:', error);
      const hasEmptyFields = !beneficiaryData.beneficiaryName || !beneficiaryData.guardianName || 
                            !beneficiaryData.villageName || !beneficiaryData.mandalName || 
                            !beneficiaryData.stateName || !beneficiaryData.districtName;

      setBeneficiary({
        ...beneficiary,
        beneficiaryName: beneficiaryData.beneficiaryName || '',
        guardianName: beneficiaryData.guardianName || '',
        villageName: beneficiaryData.villageName || '',
        mandalName: beneficiaryData.mandalName || '',
        stateName: beneficiaryData.stateName || '',
        districtName: beneficiaryData.districtName || '',
        aadharNumber: beneficiaryData.aadharNumber || '',
        surveyNumber: beneficiaryData.surveyNumber || ''
      });

      setShowEditFields(hasEmptyFields);
    }
  };
  

  const validateForm = () => {
    // Check if all fields are filled
    let formErrors = {};
    if (!selectedProject) formErrors.selectedProject = 'Project name is required';
    if (!beneficiary.beneficiaryName) formErrors.beneficiaryName = 'Beneficiary name is required';
    if (!beneficiary.guardianName) formErrors.guardianName = 'Father/Husband name is required';
    if (!beneficiary.villageName) formErrors.villageName = 'villageName is required';
    if (!beneficiary.mandalName) formErrors.mandalName = 'mandalName is required';
    if (!beneficiary.districtName) formErrors.districtName = 'districtName is required';
    if (!beneficiary.stateName) formErrors.state = 'State is required';
    if (!beneficiary.aadharNumber) formErrors.aadharNumber = 'aadharNumber is required';
    if (!beneficiary.surveyNumber) formErrors.surveyNumber = 'Survey number is required';
    if (!selectedComponent) formErrors.selectedComponent = 'Component is required';
    if (!selectedActivity) formErrors.selectedActivity = 'Activity is required';
    if (!selectedTask) formErrors.selectedTask = 'Task is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSaveBeneficiary = async () => {

    setBeneficiary({
      beneficiaryName: '',
      guardianName: '',
      villageName: '',
      mandalName: '',
      aadharNumber: '',
      surveyNumber: '',
    });
    setSelectedProject('');
    setSelectedComponent('');
    setSelectedActivity('');
    setSelectedTask('');
    setShowActivityDropdown(false);
    setShowTaskDropdown(false);
    setShowIframe(false);
    setShowEditFields(false);
    setBeneficiarySearchResults([]);
    setAadharSearchCompleted(false);

  };

  const handleComponentSelect = (e) => {
    setSelectedComponent(e.target.value);
    setShowActivityDropdown(true);
    setErrors((prevErrors) => ({ ...prevErrors, selectedComponent: '' }));
  };

  const handleActivitySelect = (e) => {
    setSelectedActivity(e.target.value);
    setShowTaskDropdown(true);
    setErrors((prevErrors) => ({ ...prevErrors, selectedActivity: '' }));
  };

  const handleTaskSelect = (e) => {
    const taskName = e.target.value;
    setSelectedTask(taskName);
    const task2 = tasks.find((task) => task.taskName === taskName);
    if (task2) {
      setTypeOfUnit(task2.units || '');
      setUnitRate(task2.ratePerUnit || '');
    } else {
      setTypeOfUnit('');
      setUnitRate('');
    }
    setShowIframe(true);
    setErrors((prevErrors) => ({ ...prevErrors, selectedTask: '' }));
  };

  const handleAddTask = async (task) => {
    console.log("Click");
    setTaskDetails(task);

    if (!validateForm()) return;
    console.log(selectedComponent);

    const projectConfig = {
      projectName: selectedProject,
      beneficiaryName: beneficiary.beneficiaryName,
      guardianName: beneficiary.guardianName,
      villageName: beneficiary.villageName,
      mandalName: beneficiary.mandalName,
      districtName: beneficiary.districtName,
      stateName: beneficiary.stateName,
      aadharNumber: parseInt(beneficiary.aadharNumber, 10),
      surveyNumber: beneficiary.surveyNumber,
      componentName: selectedComponent,
      activityName: selectedActivity,
      taskName: selectedTask,
      beneficiaryContribution: parseFloat(task.beneficiaryContribution),
      grantAmount: parseFloat(task.grantAmount),
      units: parseFloat(task.noOfUnits),
      totalCost: parseFloat(task.totalCost),
      typeOfUnit: task.typeOfUnit,
      ratePerUnit: parseFloat(task.ratePerUnit),
      yearOfSanction: parseInt(task.yearOfSanction, 10),
      financialExtension: task.financialExtension,
    };

    console.log(projectConfig);
    try {
      const response  = await saveBeneficiaryConfiguration(projectConfig);
      enqueueSnackbar('Beneficiary and Task saved successfully!', { variant: 'success' });
      setTaskDetails({});
    } catch (error) {
      console.error('Error saving beneficiary and task:', error);
      enqueueSnackbar('Failed to save. Please try again.', { variant: 'error' });
    }
  };

  return (
    <Container sx={{ maxHeight: '80vh', overflowY: 'auto', p: 2 }}>
      <Box >
        <FormControl fullWidth margin="normal">
          <InputLabel>Project Name</InputLabel>
          <Select
            name="projectName"
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, selectedVertical: '' }));
            }}
            required
          >
            <MenuItem value="">Select Project</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.projectName}>
                {project.projectName}
              </MenuItem>
            ))}
          </Select>
          {errors.selectedProject && <Alert severity="error">{errors.selectedProject}</Alert>}
        </FormControl>

        <Box display="flex" alignItems="center" gap={1} mt={2}>
          <Autocomplete
            fullWidth
            freeSolo
            options={beneficiarySearchResults}
            loading={beneficiarySearchLoading}
            getOptionLabel={(option) => option.aadharNumber || ''}
            onInputChange={(event, value) => handleAadharSearch(value)}
            onChange={(event, value) => handleBeneficiarySelect(value)}
            renderOption={(props, option) => (
              <li {...props}>
                <div>
                  <div><strong>{option.aadharNumber}</strong></div>
                  <div style={{ fontSize: '0.85em', color: '#666' }}>
                    {option.beneficiaryName} - {option.villageName}
                  </div>
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Aadhar Number"
                name="aadharNumber"
                placeholder="Search Aadhar Number"
                margin="normal"
                required
                error={!!errors.aadharNumber}
                helperText={errors.aadharNumber}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {beneficiarySearchLoading ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>

        <TextField
          fullWidth
          label="Beneficiary Name"
          name="beneficiaryName"
          placeholder="Beneficiary Name"
          onChange={handleChange}
          value={beneficiary.beneficiaryName}
          margin="normal"
          required
          error={!!errors.beneficiaryName}
          helperText={errors.beneficiaryName}
          disabled={!aadharSearchCompleted || (beneficiary.beneficiaryName && !showEditFields)}
        />

        <TextField
          fullWidth
          label="Father/Husband Name"
          name="guardianName"
          placeholder="Father/Husband Name"
          value={beneficiary.guardianName}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.guardianName}
          helperText={errors.guardianName}
          disabled={!aadharSearchCompleted || (beneficiary.guardianName && !showEditFields)}
        />

        <TextField
          fullWidth
          label="villageName"
          name="villageName"
          placeholder="villageName"
          value={beneficiary.villageName}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.villageName}
          helperText={errors.villageName}
          disabled={!aadharSearchCompleted || (beneficiary.villageName && !showEditFields)}
        />

        <TextField
          fullWidth
          label="mandalName"
          name="mandalName"
          placeholder="mandalName"
          value={beneficiary.mandalName}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.mandalName}
          helperText={errors.mandalName}
          disabled={!aadharSearchCompleted || (beneficiary.mandalName && !showEditFields)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>State Name</InputLabel>
          <Select
            name="stateName"
            value={beneficiary.stateName}
            onChange={handleChange}
            required
            disabled={!aadharSearchCompleted || (beneficiary.stateName && !showEditFields)}
          >
            <MenuItem value="">Select State</MenuItem>
            {states.map((state) => (
              <MenuItem key={state.id} value={state.state_name} >
                {state.state_name}
              </MenuItem>
            ))}
          </Select>
          {/* {errors.selectedProject && <Alert severity="error">{errors.selectedProject}</Alert>} */}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>District Name</InputLabel>
          <Select
            name="districtName"
            value={beneficiary.districtName}
            onChange={handleChange}
            required
            disabled={!aadharSearchCompleted || (beneficiary.districtName && !showEditFields)}
          >
            <MenuItem value="">Select District</MenuItem>
            {district.map((district) => (
              <MenuItem key={district.id} value={district.district_name} >
                {district.district_name}
              </MenuItem>
            ))}
          </Select>
          {/* {errors.selectedProject && <Alert severity="error">{errors.selectedProject}</Alert>} */}
        </FormControl>

        <TextField
          fullWidth
          label="Survey No."
          name="surveyNumber"
          placeholder="Survey No"
          value={beneficiary.surveyNumber}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.surveyNumber}
          helperText={errors.surveyNumber}
          disabled={!aadharSearchCompleted}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Component</InputLabel>
          <Select
            value={selectedComponent}
            onChange={handleComponentSelect}
            required
          >
            <MenuItem value="">Select Component</MenuItem>
            {components.map((component) => (
              <MenuItem key={component.id} value={component.componentName}>
                {component.componentName}
              </MenuItem>
            ))}
          </Select>
          {errors.selectedComponent && <Alert severity="error">{errors.selectedComponent}</Alert>}
        </FormControl>

        {showActivityDropdown && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Add Activity</InputLabel>
            <Select
              value={selectedActivity}
              onChange={handleActivitySelect}
              required
            >
              <MenuItem value="">Select Activity</MenuItem>
              {activities.map((activity) => (
                <MenuItem key={activity.id} value={activity.activityName}>
                  {activity.activityName}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedActivity && <Alert severity="error">{errors.selectedActivity}</Alert>}
          </FormControl>
        )}

        {showTaskDropdown && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Add Task</InputLabel>
            <Select
              value={selectedTask}
              onChange={handleTaskSelect}
              required
            >
              <MenuItem value="">Select Task</MenuItem>
              {tasks.map((task) => (
                <MenuItem key={task.id} value={task.taskName}>
                  {task.taskName}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedTask && <Alert severity="error">{errors.selectedTask}</Alert>}
          </FormControl>
        )}

        {showIframe && (
          <ActivityIframe
            taskName={selectedTask}
            typeOfUnit={typeOfUnit}
            unitRate={unitRate}
            onSave={handleAddTask}
          />
        )}

        <Button variant="contained" color="primary" onClick={handleSaveBeneficiary} sx={{ mt: 2 }}>
          Reset
        </Button>

      </Box>
    </Container>
  );
};


export default BeneficiaryForm;
