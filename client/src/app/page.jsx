"use client";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Container>
        <Row>
          <Col>
            {/*  Use hardcoded min-height to ensure consistent aspect ratio for cover image */}
            <div className="d-flex h-100 align-items-center"  style={{minHeight: '320px' }} >
              <div>
                <h1 className="fs-1 text-light fw-light mb-3">FORGE<span className="small text-warning fw-normal">db</span></h1>
                <hr className="border-white" />
                <p className="lead text-light">Explore candidate functional variants</p>

                <Form action={`${process.env.NEXT_PUBLIC_BASE_PATH}/explore`} className="mb-2">
                  <InputGroup className="border-white">
                    <Form.Control className="search-control-transparent fw-light ps-0" type="search" placeholder="Enter RSID" aria-label="Enter RSID" name="rsid" pattern="^rs\d+" required />
                    <Button variant="outline-secondary" className="search-control-transparent-button" type="submit">
                      <i className="bi bi-search"></i>
                      <span className="visually-hidden">Search</span>
                    </Button>
                  </InputGroup>
                </Form>

                <Link className="link-warning" href="/explore/?rsid=rs12203592">Example Analysis</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="bg-light py-5 flex-grow-1">
        <Container>
          <Row>
            <Col>
              <p>FORGEdb is an online tool designed to interpret genetic variants associated with diseases, focusing on variants found in genome-wide association studies (GWAS). Its purpose is to annotate the regulatory genome to identify relevant variants and target genes.</p>
              <p>The platform provides integrated data on individual genetic variants, including associated regulatory elements, transcription factor binding sites, and target genes. This information is derived from a wide range of biological samples to present a thorough regulatory context of each variant at the cellular level. Data forms include Combined Annotation Dependent Depletion (CADD) scores, expression quantitative trait loci (eQTLs), activity-by-contact (ABC) interactions, and transcription factor (TF) motifs.</p>
              <p>Notably, FORGEdb introduces a unique scoring system, the FORGEdb score. This score evaluates the functional importance of genetic variants, aiding researchers in prioritizing variants for functional validation. It uses extensive datasets, including those from ENCODE, Roadmap Epigenomics, and BLUEPRINT consortia. With FORGEdb, researchers can expedite their analysis of genetic loci, potentially accelerating discoveries in disease-associated genetic variants.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
