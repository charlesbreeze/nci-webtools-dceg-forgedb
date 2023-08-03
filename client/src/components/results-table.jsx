import { useState } from "react";
import { useSetRecoilState } from "recoil";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";


export default function ResultsTable({ results = [], pagination = true }) {
  
  //TODO: Determine default sorting of each table
  const [sorting, setSorting] = useState([{ id: "rsid", desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  
  const columnNames = Object.keys(results?.[0] || []);

  const localeSort = (a, b) => {
    return a.original.localeCompare(b.original)
  }

  const columns = columnNames.map((key) => ({
    Header: key,
    accessorKey: key,
    className: "text-nowrap align-middle",
    sortingFn: "auto",
    cell: (e) =>
    (
      e.getValue()
    ),
  }));

  const table = useReactTable({
    data: results,
    columns: columns,
    state: {
      //columnFilters,
      sorting,
    },
    sortingFns: {
      localeSort,
    },
    //onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    //getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState:{
      pagination: {
        pageSize: pagination ? 10 : Number.MAX_SAFE_INTEGER
      }
    }
  
  });
  return (
    <>
      <Table striped hover responsive>
        <thead style={{ position: "sticky", top: "0px", backgroundColor: "#f8f9fa" }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className={header.column.columnDef.className}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div className={header.column.getCanSort() ? "cursor-pointer" : ""} onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className="bi bi-sort-up ms-1" />,
                          desc: <i className="bi bi-sort-down ms-1" />,
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                      {/*<div>
                        <Form.Control type="input" onChange={(e) => header.column.setFilterValue(e.target.value)} placeholder={"Filter..."} />
                      </div>*/}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="mx-3" style={{ overflowY: "scroll" }}>
          {table.getRowModel().rows.map((row) => (
            <tr>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={cell.column.columnDef.className}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {pagination ? <div className="d-flex flex-wrap justify-content-between align-items-center">
        <small>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </small>
        <div className="d-flex flex-wrap">
          <Form.Select
            size="sm"
            aria-label="table-pagination"
            className="w-auto me-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Form.Select>
          <Pagination className="mb-0" size="sm">
            <Pagination.First onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <span className="d-none d-md-inline-block">First</span>
              <span className="d-inline-block d-md-none">&lt;&lt;</span>
            </Pagination.First>
            <Pagination.Prev onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <span className="d-none d-md-inline-block">Previous</span>
              <span className="d-inline-block d-md-none">&lt;</span>
            </Pagination.Prev>

            <Pagination.Next onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <span className="d-none d-md-inline-block">Next</span>
              <span className="d-inline-block d-md-none">&gt;</span>
            </Pagination.Next>

            <Pagination.Last onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <span className="d-none d-md-inline-block">Last</span>
              <span className="d-inline-block d-md-none">&gt;&gt;</span>
            </Pagination.Last>
          </Pagination>
        </div>
      </div> : <></>}
    </>
  );
}
