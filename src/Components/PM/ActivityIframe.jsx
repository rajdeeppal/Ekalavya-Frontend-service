import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function ActivityIframe({ taskName, onSave, typeOfUnit, unitRate }) {
  const [activity, setActivity] = useState({
    task: taskName,
    nameOfWork: '',
    typeOfUnit: typeOfUnit,
    unitRate: unitRate,
    noOfUnits: '',
    totalCost: '',
    beneficiaryContribution: '',
    grantAmount: '',
    yearOfSanction: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedActivity = { ...activity, [name]: value };

    // // Recalculate totalCost if unitRate or noOfUnits changes
    // if (name === 'unitRate' || name === 'noOfUnits') {
    //     const unitRate = name === 'unitRate' ? value : updatedActivity.unitRate;
    //     const noOfUnits = name === 'noOfUnits' ? value : updatedActivity.noOfUnits;

    //     // Calculate totalCost if both unitRate and noOfUnits are defined
    //     if (unitRate && noOfUnits) {
    //         updatedActivity.totalCost = parseFloat(unitRate) * parseFloat(noOfUnits);
    //     }
    // }

    setActivity(updatedActivity);
    console.log(updatedActivity);

    // Clear the error for the changed field
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
};

  const validateForm = () => {
    let formErrors = {};
    if (!activity.nameOfWork) formErrors.nameOfWork = 'Number of Work is required';
    if (!activity.noOfUnits) formErrors.noOfUnits = 'Number of Units is required';
    if (!activity.totalCost) formErrors.totalCost = 'Total Cost is required';
    if (!activity.beneficiaryContribution) formErrors.beneficiaryContribution = 'Beneficiary Contribution is required';
    if (!activity.grantAmount) formErrors.grantAmount = 'Grant Amount is required';
    if (!activity.yearOfSanction) formErrors.yearOfSanction = 'Year of Sanction is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    console.log(activity);
    onSave(activity);
    setActivity({
      task: taskName,
      nameOfWork: '',
      typeOfUnit: typeOfUnit,
      unitRate: unitRate,
      noOfUnits: '',
      totalCost: '',
      beneficiaryContribution: '',
      grantAmount: '',
      yearOfSanction: '',
    });
    // setErrors({});
  };

  return (
    <div className="container mt-5">
      <Form>
        <Form.Group>
          <Form.Label>Task Name</Form.Label>
          <Form.Control type="text" value={taskName} readOnly />
        </Form.Group>
        <Form.Group>
          <Form.Label>Name of Work</Form.Label>
          <Form.Control
            type="text"
            name="nameOfWork"
            value={activity.nameOfWork}
            onChange={handleChange}
          />
          {errors.nameOfWork && <Alert variant="danger">{errors.nameOfWork}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Type of Unit</Form.Label>
          <Form.Control type="text" value={typeOfUnit} readOnly />
        </Form.Group>
        <Form.Group>
          <Form.Label>Unit Rate</Form.Label>
          <Form.Control type="number" value={unitRate} readOnly />
        </Form.Group>
        <Form.Group>
          <Form.Label>No of Units</Form.Label>
          <Form.Control
            type="number"
            name="noOfUnits"
            value={activity.noOfUnits}
            onChange={handleChange}
          />
          {errors.noOfUnits && <Alert variant="danger">{errors.noOfUnits}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Total Cost</Form.Label>
          <Form.Control
            type="number"
            name="totalCost"
            value={activity.totalCost}
            onChange={handleChange}
          />
          {errors.totalCost && <Alert variant="danger">{errors.totalCost}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Beneficiary Contribution</Form.Label>
          <Form.Control
            type="number"
            name="beneficiaryContribution"
            value={activity.beneficiaryContribution}
            onChange={handleChange}
          />
          {errors.beneficiaryContribution && <Alert variant="danger">{errors.beneficiaryContribution}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Grant Amount</Form.Label>
          <Form.Control
            type="number"
            name="grantAmount"
            value={activity.grantAmount}
            onChange={handleChange}
          />
          {errors.grantAmount && <Alert variant="danger">{errors.grantAmount}</Alert>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Year of Sanction</Form.Label>
          <Form.Control
            type="number"
            name="yearOfSanction"
            value={activity.yearOfSanction}
            onChange={handleChange}
          />
          {errors.yearOfSanction && <Alert variant="danger">{errors.yearOfSanction}</Alert>}
        </Form.Group>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Form>
    </div>
  );
}

export default ActivityIframe;
