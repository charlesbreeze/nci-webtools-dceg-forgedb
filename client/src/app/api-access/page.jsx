"use client";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SwaggerUI from "swagger-ui-react"
import { useRecoilValue } from "recoil";
import { specSelector } from "./state";

export default function ApiAccess() {
  const spec = useRecoilValue(specSelector);
  return (
    <Container className="py-5">
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
  );
}