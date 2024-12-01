import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Typography } from '@mui/material';
import { getVerticals, getComponents, getRestrictedComponents, getActivities, getTasks, getTaskById, updateTask, saveConfiguration } from '../DataCenter/apiService';

function TaskIframe() {
    const [verticals, setVerticals] = useState([]);
    const [components, setComponents] = useState([]);
    const [activities, setActivities] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedVertical, setSelectedVertical] = useState('');
    const [selectedComponent, setSelectedComponent] = useState('');
    const [selectedActivity, setSelectedActivity] = useState('');
    const [selectedTask, setSelectedTask] = useState(''); // Selected task
    const [newVerticalName, setNewVerticalName] = useState('');
    const [newComponentName, setNewComponentName] = useState('');
    const [newActivityName, setNewActivityName] = useState('');
    const [taskName, setTaskName] = useState('');
    const [units, setUnits] = useState('');
    const [ratePerUnit, setRatePerUnit] = useState('');
    const [isAll,setIsAll]=useState(false);   

    useEffect(() => {
        async function fetchVerticals() {
            const data = await getVerticals();
            setVerticals(Array.isArray(data) ? data : []);
        }
        fetchVerticals();
    }, []);

    // Fetch components based on selected vertical
    useEffect(() => {
        if (selectedVertical && selectedVertical !== 'other') {
            async function fetchComponents() {
                const id=verticals.find(item => item.verticalName === selectedVertical)?.id;
                if (selectedComponent === 'all' || isAll) {
                    const allComponents = await getRestrictedComponents(); // Fetch all components
                    console.log('Fetched all components:', allComponents); // Debug log
                    setComponents(allComponents); // Update state with all components
                    setIsAll(selectedComponent === 'all');
                } else{
                    const data = await getComponents(id);
                    console.log('Fetched components for vertical:', data); // Debug log
                    setComponents(Array.isArray(data) ? data : []);
                }
            }
            fetchComponents();
        }
    }, [selectedVertical, selectedComponent, verticals]);

    useEffect(() => {
        if (selectedComponent && selectedComponent !== 'other' && selectedComponent !== 'all') {
            async function fetchActivities() {
                const id=components.find(item => item.componentName === selectedComponent)?.id;
                const data = await getActivities(id);
                setActivities(Array.isArray(data) ? data : []);
            }
            fetchActivities();
        } else {
            setActivities([]); // Clear activities if 'all' or 'other' is selected
        }
    }, [selectedComponent, components]);

    useEffect(() => {
        if (selectedActivity && selectedActivity !== 'other') {
            async function fetchTasks() {
                const id=activities.find(item => item.activityName === selectedActivity)?.id;
                const data = await getTasks(id);
                setTasks(Array.isArray(data) ? data : []);
            }
            fetchTasks();
        } else {
            setTasks([]); // Clear tasks if 'other' is selected
        }
    }, [selectedActivity, activities]);

    useEffect(() => {
        if (selectedTask && selectedTask !== 'other') {
            async function fetchTaskDetails() {
                const data = await getTaskById(selectedTask);
                setTaskName(data.taskName);
                setUnits(data.units);
                setRatePerUnit(data.ratePerUnit);
            }
            fetchTaskDetails();
        } else {
            // Clear the fields if 'Other' is selected
            setTaskName('');
            setUnits('');
            setRatePerUnit('');
        }
    }, [selectedTask]);

