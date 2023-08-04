"use client";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import { useState, useEffect } from "react";
import ResultsTable from "../../components/results-table";

import data from "./sample_data.json";

export default function Explore() {
  const [results, setResults] = useState({})
  const [search, setSearch] = useState("rs10")

  useEffect(() => {
    console.log(data)


    const summary = [
      { "Annotations": "RefSeq closest gene data", "Count": data.closestGene?.length || 0 },
      { "Annotations": "CADD v1.6 annotations", "Count": data.cadd?.length || 0 },
      { "Annotations": "GTEx cis-eQTLs", "Count": data.gtex?.length || 0 },
      { "Annotations": "eQTLGen blood cis-eQTLs", "Count": data.eqtlgen?.length || 0 },
      { "Annotations": "ABC contacts: ", "Count": data.abc?.length || 0 },
      { "Annotations": "FORGE2-TF motifs ", "Count": data.forge2TfMotif?.length || 0 },
      { "Annotations": "CATO score ", "Count": data.cato?.length || 0 },
      { "Annotations": "FORGE2 consolidated roadmap DNase I hotspots (erc2-DHS)", "Count": data.forge2["erc2-DHS"]?.length || 0 },
      { "Annotations": "FORGE2 consolidated roadmap H3 histone marks (erc2-H3-all)", "Count": data.forge2["erc2-H3-all"]?.length || 0 },
      { "Annotations": "FORGE2 unconsolidated roadmap DNase I hotspots (erc)", "Count": data.forge2["erc"]?.length || 0 },
      { "Annotations": "FORGE2 blueprint DNase I hotspots (blueprint)", "Count": data.forge2["blueprint"]?.length || 0 },
      { "Annotations": "FORGE2 ENCODE DNase I hotspots (encode)", "Count": data.forge2["encode"]?.length || 0 },
      { "Annotations": "FORGE2 consolidated roadmap chromatin states (erc2-15state)", "Count": data.forge2["erc2-chromatin15state-all"]?.length || 0 },
    ]

    var eqtlgen = [];

    if (data.eqtlgen.length) {
      const values = data.eqtlgen[0]
      eqtlgen = [{
        "Gene Symbol": values?.geneSymbol || "NA",
        "P-Value": values?.pvalue || "NA",
        "rsid": values?.snp || "NA",
        "SNP Chromosome": values?.snpChr || "NA",
        "SNP Position": values?.snpPos || "NA",
        "Assessed Allele": values?.assessedAllele || "NA",
        "Other Allele": values?.otherAllele || "NA",
        "Z-Score": values?.zscore || "NA",
        "Gene ID": values?.gene || "NA",
        "Gene Chromosome": values?.geneChr || "NA",
        "Gene Position": values?.genePos || "NA",
        "Number of Cohorts": values?.nrCohorts || "NA",
        "Number of Samples": values?.nrSamples || "NA",
        "FDR": values?.fdr || "NA",
        "Bonferroni P-Value": values?.bonferroniP || "NA",
      }]
    }

    var DHS = [];

    if (data.forge2["erc2-DHS"]?.length) {
      DHS = data.forge2["erc2-DHS"].map((e) => {
        console.log(e)
        return ({
          "Cell": e.cell,
          "Tissue": e.tissue,
          "Datatype": e.datatype,
          "Variant": search
        })
      })
    }

    var H3 = [];

    if (data.forge2["erc2-H3-all"]?.length) {
      H3 = data.forge2["erc2-H3-all"].map((e) => {
        return ({
          "Cell": e.cell,
          "Tissue": e.tissue,
          "Datatype": e.datatype,
          "Variant": search
        })
      })
    }

    var ERC = [];

    if (data.forge2["erc"]?.length) {
      ERC = data.forge2["erc"].map((e) => {
        return ({
          "Cell": e.cell,
          "Tissue": e.tissue,
          "Datatype": e.datatype,
          "Variant": search
        })
      })
    }

    var blueprint = [];

    if (data.forge2["blueprint"]?.length) {
      blueprint = data.forge2["blueprint"].map((e) => {
        return ({
          "Cell": e.cell,
          "Tissue": e.tissue,
          "Datatype": e.datatype,
          "Variant": search
        })
      })
    }

    var encode = [];

    if (data.forge2["encode"]?.length) {
      encode = data.forge2["encode"].map((e) => {
        return ({
          "Cell": e.cell,
          "Tissue": e.tissue,
          "Datatype": e.datatype,
          "Variant": search
        })
      })
    }
    
    var chromatin = [];

    if (data.forge2["erc2-chromatin15state-all"]?.length) {
      chromatin = data.forge2["erc2-chromatin15state-all"].map((e) => {
        return ({
          "Cell": e.cell,
          "Tissue": e.tissue,
          "Datatype": e.datatype,
          "Variant": search
        })
      })
    }

    setResults({
      summary: summary,
      closestGene: data.closestGene || [],
      eqtlgen: eqtlgen,
      abc: data.abc || [],
      cato: data.cato || [],
      DHS: DHS,
      H3: H3,
      ERC: ERC,
      blueprint: blueprint,
      encode: encode,
      chromatin: chromatin,
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
                  <ResultsTable results={results.summary} pagination={false} />
                </Tab>
                <Tab eventKey="closestGene" title="Closest Gene">
                  <ResultsTable results={results.closestGene} pagination={false} />
                </Tab>
                <Tab eventKey="eqtlGen" title="eqtlGen" >
                  <ResultsTable results={results.eqtlgen} pagination={false} />
                </Tab>
                <Tab eventKey="abc" title="Activity-By-Contact">
                  <ResultsTable results={results.abc} pagination={false} />
                </Tab>
                <Tab eventKey="cato" title="CATO">
                  <ResultsTable results={results.cato} pagination={false} />
                </Tab>
                <Tab eventKey="DHS" title="FORGE2 rs10.erc2-DHS">
                  <ResultsTable results={results.DHS} pagination={true} />
                </Tab>
                <Tab eventKey="H3" title="FORGE2 rs10.erc2-H3-all">
                  <ResultsTable results={results.H3} pagination={true} />
                </Tab>
                <Tab eventKey="ERC" title="FORGE2 rs10.erc">
                  <ResultsTable results={results.ERC} pagination={true} />
                </Tab>
                <Tab eventKey="blueprint" title="FORGE2 rs10.blueprint">
                  <ResultsTable results={results.blueprint} pagination={true} />
                </Tab>
                <Tab eventKey="encode" title="FORGE2 rs10.encode">
                  <ResultsTable results={results.encode} pagination={true} />
                </Tab>
                <Tab eventKey="chromatin" title="FORGE2 rs10.erc2-chromatin15state-all">
                  <ResultsTable results={results.chromatin} pagination={true} />
                </Tab>
              </Tabs>
            </article>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
