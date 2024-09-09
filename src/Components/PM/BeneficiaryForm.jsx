import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import ActivityIframe from './ActivityIframe';
import { getVerticals, getComponents, getActivities, getTasks, saveBeneficiaryConfiguration } from '../DataCenter/apiService';

const BeneficiaryForm = ({ projects, addBeneficiary }) => {
  const [beneficiary, setBeneficiary] = useState({
    beneficiary: '',
    fatherHusbandName: '',
    village: '',
    mandal: '',
    district: '',
    state: '',
    aadhar: '',
    surveyNo: '',
  });

  const [verticals, setVerticals] = useState([]);
  const [components, setComponents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([
    { id: 2, taskName: 'Global', units: '96', ratePerUnit: '89' },
    { id: 1, taskName: 'VOICE', units: '10', ratePerUnit: '800' },
    { id: 3, taskName: 'CV', units: '20', ratePerUnit: '700' },
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
    if (!beneficiary.beneficiary) formErrors.beneficiary = 'Beneficiary name is required';
    if (!beneficiary.fatherHusbandName) formErrors.fatherHusbandName = 'Father/Husband name is required';
    if (!beneficiary.village) formErrors.village = 'Village is required';
    if (!beneficiary.mandal) formErrors.mandal = 'Mandal is required';
    if (!beneficiary.district) formErrors.district = 'District is required';
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
      beneficiary: '',
      fatherHusbandName: '',
      village: '',
      mandal: '',
      district: '',
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
      verticalName: selectedVertical,
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
    <Container>
      <Form>
        <Form.Group>
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            as="select"
            name="projectName"
            value={selectedVertical}
            onChange={(e) => {
              setSelectedVertical(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, selectedVertical: '' }));
            }}
            required
          >
            <option value="">Select Project</option>
            {verticals.map((project) => (
              <option key={project.id} value={project.verticalName}>
                {project.verticalName}
              </option>
            ))}
          </Form.Control>
          {errors.selectedVertical && <Alert variant="danger">{errors.selectedVertical}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Beneficiary Name</Form.Label>
          <Form.Control
            name="beneficiary"
            placeholder="Beneficiary Name"
            onChange={handleChange}
            required
          />
          {errors.beneficiary && <Alert variant="danger">{errors.beneficiary}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Father/Husband Name</Form.Label>
          <Form.Control
            name="fatherHusbandName"
            placeholder="Father/Husband Name"
            onChange={handleChange}
            required
          />
          {errors.fatherHusbandName && <Alert variant="danger">{errors.fatherHusbandName}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Village</Form.Label>
          <Form.Control
            name="village"
            placeholder="Village"
            onChange={handleChange}
            required
          />
          {errors.village && <Alert variant="danger">{errors.village}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Mandal</Form.Label>
          <Form.Control
            name="mandal"
            placeholder="Mandal"
            onChange={handleChange}
            required
          />
          {errors.mandal && <Alert variant="danger">{errors.mandal}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>District</Form.Label>
          <Form.Control
            name="district"
            placeholder="District"
            onChange={handleChange}
            required
          />
          {errors.district && <Alert variant="danger">{errors.district}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>State</Form.Label>
          <Form.Control
            name="state"
            placeholder="State"
            onChange={handleChange}
            required
          />
          {errors.state && <Alert variant="danger">{errors.state}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Aadhar</Form.Label>
          <Form.Control
            name="aadhar"
            placeholder="Aadhar"
            onChange={handleChange}
            required
          />
          {errors.aadhar && <Alert variant="danger">{errors.aadhar}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Survey No.</Form.Label>
          <Form.Control
            name="surveyNo"
            placeholder="Survey No"
            onChange={handleChange}
            required
          />
          {errors.surveyNo && <Alert variant="danger">{errors.surveyNo}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Component</Form.Label>
          <Form.Control
            as="select"
            value={selectedComponent}
            onChange={handleComponentSelect}
            required
          >
            <option value="">Select Component</option>
            {components.map((component) => (
              <option key={component.id} value={component.componentName}>
                {component.componentName}
              </option>
            ))}
          </Form.Control>
          {errors.selectedComponent && <Alert variant="danger">{errors.selectedComponent}</Alert>}
        </Form.Group>

        {showActivityDropdown && (
          <Form.Group>
            <Form.Label>Add Activity</Form.Label>
            <Form.Control
              as="select"
              value={selectedActivity}
              onChange={handleActivitySelect}
              required
            >
              <option value="">Select Activity</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.activityName}>
                  {activity.activityName}
                </option>
              ))}
            </Form.Control>
            {errors.selectedActivity && <Alert variant="danger">{errors.selectedActivity}</Alert>}
          </Form.Group>
        )}

        {showTaskDropdown && (
          <Form.Group>
            <Form.Label>Add Task</Form.Label>
            <Form.Control
              as="select"
              value={selectedTask}
              onChange={handleTaskSelect}
              required
            >
              <option value="">Select Task</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.taskName}>
                  {task.taskName}
                </option>
              ))}
            </Form.Control>
            {errors.selectedTask && <Alert variant="danger">{errors.selectedTask}</Alert>}
          </Form.Group>
        )}

        {showIframe && (
          <ActivityIframe
            taskName={selectedTask}
            typeOfUnit={typeOfUnit}
            unitRate={unitRate}
            onSave={handleAddTask}
          />
        )}
      </Form>

      <Button variant="primary" onClick={handleSaveBeneficiary}>
        Reset
      </Button>
    </Container>
  );
};

export default BeneficiaryForm;