const handleSave = async () => {
    // Ensure 'all' is treated correctly in projectConfig
    const projectConfig = {
        verticalName: selectedVertical === 'other' ? newVerticalName : selectedVertical,
        componentName: selectedComponent === 'all' ? null : (selectedComponent === 'other' ? newComponentName : selectedComponent),
        activityName: selectedActivity === 'other' ? newActivityName : selectedActivity,
        taskName,
        units,
        ratePerUnit
    };
        if (selectedTask && selectedTask !== 'other') {
            await saveConfiguration(projectConfig); // Update existing task
        } else {
            await saveConfiguration(projectConfig); // Save new configuration
        }

        // Refresh dropdown data after saving
        const updatedVerticals = await getVerticals();
        setVerticals(Array.isArray(updatedVerticals) ? updatedVerticals : []);

        // Clear inputs and selected states
        setSelectedVertical('');
        setSelectedComponent('');
        setSelectedActivity('');
        setSelectedTask('');
        setNewVerticalName('');
        setNewComponentName('');
        setNewActivityName('');
        setTaskName('');
        setUnits('');
        setRatePerUnit('');

        alert('Configuration saved successfully!');
    };

    return (
        <Box sx={{ p: 2, fontSize: '14px' }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Project Configuration</Typography>

            {/* Vertical dropdown */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="vertical-select-label">Vertical</InputLabel>
                <Select
                    labelId="vertical-select-label"
                    onChange={(e) => setSelectedVertical(e.target.value)}
                    value={selectedVertical}
                    sx={{ fontSize: '14px' }}
                >
                    <MenuItem value=""><em>Select Vertical</em></MenuItem>
                    {verticals.map(v => (
                        <MenuItem key={v.id} value={v.verticalName}>{v.verticalName}</MenuItem>
                    ))}
                    <MenuItem value="other">Other</MenuItem>
                </Select>
            </FormControl>

            {selectedVertical === 'other' && (
                <TextField
                    label="New Vertical Name"
                    fullWidth
                    value={newVerticalName}
                    onChange={(e) => setNewVerticalName(e.target.value)}
                    sx={{ mb: 2, fontSize: '14px' }}
                />
            )}

            {/* Component dropdown */}
            {selectedVertical && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="component-select-label">Component</InputLabel>
                    <Select
                        labelId="component-select-label"
                        onChange={(e) => {
                            const value = e.target.value;
                            console.log('Selected component:', value); // Debug log
                            setSelectedComponent(value);
                        }}
                        value={selectedComponent}
                        sx={{ fontSize: '14px' }}
                    >
                        <MenuItem value=""><em>Select Component</em></MenuItem>
                        {components.map(c => (
                            <MenuItem key={c.id} value={c.componentName}>{c.componentName}</MenuItem>
                        ))}
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="all">All</MenuItem>
                    </Select>
                </FormControl>
            )}

            {/* Input field for adding new component if 'Other' is selected */}
            {selectedComponent === 'other' && (
                <TextField
                    label="New Component Name"
                    fullWidth
                    value={newComponentName}
                    onChange={(e) => setNewComponentName(e.target.value)}
                    sx={{ mb: 2, fontSize: '14px' }}
                />
            )}

            {/* Activity dropdown */}
            {selectedComponent && selectedComponent !== 'all' && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="activity-select-label">Activity</InputLabel>
                    <Select
                        labelId="activity-select-label"
                        onChange={(e) => setSelectedActivity(e.target.value)}
                        value={selectedActivity}
                        sx={{ fontSize: '14px' }}
                    >
                        <MenuItem value=""><em>Select Activity</em></MenuItem>
                        {activities.map(a => (
                            <MenuItem key={a.id} value={a.activityName}>{a.activityName}</MenuItem>
                        ))}
                        <MenuItem value="other">Other</MenuItem>
                    </Select>
                </FormControl>
            )}

            {selectedActivity === 'other' && (
                <TextField
                    label="New Activity Name"
                    fullWidth
                    value={newActivityName}
                    onChange={(e) => setNewActivityName(e.target.value)}
                    sx={{ mb: 2, fontSize: '14px' }}
                />
            )}

            {/* Task dropdown */}
            {selectedActivity && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="task-select-label">Task</InputLabel>
                    <Select
                        labelId="task-select-label"
                        onChange={(e) => setSelectedTask(e.target.value)}
                        value={selectedTask}
                        sx={{ fontSize: '14px' }}
                    >
                        <MenuItem value=""><em>Select Task</em></MenuItem>
                        {tasks.map(t => (
                            <MenuItem key={t.id} value={t.id}>{t.taskName}</MenuItem>
                        ))}
                        <MenuItem value="other">Other</MenuItem>
                    </Select>
                </FormControl>
            )}

            {/* Input fields for Task Name, Units, and Rate per Unit */}
            {(selectedTask === 'other' || selectedTask) && (
                <>
                    <TextField
                        label="Task Name"
                        fullWidth
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        disabled={selectedTask !== 'other'}
                        sx={{ mb: 2, fontSize: '14px' }}
                    />
                    <TextField
                        label="Units"
                        fullWidth
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                        sx={{ mb: 2, fontSize: '14px' }}
                    />
                    <TextField
                        label="Rate per Unit"
                        fullWidth
                        value={ratePerUnit}
                        onChange={(e) => setRatePerUnit(e.target.value)}
                        sx={{ mb: 2, fontSize: '14px' }}
                    />
                </>
            )}

            <Button variant="contained" color="primary" onClick={handleSave} sx={{ fontSize: '14px' }}>
                Save Configuration
            </Button>
        </Box>
    );
}

export default TaskIframe;
