"use client";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SwaggerUI from "swagger-ui-react"
import spec from "./openapi.json"
spec.servers = [{url: process.env.NEXT_PUBLIC_BASE_PATH }]

export default function ApiAccess() {
  return (
    <div className="flex-grow-1 bg-white py-4">
      <Container>
        <Row>
          <Col>
            <article>
              <h1 className="fs-1 fw-light">API Access</h1>
              <hr/>
              <SwaggerUI spec={spec} />
            </article>
          </Col>
        </Row>
      </Container>
    </div>
  );
}