"use client";
import Link from 'next/link';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Home() {
  return (
    <>
      <div className="bg-primary-dark">
        <div className="cover-image">
          <Container>
            <Row>
              <Col md={12}>
                <div className="d-flex h-100 text-align-center align-items-center py-5">
                  <div>
                    <h1 className="font-title text-light mb-3">Functional SNP</h1>
                    <hr className="border-white" />
                    <p className="lead text-light">Explore Functional SNP Databases.</p>
                    <Link href="/explore" className="btn btn-lg btn-outline-light text-decoration-none">
                      Explore Database
                    </Link>
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
                A web-based tool designed to enable the exploration of DNase I tag (chromatin accessibility) signal surrounding GWAS array SNPs and the calculation of significance of overlap with transcription factor binding sites from common TF databases.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
