"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr/immutable";
import { fetchBatch, getForgeDbScore, getRowFilter } from "./utils.js";

export default function Explore() {
  const searchParams = useSearchParams();
  const rsid = searchParams.get("rsid");
  const [search, setSearch] = useState("");

  const { data: datasetsResponse, error: datasetsError, isLoading: datasetsLoading } = useSWR([`${process.env.NEXT_PUBLIC_BASE_PATH}/api/datasets.json`], fetchBatch);
  const datasets = datasetsResponse ? datasetsResponse[0] : [];
  const schemaQueries = datasets.map(({ name, forgedb_versions }) => `${process.env.NEXT_PUBLIC_BASE_PATH}/api/${name}/${forgedb_versions[0].version}/schema.json`);
  const tableQueries = datasets.map(({ name, forgedb_versions }) => `${process.env.NEXT_PUBLIC_BASE_PATH}/api/${name}/${forgedb_versions[0].version}/${rsid}.json`);
  const { data: schemaData, error: schemaError, isLoading: schemaLoading } = useSWR(schemaQueries, fetchBatch);
  const { data: tableData, error: tableError, isLoading: tableLoading } = useSWR(tableQueries, fetchBatch);

  // combine datasets, schema, and table data
  const isLoading = datasetsLoading || schemaLoading || tableLoading;
  const data = datasets?.map(({ name, forgedb_versions }, index) => ({
    name,
    version: forgedb_versions[0]?.version,
    schema: schemaData?.[index] || null,
    originalTable: tableData?.[index]?.data,
    table: tableData?.[index]?.data?.filter(getRowFilter(search, schemaData?.[index])),
  }));
  const forgeDbScore = getForgeDbScore(data);
  const closestGene = data?.find((d) => d.name === "closest_gene")?.originalTable?.[0];

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-flex flex-wrap align-items-baseline py-3">
              <h1 className="fs-1 text-light fw-light me-2">
                FORGE<small className="fw-normal text-warning">db</small> Summary for
              </h1>

              <form action={`${process.env.NEXT_PUBLIC_BASE_PATH}/explore`} className="mb-2">
                <div className="input-group border-bottom border-white border-2">
                  <input className="form-control bg-transparent border-0 shadow-0 no-clear-control text-light placeholder-light fw-light ps-0 fs-1" type="search" placeholder="rsid" defaultValue={rsid} aria-label="Enter RSID" name="rsid" pattern="^rs\d+" required style={{ width: "200px" }}  />
                  <button className="btn btn-outline-secondary bg-transparent border-0 text-light fs-3" type="submit">
                    <i className="bi bi-search"></i>
                    <span className="visually-hidden">Search</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow-1 bg-white py-5">
        <div className="container">
          <div className="row">
            <div className="col">
              {!rsid && !isLoading && <h1 className="fs-2 fw-light">Please enter an RSID to view summary-level data.</h1>}
              {rsid && isLoading && <h1 className="fs-2 fw-light">Loading results</h1>}
              {rsid && !isLoading && (
                <>
                  <div className="d-flex mb-3">
                    <div className="me-3 form-floating d-inline-block">
                      <input className="form-control w-auto" id="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
                      <label htmlFor="search">Search</label>
                    </div>
                  </div>

                  <h2 className="fs-5 fw-semibold mb-1 d-flex align-items-baseline justify-content-between">
                    <span>
                      Summary and number of annotations for {rsid} <Link href="/about">(FORGEdb score={forgeDbScore})</Link>
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
                        {data
                          ?.filter((d) => d.schema)
                          ?.map(({ name, schema, table }, index) => (
                            <tr key={`${index}_${name}`}>
                              <th className="fw-normal">{schema.shortTitle || schema.title}</th>
                              <td>
                                <a href={`#${name}`}> {table?.length || 0}</a>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {data
                    ?.filter((d) => d.schema)
                    ?.map(({ name, schema, table }, index) => (
                      <div key={index}>
                        <h2 className="fs-5 fw-semibold mb-1" id={name} dangerouslySetInnerHTML={{ __html: schema.title }} />

                        <div className="table-responsive mb-5" style={{ maxHeight: "800px" }} key={index}>
                          <table className="table table-sm table-striped table-hover shadow-lg border" tabIndex={0}>
                            <thead className="position-sticky top-0">
                              <tr>
                                {schema.columns.map(({ name, label, description, style }, index) => (
                                  <th key={`${name}_${index}`} className="small text-muted fw-bold bg-light text-uppercase" title={description} style={style}>
                                    {label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {table?.map((row, index) => (
                                <tr key={index}>
                                  {schema.columns.map(({ name, defaultValue }, index) => (
                                    <td key={`${name}_${index}`} className="text-nowrap">{row[name] ?? defaultValue}</td>
                                  ))}
                                </tr>
                              ))}
                              {!table?.length && (
                                <tr>
                                  <td colSpan={schema.columns.length} className="text-center p-2">
                                    No data available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
