import React, { useState, useEffect } from 'react';
import { getVerticals, getComponents, getActivities, getTasks, getTaskById, updateTask, saveConfiguration } from '../DataCenter/apiService';

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

    useEffect(() => {
        async function fetchVerticals() {
            const data = await getVerticals();
            setVerticals(Array.isArray(data) ? data : []);
        }
        fetchVerticals();
    }, []);

    useEffect(() => {
        if (selectedVertical && selectedVertical !== 'other') {
            async function fetchComponents() {
                const data = await getComponents(selectedVertical);
                setComponents(Array.isArray(data) ? data : []);
            }
            fetchComponents();
        }
    }, [selectedVertical]);

    useEffect(() => {
        if (selectedComponent && selectedComponent !== 'other') {
            async function fetchActivities() {
                const data = await getActivities(selectedComponent);
                setActivities(Array.isArray(data) ? data : []);
            }
            fetchActivities();
        }
    }, [selectedComponent]);

    useEffect(() => {
        if (selectedActivity && selectedActivity !== 'other') {
            async function fetchTasks() {
                const data = await getTasks(selectedActivity);
                setTasks(Array.isArray(data) ? data : []);
            }
            fetchTasks();
        }
    }, [selectedActivity]);

    // Fetch task details when a task is selected
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
        const projectConfig = {
            verticalName: selectedVertical === 'other' ? newVerticalName : selectedVertical,
            componentName: selectedComponent === 'other' ? newComponentName : selectedComponent,
            activityName: selectedActivity === 'other' ? newActivityName : selectedActivity,
            taskName,
            units,
            ratePerUnit
        };

        if (selectedTask && selectedTask !== 'other') {
            await updateTask(selectedTask, projectConfig); // Update existing task
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
        <div>
            <h1>Project Configuration</h1>

            {/* Vertical dropdown */}
            <div>
                <label>Vertical:</label>
                <select onChange={(e) => setSelectedVertical(e.target.value)} value={selectedVertical}>
                    <option value="">Select Vertical</option>
                    {verticals.map(v => <option key={v.id} value={v.verticalName}>{v.verticalName}</option>)}
                    <option value="other">Other</option>
                </select>
            </div>

            {selectedVertical === 'other' && (
                <div>
                    <label>New Vertical Name:</label>
                    <input type="text" onChange={(e) => setNewVerticalName(e.target.value)} value={newVerticalName} />
                </div>
            )}

            {/* Component dropdown */}
            {selectedVertical && (
                <div>
                    <label>Component:</label>
                    <select onChange={(e) => setSelectedComponent(e.target.value)} value={selectedComponent}>
                        <option value="">Select Component</option>
                        {components.map(c => <option key={c.id} value={c.componentName}>{c.componentName}</option>)}
                        <option value="other">Other</option>
                    </select>
                </div>
            )}

            {selectedComponent === 'other' && (
                <div>
                    <label>New Component Name:</label>
                    <input type="text" onChange={(e) => setNewComponentName(e.target.value)} value={newComponentName} />
                </div>
            )}

            {/* Activity dropdown */}
            {selectedComponent && (
                <div>
                    <label>Activity:</label>
                    <select onChange={(e) => setSelectedActivity(e.target.value)} value={selectedActivity}>
                        <option value="">Select Activity</option>
                        {activities.map(a => <option key={a.id} value={a.activityName}>{a.activityName}</option>)}
                        <option value="other">Other</option>
                    </select>
                </div>
            )}

            {selectedActivity === 'other' && (
                <div>
                    <label>New Activity Name:</label>
                    <input type="text" onChange={(e) => setNewActivityName(e.target.value)} value={newActivityName} />
                </div>
            )}

            {/* Task dropdown */}
            {selectedActivity && (
                <div>
                    <label>Task:</label>
                    <select onChange={(e) => setSelectedTask(e.target.value)} value={selectedTask}>
                        <option value="">Select Task</option>
                        {tasks.map(t => <option key={t.id} value={t.id}>{t.taskName}</option>)}
                        <option value="other">Other</option>
                    </select>
                </div>
            )}

            {/* Input fields for Task Name, Units, and Rate per Unit */}
            {(selectedTask === 'other' || selectedTask) && (
                <>
                    <div>
                        <label>Task Name:</label>
                        <input type="text" onChange={(e) => setTaskName(e.target.value)} value={taskName} disabled={selectedTask !== 'other'} />
                    </div>
                    <div>
                        <label>Units:</label>
                        <input type="number" onChange={(e) => setUnits(e.target.value)} value={units} />
                    </div>
                    <div>
                        <label>Rate per Unit:</label>
                        <input type="number" onChange={(e) => setRatePerUnit(e.target.value)} value={ratePerUnit} />
                    </div>
                </>
            )}

            <button onClick={handleSave}>Save Configuration</button>
        </div>
    );
}

export default TaskIframe;
