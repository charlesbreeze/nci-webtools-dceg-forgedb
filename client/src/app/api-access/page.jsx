"use client";
import SwaggerUI from "swagger-ui-react"
import spec from "./openapi.json"
spec.servers = [{url: process.env.NEXT_PUBLIC_BASE_PATH }]

export default function ApiAccess() {
  return (
    <div className="flex-grow-1 bg-white py-4">
      <div className="container">
        <div className="row">
          <div className="col">
            <article>
              <h1 className="fs-1 fw-light">API Access</h1>
              <hr/>
              <SwaggerUI spec={spec} />
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}