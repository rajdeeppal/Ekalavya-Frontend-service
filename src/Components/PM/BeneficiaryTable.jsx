import React, { useState } from 'react';
import { Table, Button, Collapse, Form, Modal } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';

const BeneficiaryTable = ({ beneficiaries, setBeneficiaries }) => {
  const [open, setOpen] = useState({});
  const [editActivityMode, setEditActivityMode] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEdit, setShowEdit] = useState(true);

  const toggleCollapse = (index) => {
    setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
  };

  const handleEditActivityClick = (beneficiaryIndex, componentIndex, activityIndex, taskIndex) => {
    setEditActivityMode((prevState) => ({
      ...prevState,
      [`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`]:
        !prevState[`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`],
    }));
  };

  const handleActivityInputChange = (beneficiaryIndex, componentIndex, activityIndex, taskIndex, e) => {
    const { name, value } = e.target;
    const updatedBeneficiaries = [...beneficiaries];

    const activity = updatedBeneficiaries[beneficiaryIndex]?.components[componentIndex]?.activities[activityIndex];
    if (activity && activity.tasks && activity.tasks[taskIndex]) {
      activity.tasks[taskIndex][name] = value;
      setBeneficiaries(updatedBeneficiaries);
    }
  };

  const handleSaveActivity = (beneficiaryIndex, componentIndex, activityIndex, taskIndex) => {
    setEditActivityMode((prevState) => ({
      ...prevState,
      [`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`]: false,
    }));
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
    setShowEdit(false);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmation(false);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <h3>Beneficiary List</h3>
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
                      {beneficiary.components?.map((component, componentIndex) => (
                        <div key={component.id}>
                          <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey={component.id}>
                              <Accordion.Header>{component.componentName}</Accordion.Header>
                              <Accordion.Body>
                                {component.activities?.map((activity, activityIndex) => (
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
                                                {showEdit &&
                                                  <th>Actions</th>}
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {activity.tasks?.map((task, taskIndex) => (
                                                <tr key={task.id}>
                                                  {editActivityMode[`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`] ? (
                                                    <>
                                                      <td>{task.taskName}</td>
                                                      <td>{task.typeOfUnit}</td>
                                                      <td>{task.ratePerUnit}</td>
                                                      <td>
                                                        <Form.Control
                                                          type="text"
                                                          name="units"
                                                          value={task.units || ''}
                                                          onChange={(e) =>
                                                            handleActivityInputChange(
                                                              beneficiaryIndex,
                                                              componentIndex,
                                                              activityIndex,
                                                              taskIndex,
                                                              e
                                                            )
                                                          }
                                                        />
                                                      </td>
                                                      <td>
                                                        <Form.Control
                                                          type="text"
                                                          name="totalCost"
                                                          value={task.totalCost || ''}
                                                          onChange={(e) =>
                                                            handleActivityInputChange(
                                                              beneficiaryIndex,
                                                              componentIndex,
                                                              activityIndex,
                                                              taskIndex,
                                                              e
                                                            )
                                                          }
                                                        />
                                                      </td>
                                                      <td>
                                                        <Form.Control
                                                          type="text"
                                                          name="beneficiaryContribution"
                                                          value={task.beneficiaryContribution || ''}
                                                          onChange={(e) =>
                                                            handleActivityInputChange(
                                                              beneficiaryIndex,
                                                              componentIndex,
                                                              activityIndex,
                                                              taskIndex,
                                                              e
                                                            )
                                                          }
                                                        />
                                                      </td>
                                                      <td>
                                                        <Form.Control
                                                          type="text"
                                                          name="grantAmount"
                                                          value={task.grantAmount || ''}
                                                          onChange={(e) =>
                                                            handleActivityInputChange(
                                                              beneficiaryIndex,
                                                              componentIndex,
                                                              activityIndex,
                                                              taskIndex,
                                                              e
                                                            )
                                                          }
                                                        />
                                                      </td>
                                                      <td>
                                                        <Form.Control
                                                          type="text"
                                                          name="yearOfSanction"
                                                          value={task.yearOfSanction || ''}
                                                          onChange={(e) =>
                                                            handleActivityInputChange(
                                                              beneficiaryIndex,
                                                              componentIndex,
                                                              activityIndex,
                                                              taskIndex,
                                                              e
                                                            )
                                                          }
                                                        />
                                                      </td>
                                                      <td>
                                                        <Button
                                                          variant="success"
                                                          onClick={() =>
                                                            handleSaveActivity(
                                                              beneficiaryIndex,
                                                              componentIndex,
                                                              activityIndex,
                                                              taskIndex
                                                            )
                                                          }
                                                        >
                                                          Save
                                                        </Button>
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <td>{task.taskName}</td>
                                                      <td>{task.typeOfUnit}</td>
                                                      <td>{task.ratePerUnit}</td>
                                                      <td>{task.units}</td>
                                                      <td>{task.totalCost}</td>
                                                      <td>{task.beneficiaryContribution}</td>
                                                      <td>{task.grantAmount}</td>
                                                      <td>{task.yearOfSanction}</td>
                                                      {showEdit && <td>
                                                        <Button
                                                          variant="warning"
                                                          onClick={() =>
                                                            handleEditActivityClick(
                                                              beneficiaryIndex,
                                                              componentIndex,
                                                              activityIndex,
                                                              taskIndex
                                                            )
                                                          }
                                                        >
                                                          Edit
                                                        </Button>
                                                      </td>}
                                                    </>
                                                  )}
                                                </tr>
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
                        onClick={() => handleSubmit(beneficiaryIndex)}
                        style={{ marginTop: '10px' }}
                      >
                        Submit
                      </Button>
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to submit the changes?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmSubmit}>
            Yes, Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BeneficiaryTable;
