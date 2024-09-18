import React, { useState } from 'react';
import { Table, Button, Collapse, Accordion, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const InprogressTable = ({ beneficiaries, setBeneficiaries }) => {
    const [open, setOpen] = useState({});
    const [taskDetailsOpen, setTaskDetailsOpen] = useState({});
    const [editMode, setEditMode] = useState({});

    const toggleEditMode = (taskIndex, rowIndex) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [`${taskIndex}-${rowIndex}`]: !prevEditMode[`${taskIndex}-${rowIndex}`],
        }));
    };


    const toggleCollapse = (index) => {
        setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
    };

    const toggleTaskDetails = (taskIndex) => {
        setTaskDetailsOpen((prevState) => ({ ...prevState, [taskIndex]: !prevState[taskIndex] }));
    };

    const handleInputChange = (taskIndex, rowIndex, field, value) => {
        const updatedBeneficiaries = [...beneficiaries];

        const task = updatedBeneficiaries.flatMap(b =>
            b.components.flatMap(c =>
                c.activities.flatMap(a =>
                    a.tasks
                )
            )
        ).find((t, i) => i === taskIndex);

        if (task) {
            const row = task.additionalRows[rowIndex];
    
            row[field] = value;
    
            if (row.unitAchievement && task.ratePerUnit) {
                row.currentCost = row.unitAchievement * task.ratePerUnit;
            }
    
            setBeneficiaries(updatedBeneficiaries); // Update the state
        }
        setBeneficiaries((prevBeneficiaries) => {
            const updatedBeneficiaries = [...prevBeneficiaries];
            const task = updatedBeneficiaries
                .flatMap(b => b.components.flatMap(c => c.activities.flatMap(a => a.tasks)))
                .find((t, i) => i === taskIndex);

            task.additionalRows[rowIndex][field] = value;
            return updatedBeneficiaries;
        });
    };

    const handleSaveRow = (taskIndex, rowIndex) => {
        setEditMode((prevState) => ({
            ...prevState,
            [`${taskIndex}-${rowIndex}`]: !prevState[`${taskIndex}-${rowIndex}`],
        }));

        const task = beneficiaries
            .flatMap(b => b.components.flatMap(c => c.activities.flatMap(a => a.tasks)))
            .find((t, i) => i === taskIndex);

        const changedData = task.additionalRows[rowIndex];
        console.log(changedData);
        // axios
        //     .post('/your-endpoint-url', { taskIndex, rowIndex, ...changedData },
        //         { headers: { 'Content-Type': 'multipart/form-data' } })
        //     .then((response) => {
        //         console.log('Data saved successfully:', response.data);
        //         toggleEditMode(taskIndex, rowIndex); // Exit edit mode after saving
        //     })
        //     .catch((error) => {
        //         console.error('Error saving data:', error);
        //     });
    };


    const addNewRow = (taskIndex) => {
        setBeneficiaries((prevBeneficiaries) => {
            const updatedBeneficiaries = [...prevBeneficiaries];

            const task = updatedBeneficiaries.flatMap(b => b.components.flatMap(c => c.activities.flatMap(a => a.tasks))).find((t, i) => i === taskIndex);

            if (!task.additionalRows) {
                task.additionalRows = [];
            }

            if (task.additionalRows.length === 0 || (task.additionalRows[task.additionalRows.length - 1] &&
                (task.additionalRows[task.additionalRows.length - 1].unitAchievement !== '' ||
                    task.additionalRows[task.additionalRows.length - 1].payeeName !== '' ||
                    task.additionalRows[task.additionalRows.length - 1].passbookCopy !== ''))) {

                task.additionalRows.push({
                    unitAchievement: '',
                    currentCost: '',
                    payeeName: '',
                    passbookCopy: '',
                    otherDocument:''
                });
            }
            return updatedBeneficiaries;
        });

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

    const handleFileChange = (taskIndex, rowIndex, fileType, e) => {
        const file = e.target.files[0];

        const updatedBeneficiaries = [...beneficiaries];
        const task = updatedBeneficiaries.flatMap(b =>
            b.components.flatMap(c =>
                c.activities.flatMap(a =>
                    a.tasks
                )
            )
        ).find((t, i) => i === taskIndex);

        if (task && file) {
            const fileURL = URL.createObjectURL(file);
            task.additionalRows[rowIndex] = {
                ...task.additionalRows[rowIndex], 
                [fileType]: {
                    file,        
                    fileURL,
                }
            };
            setBeneficiaries(updatedBeneficiaries);
        }
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
                        <th>villageName</th>
                        <th>mandalName</th>
                        <th>districtName</th>
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
                                <td>{beneficiary.guardianName}</td>
                                <td>{beneficiary.villageName}</td>
                                <td>{beneficiary.mandalName}</td>
                                <td>{beneficiary.districtName}</td>
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
                                                                                                                                <th>Current Cost</th>
                                                                                                                                <th>Payee Name</th>
                                                                                                                                <th>Passbook Copy</th>
                                                                                                                                <th>Other Document</th>
                                                                                                                                <th>Actions</th>
                                                                                                                            </tr>
                                                                                                                        </thead>
                                                                                                                        <tbody>
                                                                                                                            {(task.additionalRows || []).map((row, rowIndex) => (
                                                                                                                                <tr key={rowIndex}>
                                                                                                                                    <td>
                                                                                                                                        {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                            <Form.Control
                                                                                                                                                type="text"
                                                                                                                                                value={row.unitAchievement || ''}
                                                                                                                                                onChange={(e) => handleInputChange(taskIndex, rowIndex, 'unitAchievement', e.target.value)}
                                                                                                                                            />
                                                                                                                                        ) : (
                                                                                                                                            row.unitAchievement
                                                                                                                                        )}
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                            <Form.Control
                                                                                                                                                type="text"
                                                                                                                                                value={row.currentCost || ''}
                                                                                                                                                readOnly
                                                                                                                                            />
                                                                                                                                        ) : (
                                                                                                                                            row.currentCost
                                                                                                                                        )}
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                            <Form.Control
                                                                                                                                                type="text"
                                                                                                                                                value={row.payeeName || ''}
                                                                                                                                                onChange={(e) => handleInputChange(taskIndex, rowIndex, 'payeeName', e.target.value)}
                                                                                                                                            />
                                                                                                                                        ) : (
                                                                                                                                            row.payeeName
                                                                                                                                        )}
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                            <Form.Control
                                                                                                                                                type="file"
                                                                                                                                                accept="image/*"  // Only allow image files
                                                                                                                                                onChange={(e) => handleFileChange(taskIndex, rowIndex, 'passbookCopy', e)}
                                                                                                                                            />
                                                                                                                                        ) : (
                                                                                                                                            row.passbookCopy ? (
                                                                                                                                                <a
                                                                                                                                                    href={row.passbookCopy.fileURL}
                                                                                                                                                    download={row.passbookCopy.file.name} // Trigger download
                                                                                                                                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                                                                                                                >
                                                                                                                                                    {row.passbookCopy.file.name}
                                                                                                                                                </a>

                                                                                                                                            ) : (
                                                                                                                                                <span>No Image</span> // Placeholder if no image is uploaded
                                                                                                                                            )
                                                                                                                                        )}
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                            <Form.Control
                                                                                                                                                type="file"
                                                                                                                                                accept=".pdf"
                                                                                                                                                onChange={(e) => handleFileChange(taskIndex, rowIndex, 'otherDocument', e)}
                                                                                                                                            />
                                                                                                                                        ) : (
                                                                                                                                            row.otherDocument ? (
                                                                                                                                                <a
                                                                                                                                                    href={row.otherDocument.fileURL}
                                                                                                                                                    download={row.otherDocument.file.name}
                                                                                                                                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                                                                                                                >
                                                                                                                                                    {row.otherDocument.file.name}
                                                                                                                                                </a>

                                                                                                                                            ) : (
                                                                                                                                                <span>No File Uploaded</span> 
                                                                                                                                            )
                                                                                                                                        )}
                                                                                                                                    </td>
                                                                                                                                    <td>
                                                                                                                                        {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                            <Button variant="success" onClick={() => handleSaveRow(taskIndex, rowIndex)}>
                                                                                                                                                Save
                                                                                                                                            </Button>
                                                                                                                                        ) : (
                                                                                                                                            <Button variant="secondary" onClick={() => toggleEditMode(taskIndex, rowIndex)}>
                                                                                                                                                Edit
                                                                                                                                            </Button>
                                                                                                                                        )}
                                                                                                                                    </td>
                                                                                                                                    {/* {<pre>{JSON.stringify({ task }, null, 2)}</pre>} */}
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
