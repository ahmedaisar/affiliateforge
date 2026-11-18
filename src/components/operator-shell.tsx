import { Link } from "react-router-dom";
import { Brand } from "@/components/brand";
import { SAMPLE } from "@/lib/data";

const NAV = [
  { to: "/stores", label: "Stores" },
  { to: "/stores/resin-miniatures/niche", label: "Briefs" },
  { to: "/stores/resin-miniatures/catalogue", label: "Catalogues" },
  { to: "/stores/resin-miniatures/gate", label: "Gates" },
  { to: "/stores/resin-miniatures/build", label: "Runs" },
];

export function OperatorShell({ children, current }: { children: React.ReactNode; current: string }) {
  return (
    <>
      <div className="topbar">
        <Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
          <Brand />
        </Link>
        <nav className="nav">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} aria-current={current === item.to ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="push" />
        {SAMPLE && <span className="tag">Sample data</span>}
        <span className="workspace-chip" style={{ marginLeft: "var(--sp-2)" }}>
          <span className="avatar">R</span> Ridge Media
        </span>
      </div>
      <div className="body-row">
        <main className="main">{children}</main>
      </div>
    </>
  );
}

export function EvidenceKind({ kind }: { kind: "observed" | "inference" | "assumption" }) {
  const modifier = kind === "observed" ? "tag--ok" : kind === "inference" ? "tag--accent" : "tag--warn";
  return <span className={`tag ${modifier}`}>{kind}</span>;
}
