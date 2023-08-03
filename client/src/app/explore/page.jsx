"use client";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import { useState, useEffect } from "react";
import ResultsTable from "../../components/results-table";

import data from "./sample_data.json"; 

export default function Explore() {
  const [results, setResults] = useState({})

  useEffect(() => {
    console.log(data)


    const summary = [
      { "Annotations": "RefSeq closest gene data", "Count": data.closestGene?.length || 0},
      { "Annotations": "CADD v1.6 annotations", "Count": data.cadd?.length || 0},
      { "Annotations": "GTEx cis-eQTLs", "Count": data.gtex?.length || 0},
      { "Annotations": "eQTLGen blood cis-eQTLs", "Count": data.eqtlgen?.length || 0 },
      { "Annotations": "ABC contacts: ", "Count": data.abc?.length || 0 },
      { "Annotations": "FORGE2-TF motifs ", "Count": data.forge2TfMotif?.length || 0},
      { "Annotations": "CATO score ", "Count": data.cato?.length || 0 },
      { "Annotations": "FORGE2 consolidated roadmap DNase I hotspots (erc2-DHS)", "Count": data.forge2["erc2-DHS"]?.length || 0 },
      { "Annotations": "FORGE2 consolidated roadmap H3 histone marks (erc2-H3-all)", "Count": data.forge2["erc2-H3-all"]?.length || 0 },
      { "Annotations": "FORGE2 unconsolidated roadmap DNase I hotspots (erc)", "Count": data.forge2["erc"]?.length || 0 },
      { "Annotations": "FORGE2 blueprint DNase I hotspots (blueprint)", "Count": data.forge2["blueprint"]?.length || 0 },
      { "Annotations": "FORGE2 ENCODE DNase I hotspots (encode)", "Count": data.forge2["encode"]?.length || 0 },
      { "Annotations": "FORGE2 consolidated roadmap chromatin states (erc2-15state)", "Count": data.forge2["erc2-chromatin15state-all"]?.length || 0 },
    ]

    setResults({
      summary: summary,
      closestGene: data.closestGene || [],
    })
  }, [data])

  return (
    <div className="flex-grow-1 bg-light">
      <Container className="py-5">
        <Row>
          <Col>
            <article className="shadow p-4 rounded">
              <h1 className="text-primary h3 mb-4">Explore Functional SNP</h1>
              <hr />
              <Tabs
                defaultActiveKey="summary"
                className="mb-3"
              >
                <Tab eventKey="summary" title="Summary">
                  <ResultsTable results={results.summary} pagination={false}/>
                </Tab>
                <Tab eventKey="closestGene" title="Closest Gene">
                  <ResultsTable results={results.closestGene} pagination={false}/>
                </Tab>
              </Tabs>
            </article>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
