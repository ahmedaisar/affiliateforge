import { Link } from "react-router-dom";
import { Brand } from "@/components/brand";

const NAV = [
  { href: "/pricing", label: "Pricing" },
  { href: "/legal/terms", label: "Terms" },
];

export function SiteHeader({ current }: { current?: string }) {
  return (
    <div className="topbar">
      <Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
        <Brand />
      </Link>
      <nav className="nav">
        {NAV.map((item) => (
          <Link key={item.href} to={item.href} aria-current={current === item.href ? "page" : undefined}>
            {item.label}
          </Link>
        ))}
      </nav>
      <span className="push" />
      <Link to="/stores" className="btn">Stores</Link>
    </div>
  );
}
