"use client";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SwaggerUI from "swagger-ui-react"
import spec from "./openapi.json"
spec.servers = [{url: process.env.NEXT_PUBLIC_BASE_PATH }]

export default function ApiAccess() {
  return (
    <div className="flex-grow-1 bg-light py-5">
      <Container>
        <Row>
          <Col>
            <article className="shadow p-4 rounded">
              <h1 className="text-primary h3 mb-4">API Access</h1>
              <hr/>
              <SwaggerUI spec={spec} />
            </article>
          </Col>
        </Row>
      </Container>
    </div>
  );
}