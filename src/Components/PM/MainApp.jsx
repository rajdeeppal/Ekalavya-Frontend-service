import React, { useState } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import SearchBar from './SearchBar';
import ProjectForm from './ProjectForm';
import BeneficiaryForm from './BeneficiaryForm';
import BeneficiaryTable from './BeneficiaryTable';

const MainApp = () => {

  
  const [projects, setProjects] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([
    {
        "id": 1,
        "verticalName": "BT",
        "components": [
            {
                "id": 1,
                "componentName": "Enterprise",
                "activities": [
                    {
                        "id": 1,
                        "activityName": "AIB",
                        "tasks": [
                            {
                                "id": 1,
                                "taskName": "VOICE",
                                "typeOfUnit":"gm",
                                "units": "10",
                                "ratePerUnit": "800",
                                "totalCost":"234",
                                "beneficiaryContribution":"12",
                                "grantAmount":"234",
                                "yearOfSanction":"2009"
                            },
                            {
                                "id": 3,
                                "taskName": "CV",
                                "typeOfUnit":"gm",
                                "units": "20",
                                "ratePerUnit": "700",
                                "totalCost":"234",
                                "beneficiaryContribution":"12",
                                "grantAmount":"234",
                                "yearOfSanction":"2009"
                            }
                        ]
                    }
                ]
            },
            {
                "id": 2,
                "componentName": "Consumer",
                "activities": [
                    {
                        "id": 2,
                        "activityName": "OFS",
                        "tasks": [
                            {
                                "id": 2,
                                "taskName": "Global",
                                "typeOfUnit":"gm",
                                "units": "96",
                                "ratePerUnit": "89",
                                "totalCost":"234",
                                "beneficiaryContribution":"12",
                                "grantAmount":"234",
                                "yearOfSanction":"2009"
                            }
                        ]
                    }
                ]
            }
        ]
    }
]);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);

  const addProject = (project) => {
    setProjects((prev) => [...prev, project]);
    console.log(projects);
    setShowProjectModal(false);
  };

  const addBeneficiary = (beneficiary) => {
    setBeneficiaries((prev) => [...prev, beneficiary]);
    setShowBeneficiaryModal(false);
  };

  const handleSearch = (criteria) => {
    // Implement search logic here
  };

  return (
    <Container>
      <SearchBar onSearch={handleSearch} />
      <Button variant="primary" onClick={() => setShowProjectModal(true)}>
        Add Project
      </Button>
      <Button variant="primary" onClick={() => setShowBeneficiaryModal(true)}>
        Add Beneficiary
      </Button>

      <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectForm addProject={addProject} />
        </Modal.Body>
      </Modal>

      <Modal show={showBeneficiaryModal} onHide={() => setShowBeneficiaryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Beneficiary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BeneficiaryForm projects={projects} addBeneficiary={addBeneficiary} />
        </Modal.Body>
      </Modal>

      {/* <pre>{JSON.stringify({ projects, beneficiaries }, null, 2)}</pre> */}
      <BeneficiaryTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries}/>
    </Container>
  );
};

export default MainApp;
