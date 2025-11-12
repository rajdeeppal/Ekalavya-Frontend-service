import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Grid
} from '@mui/material';
import {
    getUserProjects,
    getComponentsByProject,
    getActivities,
    getTasks,
    saveTrainingConfiguration,
    saveCommonExpenditureConfiguration
} from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

const TrainingForm = ({ isTraining, isExpenditure }) => {
    const { userId } = useAuth();

    const [projects, setProjects] = useState([]);
    const [components, setComponents] = useState([]);
    const [activities, setActivities] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [formData, setFormData] = useState({
        projectName: '',
        componentName: '',
        activityName: '',
        activityCode: '',
        maleCount: '',
        femaleCount: '',
        otherCount: '',
        recourcePerson: '',
        expertSubject: '',
        taskName: '',
        typeOfUnit: '',
        units: '1',
        ratePerUnit: '',
        totalCost: '',
    });

    const [errors, setErrors] = useState({});
    const [showActivityDropdown, setShowActivityDropdown] = useState(false);
    const [showTaskDropdown, setShowTaskDropdown] = useState(false);

    useEffect(() => {
        setFormData((prev) => {
            const rate = parseFloat(prev.ratePerUnit) || 0;
            const units = parseFloat(prev.units) || 0;
            const totalCost = rate * units || '';

            return { ...prev, totalCost };
        });
    }, [formData.ratePerUnit, formData.units]);

    useEffect(() => {
        async function fetchProjects() {
            const data = await getUserProjects(userId);
            setProjects(Array.isArray(data) ? data : []);
        }
        fetchProjects();
    }, [userId]);

    useEffect(() => {
        async function fetchComponents() {
            if (!formData.projectName) return;
            const id = projects.find((p) => p.projectName === formData.projectName)?.id;
            if (!id) return;
            const data = await getComponentsByProject(id);
            setComponents(Array.isArray(data) ? data : []);
        }
        fetchComponents();
    }, [formData.projectName, projects]);

    useEffect(() => {
        async function fetchActivities() {
            if (!formData.componentName) return;
            const id = components.find((c) => c.componentName === formData.componentName)?.id;
            if (!id) return;
            const data = await getActivities(id);
            setActivities(Array.isArray(data) ? data : []);
        }
        fetchActivities();
    }, [formData.componentName, components]);

    useEffect(() => {
        async function fetchTasks() {
            if (!formData.activityName) return;
            const id = activities.find((a) => a.activityName === formData.activityName)?.id;
            if (!id) return;
            const data = await getTasks(id);
            setTasks(Array.isArray(data) ? data : []);
        }
        fetchTasks();
    }, [formData.activityName, activities]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Special validation for units field - prevent values less than 1
        if (name === 'units') {
            const numValue = parseFloat(value);
            if (value !== '' && (!isNaN(numValue) && numValue < 1)) {
                return; // Don't update state if value is less than 1
            }
        }
        
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        let formErrors = {};
        const commonFields = [
            'projectName',
            'componentName',
            'activityName',
            'activityCode',
            'taskName',
            'units',
            'ratePerUnit',
            'totalCost',
        ];

        const trainingFields = [
            'maleCount',
            'femaleCount',
            'recourcePerson',
            'expertSubject',
        ];

        const requiredFields = isTraining
            ? [...commonFields, ...trainingFields]
            : isExpenditure ? [...commonFields, 'typeOfUnit'] : commonFields;

        requiredFields.forEach((field) => {
            if (!formData[field]) formErrors[field] = `${field} is required`;
        });

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };


    const handleSave = async () => {
        if (!validateForm()) return;

        const payload = {
            projectName: formData.projectName,
            componentName: formData.componentName,
            activityName: formData.activityName,
            activityCode: formData.activityCode,
            ...(isTraining && {
                maleCount: parseInt(formData.maleCount, 10),
                femaleCount: parseInt(formData.femaleCount, 10),
                otherCount: parseInt(formData.otherCount || 0, 10),
                recourcePerson: formData.recourcePerson,
                expertSubject: formData.expertSubject,
            }),
            taskName: formData.taskName,
            ...(isExpenditure && { typeOfUnit: formData.typeOfUnit }),
            units: parseFloat(formData.units),
            ratePerUnit: parseFloat(formData.ratePerUnit),
            totalCost: parseFloat(formData.totalCost),
        };


        try {
            let response;
            if (isTraining) {
                response = await saveTrainingConfiguration(payload);
                alert('Training data saved successfully!');
            } else {
                response = await saveCommonExpenditureConfiguration(payload);
                alert('Common expenditure data saved successfully!');
            }
            console.log('Saved data:', response);
            handleReset();
        } catch (error) {
            console.error('Error saving training data:', error);
            alert('Failed to save. Please try again.');
        }
    };

    const handleReset = () => {
        setFormData({
            projectName: '',
            componentName: '',
            activityName: '',
            activityCode: '',
            maleCount: '',
            femaleCount: '',
            otherCount: '',
            recourcePerson: '',
            expertSubject: '',
            taskName: '',
            typeOfUnit: '',
            units: '1',
            ratePerUnit: '',
            totalCost: '',
        });
        setShowActivityDropdown(false);
        setShowTaskDropdown(false);
    };

    return (
        <Container sx={{ maxHeight: '80vh', overflowY: 'auto', p: 2 }}>
            <Box>
                {/* Project Selection */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Project Name</InputLabel>
                    <Select
                        name="projectName"
                        value={formData.projectName}
                        onChange={(e) => {
                            handleChange(e);
                            setShowActivityDropdown(false);
                            setShowTaskDropdown(false);
                        }}
                    >
                        <MenuItem value="">Select Project</MenuItem>
                        {projects.map((project) => (
                            <MenuItem key={project.id} value={project.projectName}>
                                {project.projectName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.projectName && <Alert severity="error">{errors.projectName}</Alert>}
                </FormControl>

                {/* Component Selection */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Component</InputLabel>
                    <Select
                        name="componentName"
                        value={formData.componentName}
                        onChange={(e) => {
                            handleChange(e);
                            setShowActivityDropdown(true);
                        }}
                    >
                        <MenuItem value="">Select Component</MenuItem>
                        {components.map((component) => (
                            <MenuItem key={component.id} value={component.componentName}>
                                {component.componentName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.componentName && <Alert severity="error">{errors.componentName}</Alert>}
                </FormControl>

                {/* Activity Selection */}
                {showActivityDropdown && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Activity</InputLabel>
                        <Select
                            name="activityName"
                            value={formData.activityName}
                            onChange={(e) => {
                                handleChange(e);
                                setShowTaskDropdown(true);
                            }}
                        >
                            <MenuItem value="">Select Activity</MenuItem>
                            {activities.map((activity) => (
                                <MenuItem key={activity.id} value={activity.activityName}>
                                    {activity.activityName}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.activityName && <Alert severity="error">{errors.activityName}</Alert>}
                    </FormControl>
                )}

                {/* Task Selection */}
                {showTaskDropdown && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Task</InputLabel>
                        <Select
                            name="taskName"
                            value={formData.taskName}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select Task</MenuItem>
                            {tasks.map((task) => (
                                <MenuItem key={task.id} value={task.taskName}>
                                    {task.taskName}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.taskName && <Alert severity="error">{errors.taskName}</Alert>}
                    </FormControl>
                )}

                {/* Other Fields */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Activity Code"
                    name="activityCode"
                    value={formData.activityCode}
                    onChange={handleChange}
                    error={!!errors.activityCode}
                    helperText={errors.activityCode}
                />
                {isTraining && (
                    <>
                        <Grid container spacing={2} marginTop={0}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Male Count"
                                    name="maleCount"
                                    type="number"
                                    value={formData.maleCount}
                                    onChange={handleChange}
                                    error={!!errors.maleCount}
                                    helperText={errors.maleCount}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Female Count"
                                    name="femaleCount"
                                    type="number"
                                    value={formData.femaleCount}
                                    onChange={handleChange}
                                    error={!!errors.femaleCount}
                                    helperText={errors.femaleCount}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Other Count"
                                    name="otherCount"
                                    type="number"
                                    value={formData.otherCount}
                                    onChange={handleChange}
                                    error={!!errors.otherCount}
                                    helperText={errors.otherCount}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Resource Person"
                            name="recourcePerson"
                            value={formData.recourcePerson}
                            onChange={handleChange}
                            error={!!errors.recourcePerson}
                            helperText={errors.recourcePerson}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Expert Subject"
                            name="expertSubject"
                            value={formData.expertSubject}
                            onChange={handleChange}
                            error={!!errors.expertSubject}
                            helperText={errors.expertSubject}
                        />
                    </>
                )}

                {isExpenditure && (
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Type of Unit"
                        name="typeOfUnit"
                        value={formData.typeOfUnit}
                        onChange={handleChange}
                        error={!!errors.typeOfUnit}
                        helperText={errors.typeOfUnit}
                    />
                )}

                <TextField
                    fullWidth
                    margin="normal"
                    label="Units"
                    name="units"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={formData.units}
                    onChange={handleChange}
                    error={!!errors.units}
                    helperText={errors.units}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Rate per Unit"
                    name="ratePerUnit"
                    type="number"
                    value={formData.ratePerUnit}
                    onChange={handleChange}
                    error={!!errors.ratePerUnit}
                    helperText={errors.ratePerUnit}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Total Cost"
                    name="totalCost"
                    type="number"
                    value={formData.totalCost}
                    onChange={handleChange}
                    error={!!errors.totalCost}
                    helperText={errors.totalCost}
                />

                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleReset}>
                        Reset
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default TrainingForm;
