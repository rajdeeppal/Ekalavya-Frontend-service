import React, { useState } from 'react';
import { Table, Button, Collapse, Accordion, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const InprogressTable = ({ beneficiaries, setBeneficiaries }) => {
    const [open, setOpen] = useState({});
    const [taskDetailsOpen, setTaskDetailsOpen] = useState({});
    
    const toggleCollapse = (index) => {
        setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
    };

    const toggleTaskDetails = (taskIndex) => {
        setTaskDetailsOpen((prevState) => ({ ...prevState, [taskIndex]: !prevState[taskIndex] }));
    };

    const handleInputChange = (taskIndex, rowIndex, field, value) => {
        setBeneficiaries((prevBeneficiaries) => {
            const updatedBeneficiaries = [...prevBeneficiaries];
            const task = updatedBeneficiaries.flatMap(b => b.components.flatMap(c => c.activities.flatMap(a => a.tasks))).find((t, i) => i === taskIndex);
            if (task) {
                if (!task.additionalRows) {
                    task.additionalRows = [];
                }
                task.additionalRows[rowIndex] = {
                    ...task.additionalRows[rowIndex],
                    [field]: value
                };
            }
            return updatedBeneficiaries;
        });
    };

    const addNewRow = (taskIndex) => {
        setBeneficiaries((prevBeneficiaries) => {
            const updatedBeneficiaries = [...prevBeneficiaries];
            
            // Find the specific task in the beneficiaries array
            const task = updatedBeneficiaries.flatMap(b => b.components.flatMap(c => c.activities.flatMap(a => a.tasks))).find((t, i) => i === taskIndex);
    
            // Initialize additionalRows if it does not exist
            if (!task.additionalRows) {
                task.additionalRows = [];
            }
    
            // Add a new row only if there are no existing rows or if the last row is complete
            if (task.additionalRows.length === 0 || (task.additionalRows[task.additionalRows.length - 1] && 
                (task.additionalRows[task.additionalRows.length - 1].unitAchievement !== '' ||
                 task.additionalRows[task.additionalRows.length - 1].remainingBalance !== '' ||
                 task.additionalRows[task.additionalRows.length - 1].duration !== '' ||
                 task.additionalRows[task.additionalRows.length - 1].payeeName !== '' ||
                 task.additionalRows[task.additionalRows.length - 1].passbookCopy !== ''))) {
                 
                task.additionalRows.push({
                    unitAchievement: '',
                    remainingBalance: '',
                    duration: '',
                    payeeName: '',
                    passbookCopy: ''
                });
            }
            
            return updatedBeneficiaries;
        });

    
    };
    

    const handleSaveRow = (taskIndex, rowIndex) => {
        // Implement save logic for the specific row if needed
        console.log(`Saving row ${rowIndex} for task ${taskIndex}`);
    };

    const exportToExcel = () => {
        const formattedData = [];

        beneficiaries.forEach((beneficiary) => {
            beneficiary.components.forEach((component) => {
                component.activities.forEach((activity) => {
                    activity.tasks.forEach((task, taskIndex) => {
                        formattedData.push({
                            Vertical:
                                taskIndex === 0 &&
                                component === beneficiary.components[0] &&
                                activity === component.activities[0]
                                    ? beneficiary.verticalName
                                    : '', // Vertical only on first task of first component/activity
                            'Type of Project':
                                taskIndex === 0 && activity === component.activities[0] ? beneficiary.projectType : '', // Type of Project only on first task of first activity
                            'Name of the Project':
                                taskIndex === 0 && component === beneficiary.components[0] ? beneficiary.projectName : '', // Project Name only on first task of first component
                            Component: taskIndex === 0 ? component.componentName : '', // Component name only on the first task
                            Activity: taskIndex === 0 ? activity.activityName : '', // Activity name only on the first task
                            Tasks: task.taskName,
                            'Type of Unit': task.typeOfUnit,
                            'Unit Rate': task.ratePerUnit,
                            'No. of Units': task.units,
                            'Total Cost Rs.': task.totalCost,
                            'Beneficiary Contribution Rs.': task.beneficiaryContribution,
                            'Grant Amount (Rs.)': task.grantAmount,
                            'Year of Sanction': task.yearOfSanction,
                        });
                        // Add additional rows
                        if (task.additionalRows) {
                            task.additionalRows.forEach(row => {
                                formattedData.push({
                                    Vertical: '',
                                    'Type of Project': '',
                                    'Name of the Project': '',
                                    Component: '',
                                    Activity: '',
                                    Tasks: '',
                                    'Type of Unit': '',
                                    'Unit Rate': '',
                                    'No. of Units': '',
                                    'Total Cost Rs.': '',
                                    'Beneficiary Contribution Rs.': '',
                                    'Grant Amount (Rs.)': '',
                                    'Year of Sanction': '',
                                    'Unit Achievement': row.unitAchievement,
                                    'Remaining Balance': row.remainingBalance,
                                    'Duration': row.duration,
                                    'Payee Name': row.payeeName,
                                    'Passbook Copy': row.passbookCopy,
                                });
                            });
                        }
                    });
                });
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Beneficiaries');

        XLSX.writeFile(workbook, 'Beneficiaries.xlsx');
    };

    return (
        <div>
            <h3>Beneficiary List</h3>
            <Button variant="success" onClick={exportToExcel} style={{ marginBottom: '10px' }}>
                Download Excel
            </Button>
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Beneficiary Name</th>
                        <th>Father/Husband Name</th>
                        <th>Village</th>
                        <th>Mandal</th>
                        <th>District</th>
                        <th>State</th>
                        <th>Aadhar</th>
                        <th>Survey No.</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {beneficiaries.map((beneficiary, beneficiaryIndex) => (
                        <React.Fragment key={beneficiary.id}>
                            <tr>
                                <td>{beneficiary.verticalName}</td>
                                <td>{beneficiary.beneficiaryName}</td>
                                <td>{beneficiary.fatherHusbandName}</td>
                                <td>{beneficiary.village}</td>
                                <td>{beneficiary.mandal}</td>
                                <td>{beneficiary.district}</td>
                                <td>{beneficiary.state}</td>
                                <td>{beneficiary.aadhar}</td>
                                <td>{beneficiary.surveyNo}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        onClick={() => toggleCollapse(beneficiaryIndex)}
                                        aria-controls={`collapse-${beneficiaryIndex}`}
                                        aria-expanded={open[beneficiaryIndex]}
                                    >
                                        View Components
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="10" style={{ padding: 0 }}>
                                    <Collapse in={open[beneficiaryIndex]}>
                                        <div id={`collapse-${beneficiaryIndex}`} style={{ padding: '10px' }}>
                                            {beneficiary.components?.map((component) => (
                                                <div key={component.id}>
                                                    <Accordion defaultActiveKey="0">
                                                        <Accordion.Item eventKey={component.id}>
                                                            <Accordion.Header>{component.componentName}</Accordion.Header>
                                                            <Accordion.Body>
                                                                {component.activities?.map((activity) => (
                                                                    <div key={activity.id}>
                                                                        <Accordion defaultActiveKey="0">
                                                                            <Accordion.Item eventKey={activity.id}>
                                                                                <Accordion.Header>{activity.activityName}</Accordion.Header>
                                                                                <Accordion.Body>
                                                                                    <Table striped bordered hover>
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th>Name of the Work</th>
                                                                                                <th>Type of Unit</th>
                                                                                                <th>Unit Rate</th>
                                                                                                <th>No. of Units</th>
                                                                                                <th>Total Cost</th>
                                                                                                <th>Beneficiary Contribution</th>
                                                                                                <th>Grant Amount</th>
                                                                                                <th>Year of Sanction</th>
                                                                                                <th>Actions</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {activity.tasks?.map((task, taskIndex) => (
                                                                                                <React.Fragment key={task.id}>
                                                                                                    <tr>
                                                                                                        <td>{task.taskName}</td>
                                                                                                        <td>{task.typeOfUnit}</td>
                                                                                                        <td>{task.ratePerUnit}</td>
                                                                                                        <td>{task.units}</td>
                                                                                                        <td>{task.totalCost}</td>
                                                                                                        <td>{task.beneficiaryContribution}</td>
                                                                                                        <td>{task.grantAmount}</td>
                                                                                                        <td>{task.yearOfSanction}</td>
                                                                                                        <td>
                                                                                                            <Button
                                                                                                                variant="primary"
                                                                                                                onClick={() => toggleTaskDetails(taskIndex)}
                                                                                                                aria-controls={`task-details-${taskIndex}`}
                                                                                                                aria-expanded={taskDetailsOpen[taskIndex]}
                                                                                                            >
                                                                                                                View Task Details
                                                                                                            </Button>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td colSpan="9" style={{ padding: 0 }}>
                                                                                                            <Collapse in={taskDetailsOpen[taskIndex]}>
                                                                                                                <div id={`task-details-${taskIndex}`} style={{ padding: '10px' }}>
                                                                                                                    <Table striped bordered hover>
                                                                                                                        <thead>
                                                                                                                            <tr>
                                                                                                                                <th>Unit Achievement</th>
                                                                                                                                <th>Remaining Balance</th>
                                                                                                                                <th>Duration</th>
                                                                                                                                <th>Payee Name</th>
                                                                                                                                <th>Passbook Copy</th>
                                                                                                                                <th>Actions</th>
                                                                                                                            </tr>
                                                                                                                        </thead>
                                                                                                                        <tbody>
                                                                                                                            {(task.additionalRows || []).map((row, rowIndex) => (
                                                                                                                                <tr key={rowIndex}>
                                                                                                                                    <td>
                                                                                                                                        <Form.Control
                                                                                                                                            type="text"
                                                                                                                                            value={row.unitAchievement || ''}
                                                                                                                                            onChange={(e) => handleInputChange(taskIndex, rowIndex, 'unitAchievement', e.target.value)}
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <Form.Control
                                                                                                                                            type="text"
                                                                                                                                            value={row.remainingBalance || ''}
                                                                                                                                            onChange={(e) => handleInputChange(taskIndex, rowIndex, 'remainingBalance', e.target.value)}
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <Form.Control
                                                                                                                                            type="text"
                                                                                                                                            value={row.duration || ''}
                                                                                                                                            onChange={(e) => handleInputChange(taskIndex, rowIndex, 'duration', e.target.value)}
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <Form.Control
                                                                                                                                            type="text"
                                                                                                                                            value={row.payeeName || ''}
                                                                                                                                            onChange={(e) => handleInputChange(taskIndex, rowIndex, 'payeeName', e.target.value)}
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <Form.Control
                                                                                                                                            type="text"
                                                                                                                                            value={row.passbookCopy || ''}
                                                                                                                                            onChange={(e) => handleInputChange(taskIndex, rowIndex, 'passbookCopy', e.target.value)}
                                                                                                                                        />
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        <Button
                                                                                                                                            variant="secondary"
                                                                                                                                            onClick={() => handleSaveRow(taskIndex, rowIndex)}
                                                                                                                                        >
                                                                                                                                            Save
                                                                                                                                        </Button>
                                                                                                                                    </td>
                                                                                                                                </tr>
                                                                                                                            ))}
                                                                                                                        </tbody>
                                                                                                                    </Table>
                                                                                                                    <Button
                                                                                                                        variant="primary"
                                                                                                                        onClick={() => addNewRow(taskIndex)}
                                                                                                                        style={{ marginTop: '10px' }}
                                                                                                                    >
                                                                                                                        Add New Row
                                                                                                                    </Button>
                                                                                                                </div>
                                                                                                            </Collapse>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </React.Fragment>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </Table>
                                                                                </Accordion.Body>
                                                                            </Accordion.Item>
                                                                        </Accordion>
                                                                    </div>
                                                                ))}
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                </div>
                                            ))}
                                            <Button
                                                variant="primary"
                                                onClick={() => handleSaveRow(null, null)}
                                                style={{ marginTop: '10px' }}
                                            >
                                                Save All
                                            </Button>
                                        </div>
                                    </Collapse>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default InprogressTable;
