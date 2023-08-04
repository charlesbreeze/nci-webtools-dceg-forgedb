"use client";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

const fetchBatch = (requests) => Promise.all(requests.map((request) => fetch(request).then((res) => res.json())));
// const fetcher = (...args) => fetch(...args).then((res) => res.json())

function getForgeDbScore(data) {
  let score = 0;
  const mapping = {
    eqtl: { 
      names: ["eqtlgen", "gtex"],
      score: 2
    },
    abc: {
      names: ["abc"],
      score: 2
    },
    forge2tf: {
      names: ["forge2tf"],
      score: 1
    },
    cato: {
      names: ["cato"],
      score: 1
    },
    forge2DNase: {
      names: ["forge2.erc2-DHS", "forge2.erc", "forge2.encode", "forge2.blueprint"],
      score: 2
    },
    forge2H3: {
      names: ["forge2.erc2-H3-all"],
      score: 2
    }
  }

  // for each mapping, check if any of the datasets are present and have data
  for (const { names, score: mappingScore } of Object.values(mapping)) {
    if (data.some(({ name, table }) => names.includes(name) && table?.data?.length > 0)) {
      score += mappingScore;
    }
  }

  return score;
}

export default function Explore() {
  const searchParams = useSearchParams();
  const rsid = searchParams.get("rsid");
  const [tissue, setTissue] = useState("");
  const [search, setSearch] = useState("");

  const { data: datasetsResponse, error: datasetsError } = useSWR([`${process.env.NEXT_PUBLIC_BASE_PATH}/api/datasets.json`], fetchBatch);
  const datasets = datasetsResponse ? datasetsResponse[0] : [];
  const schemaQueries = datasets.map(({ name, versions }) => `${process.env.NEXT_PUBLIC_BASE_PATH}/api/${name}/${versions[0]}/schema.json`);
  const tableQueries = datasets.map(({ name, versions }) => `${process.env.NEXT_PUBLIC_BASE_PATH}/api/${name}/${versions[0]}/${rsid}.json`);

  const { data: schemaData, error: schemaError } = useSWR(schemaQueries, fetchBatch);
  const { data: tableData, error: tableError } = useSWR(tableQueries, fetchBatch);

  const tissues = Array.from(
    new Set(
      (tableData || [])
        .map((d) => d.data?.map((r) => r.Tissue))
        .flat()
        .filter(Boolean)
    )
  ).sort();

  const data = datasets.map(({ name, versions }, index) => ({
    name,
    version: versions[0],
    schema: schemaData?.[index] || null,
    table: {
      data: tableData?.[index]?.data?.filter((row) => {
        let query = (search.trim() || "").toLowerCase();
       if (query) {
          return Object.values(row).some((value) => String(value).toLowerCase().includes(query));
        }
        return (!row.Tissue || !tissue) || (row.Tissue === tissue);
      }),
    },
  }));

  const closestGene = data.find((d) => d.name === "closestGene")?.table?.data?.[0];
  const forgedbScore = getForgeDbScore(data);
  
  return (
    <>
      <div className="bg-black">
        <Container>
          <Row>
            <Col>
              <div className="d-flex flex-wrap align-items-baseline py-3">
                <h1 className="fs-1 text-light fw-light me-2">
                  FORGE<small className="fw-normal text-warning">db</small> Summary for
                </h1>

                <Form action={`${process.env.NEXT_PUBLIC_BASE_PATH}/explore`} className="mb-2">
                  <InputGroup className="border-white">
                    <Form.Control className="search-control-transparent fs-1 fw-light ps-0" type="search" placeholder="rsid" aria-label="rsid" name="rsid" defaultValue={rsid} required style={{ width: "200px" }} pattern="^rs\d+" />
                    <Button variant="outline-secondary" className="fs-1 search-control-transparent-button" type="submit">
                      <i className="bi bi-search"></i>
                      <span className="visually-hidden">Search</span>
                    </Button>
                  </InputGroup>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="flex-grow-1 bg-white py-5">
        <Container>
          <Row>
            <Col>
              {!rsid && (
                <>
                  <h1 className="fs-2 fw-light">Please enter an RSID to view summary-level data.</h1>
                </>
              )}

              {rsid && (
                <>
                  <div className="d-flex mb-3">
                    <div className="me-3 form-floating d-inline-block">
                      <input className="form-control w-auto" id="search" placeholder="Search" id="search" value={search} onChange={e => setSearch(e.target.value)} />
                      <label htmlFor="search">Search</label>
                    </div>
                  </div>

                  <h2 className="fs-5 fw-semibold mb-1 d-flex align-items-baseline justify-content-between">
                    <span>
                      Summary and number of annotations for {rsid} <Link href="/about">(FORGEdb score={forgedbScore})</Link>
                    </span>
                    {closestGene && (
                      <a className="small" target="_blank" href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&position=${closestGene.chr}%3A${closestGene.start}-${closestGene.start}`}>
                        UCSC genome browser link (hg19)
                      </a>
                    )}
                  </h2>
                  <div className="table-responsive mb-5">
                    <table className="table table-sm table-hover table-striped shadow-lg border">
                      <tbody>
                        {data?.map(
                          ({ name, schema, table }, index) =>
                            schema && (
                              <tr>
                                <th className="fw-normal">{schema.shortTitle || schema.title}</th>
                                <td>
                                  <a href={`#${name}`}> {table?.data?.length || 0}</a>
                                </td>
                              </tr>
                            )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {data.map(
                    ({ name, schema, table }, index) =>
                      schema && (
                        <>
                          <h2 className="fs-5 fw-semibold mb-1" id={name}>
                            {schema.title}
                          </h2>

                          <div className="table-responsive mb-5" style={{maxHeight: '800px'}}  key={index}>
                            <table className="table table-sm table-striped table-hover shadow-lg border">
                              <thead className="position-sticky top-0">
                                <tr>
                                  {schema.columns.map(({ name, label }) => (
                                    <th key={name} className="small text-muted fw-bold bg-light text-uppercase">
                                      {label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {table?.data?.map((row, index) => (
                                  <tr key={index}>
                                    {schema.columns.map(({ name }) => (
                                      <td key={name}>{row[name]}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
