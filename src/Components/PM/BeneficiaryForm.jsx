import React, { useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, Button, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import ActivityIframe from './ActivityIframe';
import { getVerticals, getComponents, getActivities, getTasks, saveBeneficiaryConfiguration } from '../DataCenter/apiService';

const BeneficiaryForm = ({ projects, addBeneficiary }) => {
  const [beneficiary, setBeneficiary] = useState({
    beneficiaryName: '',
    guardianName: '',
    villageName: '',
    mandalName: '',
    districtName: '',
    state: '',
    aadhar: '',
    surveyNo: '',
  });

  const [verticals, setVerticals] = useState([]);
  const [components, setComponents] = useState([
  
  ]);
  const [activities, setActivities] = useState([
   
  ]);
  const [tasks, setTasks] = useState([
  ]);

  const [selectedVertical, setSelectedVertical] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [taskDetails, setTaskDetails] = useState({});
  const [typeOfUnit, setTypeOfUnit] = useState('');
  const [unitRate, setUnitRate] = useState('');
  const [errors, setErrors] = useState({}); // State to track input validation errors

  useEffect(() => {
    async function fetchVerticals() {
      const data = await getVerticals();
      setVerticals(Array.isArray(data) ? data : []);
    }
    fetchVerticals();
  }, []);

  useEffect(() => {
    async function fetchComponents() {
      if (!selectedVertical) return;
      const data = await getComponents(selectedVertical);
      setComponents(Array.isArray(data) ? data : []);
    }
    fetchComponents();
  }, [selectedVertical]);

  useEffect(() => {
    async function fetchActivities() {
      if (!selectedComponent) return;
      try {
        const data = await getActivities(selectedComponent);
        setActivities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    }
    fetchActivities();
  }, [selectedComponent]);

  useEffect(() => {
    async function fetchTasks() {
      if (!selectedActivity) return;
      try {
        const data = await getTasks(selectedActivity);
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching Tasks:', error);
      }
    }
    fetchTasks();
  }, [selectedActivity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBeneficiary({ ...beneficiary, [name]: value });

    // Clear the specific error when input value changes
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    // Check if all fields are filled
    let formErrors = {};
    if (!selectedVertical) formErrors.selectedVertical = 'Project name is required';
    if (!beneficiary.beneficiaryName) formErrors.beneficiaryName = 'Beneficiary name is required';
    if (!beneficiary.guardianName) formErrors.guardianName = 'Father/Husband name is required';
    if (!beneficiary.villageName) formErrors.villageName = 'villageName is required';
    if (!beneficiary.mandalName) formErrors.mandalName = 'mandalName is required';
    if (!beneficiary.districtName) formErrors.districtName = 'districtName is required';
    if (!beneficiary.state) formErrors.state = 'State is required';
    if (!beneficiary.aadhar) formErrors.aadhar = 'Aadhar is required';
    if (!beneficiary.surveyNo) formErrors.surveyNo = 'Survey number is required';
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
      districtName: '',
      state: '',
      aadhar: '',
      surveyNo: '',
    });
    setSelectedVertical('');
    setSelectedComponent('');
    setSelectedActivity('');
    setSelectedTask('');
    setShowActivityDropdown(false);
    setShowTaskDropdown(false);
    setShowIframe(false);

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

    if (!validateForm()) return;

    const projectConfig = {
      projectName: selectedVertical,
      ...beneficiary,
      componentName: selectedComponent,
      activityName: selectedActivity,
      taskName: selectedTask,
      ...task,
    };

    console.log(projectConfig);
    await saveBeneficiaryConfiguration(projectConfig);
    setShowIframe(false);
    // setSelectedVertical('');
    // setSelectedComponent('');
    // setSelectedActivity('');
    // setSelectedTask('');
    // setShowActivityDropdown(false);
    // setShowTaskDropdown(false);
    // addBeneficiary(beneficiary);
  };

  return (
    
        <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Project Name</InputLabel>
            <Select
              name="projectName"
              value={selectedVertical}
              onChange={(e) => {
                setSelectedVertical(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, selectedVertical: '' }));
              }}
              required
            >
              <MenuItem value="">Select Project</MenuItem>
              {verticals.map((project) => (
                <MenuItem key={project.id} value={project.verticalName}>
                  {project.verticalName}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedVertical && <Alert severity="error">{errors.selectedVertical}</Alert>}
          </FormControl>

          <TextField
            fullWidth
            label="Beneficiary Name"
            name="beneficiary"
            placeholder="Beneficiary Name"
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.beneficiaryName}
            helperText={errors.beneficiaryName}
          />

          <TextField
            fullWidth
            label="Father/Husband Name"
            name="guardianName"
            placeholder="Father/Husband Name"
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.guardianName}
            helperText={errors.guardianName}
          />

          <TextField
            fullWidth
            label="villageName"
            name="villageName"
            placeholder="villageName"
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.villageName}
            helperText={errors.villageName}
          />

          <TextField
            fullWidth
            label="mandalName"
            name="mandalName"
            placeholder="mandalName"
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.mandalName}
            helperText={errors.mandalName}
          />

          <TextField
            fullWidth
            label="districtName"
            name="districtName"
            placeholder="districtName"
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.districtName}
            helperText={errors.districtName}
          />

          <TextField
            fullWidth
            label="State"
            name="state"
            placeholder="State"
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.state}
            helperText={errors.state}
          />

          <TextField
            fullWidth
            label="Aadhar"
            name="aadhar"
            placeholder="Aadhar"
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.aadhar}
            helperText={errors.aadhar}
          />

          <TextField
            fullWidth
            label="Survey No."
            name="surveyNo"
            placeholder="Survey No"
            onChange={handleChange}
            margin="normal"
            required
            error={!!errors.surveyNo}
            helperText={errors.surveyNo}
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
      
  );
};

// {
//   "aadhar":"qw33",
//   "activityName":"OK",
//   "beneficiary":"qwe",
//   "beneficiaryContribution":"324",
//   "componentName":"AIB",
//   "districtName":"qw33",
//   "guardianName":"qw",
//   "grantAmount":"35",
//   "mandalName":"qw",
//   "nameOfWork":"34",
//   "noOfUnits":"324",
//   "state":"other",
//   "surveyNo":"qw",
//   "task":"VOICE",
//   "taskName":"VOICE",
//   "totalCost":"324",
//   "typeOfUnit":"10",
//   "unitRate":"800",
//   "verticalName":"AIB",
//   "villageName":"qw",
//   "yearOfSanction":"345"
// }

export default BeneficiaryForm;
