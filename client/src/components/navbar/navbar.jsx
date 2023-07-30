"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import clsx from "clsx";
import NavbarSearch from "./navbar-search";

function pathsMatch(path1, path2) {
  // remove trailing slash
  path1 = path1.replace(/\/$/, "");
  path2 = path2.replace(/\/$/, "");
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return [path2, basePath + path2].includes(path1);
}

export default function AppNavbar({ routes = [] }) {
  const pathName = usePathname();

  return (
    <Navbar bg="transparent" variant="dark" expand="md">
      <Container>
        <Navbar.Brand as={Link} href="/" className="d-flex d-md-none text-light">
          <h1 className="h5 fw-normal">
            FORGE<span className="fw-semibold small text-warning">db</span>
          </h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" className="px-0 py-3 text-uppercase">
          <i className="bi bi-list me-1"></i>
          Menu
        </Navbar.Toggle>
        <Navbar.Collapse id="navbar-nav" className="align-items-stretch">
          <Nav className="me-auto">
            {routes.map((route) => (
              <Link className={clsx("nav-link", pathsMatch(pathName, route.path) && "active")} key={route.path} href={route.path}>
                {route.title}
              </Link>
            ))}
          </Nav>
          {/* <NavbarSearch /> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
