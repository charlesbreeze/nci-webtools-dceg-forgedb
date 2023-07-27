"use client";
import Link from 'next/link';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";


export default function Home() {
  return (
    <>
      <div className="bg-black">
        <div className="cover-image" style={{backgroundImage: `url('/assets/forgedb-background.svg')`}}>
          <Container>
            <Row>
              <Col md={12}>
                <div className="d-flex h-100 text-align-center align-items-center justify-content-center py-5">
                  <div className="text-center my-5">
                    <h1 className="fs-1 text-light fw-light mb-3">FORGE<span className="small text-warning fw-normal">db</span></h1>
                    <hr className="border-white" />
                    <p className="lead text-light">Explore candidate functional variants</p>

                    <Form action="/explore">
                      <InputGroup className="border-white">
                        <Form.Control className="search-control-transparent fw-light text-center" type="search"  placeholder="Enter RSID" aria-label="Enter RSID" name="rsid" required />
                        <Button variant="outline-secondary" className="search-control-transparent-button position-absolute" style={{right: 0, zIndex: 9999}} type="submit">
                          <i className="bi bi-search"></i>
                          <span className="visually-hidden">Search</span>
                        </Button>
                      </InputGroup>
                    </Form>

                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <div className="bg-light py-5">
        <Container>
          <Row>
            <Col>
              <p>
                FORGEdb is a web-based tool that helps researchers understand the role of specific genetic variants, especially those related to diseases. It does this by collecting and integrating a wide range of data related to these variants, like their association with specific genes or their impact on gene regulation. The tool then gives each variant a score to help researchers decide which ones might be most important to study further.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
