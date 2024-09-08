import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
  const [searchCriteria, setSearchCriteria] = React.useState({
    state: '',
    district: '',
    projectName: '',
    projectType: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onSearch(searchCriteria);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={2}>
          <Form.Control type="text" name="state" placeholder="State" onChange={handleChange} />
        </Col>
        <Col md={2}>
          <Form.Control type="text" name="district" placeholder="District" onChange={handleChange} />
        </Col>
        <Col md={2}>
          <Form.Control type="text" name="projectName" placeholder="Project Name" onChange={handleChange} />
        </Col>
        <Col md={2}>
          <Form.Control type="text" name="projectType" placeholder="Project Type" onChange={handleChange} />
        </Col>
        <Col md={2}>
          <Form.Control type="text" name="category" placeholder="Category" onChange={handleChange} />
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={handleSearch}>Search</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchBar;
