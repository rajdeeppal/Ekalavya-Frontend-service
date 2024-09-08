import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const ProjectForm = ({ addProject }) => {
  
    const [project, setProject] = useState({
        projectName: '',
        projectType: '',
        category: '',
      });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
    
  };

  const handleSubmit = () => {
    addProject(project);
    console.log(project);
  };

  return (
    <Container className="mt-4">
      <Form>
        <Form.Group>
          <Form.Control type="text" name="projectName" placeholder="Project Name" onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Control type="text" name="projectType" placeholder="Project Type" onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Control type="text" name="category" placeholder="Category" onChange={handleChange} />
        </Form.Group>
        <Button variant="success" onClick={handleSubmit}>Submit</Button>
      </Form>
    </Container>
  );
};

export default ProjectForm;
