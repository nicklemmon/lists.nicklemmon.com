import React from "react";
import ReactDOM from "react-dom/client";
import { ArrowUpRight, ChevronDown, Gift } from "lucide-react";
import "./style.css";

const wishlists = [
  { name: "Nick", group: "Adults", url: "https://www.amazon.com/hz/wishlist/ls/3INV57XVRHES?ref_=wl_share", color: "sage" },
  { name: "Laurie", group: "Adults", url: "https://www.amazon.com/hz/wishlist/ls/112FJYSVEASO3/ref=cm_go_nav_hz", color: "rose" },
  { name: "Eva", group: "Kids", ugiftCode: "75A-968", url: "https://www.giftster.com/list/iNUcN/", color: "rose" },
  { name: "Grant", group: "Kids", ugiftCode: "76K-P7S", url: "https://www.giftster.com/list/6nVb0/", color: "sage" },
  { name: "Ryan", group: "Kids", ugiftCode: "C9T-B6D", url: "https://www.giftster.com/list/csPVk/", color: "gold" },
];

type Theme = "system" | "light" | "dark";

export default function App() {
  const [theme, setTheme] = React.useState<Theme>(() => {
    const saved = document.documentElement.dataset.theme;
    return saved === "light" || saved === "dark" ? saved : "system";
  });

  const changeTheme = (value: Theme) => {
    setTheme(value);
    document.documentElement.dataset.theme = value;
    try { localStorage.setItem("wishlist-theme", value); } catch { /* Theme still works when storage is unavailable. */ }
  };
  return (
    <div className="page">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Wishlists for the Lemmon/Grahams home">
          <Gift size={21} strokeWidth={1.6} />
          <span>Wishlists for the Lemmon/Grahams</span>
        </a>
        <div className="header-actions">
          <label className="theme-control">
            <span>Theme</span>
            <span className="theme-select">
            <select value={theme} onChange={(event) => changeTheme(event.target.value as Theme)}>
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
            </span>
          </label>
        </div>
      </header>

      <main>
        {["Kids", "Adults"].map((group) => (
        <section className="list-section" aria-labelledby={`${group}-heading`} key={group}>
          <div className="section-heading">
            <h2 id={`${group}-heading`}>{group}</h2>
            <span>{String(wishlists.filter((person) => person.group === group).length).padStart(2, "0")} WISHLISTS</span>
          </div>
          <div className="cards">
            {wishlists.filter((person) => person.group === group).map(({ name, url, color, ugiftCode }, index) => (
              <article className={`wishlist-card ${color}`} key={name} aria-label={`${name}’s gift ideas`} style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}>
                <div className="monogram" aria-hidden="true">{name.charAt(0)}</div>
                <div className="card-title"><span className="card-eyebrow">Wishlists for</span><h3>{name}</h3></div>
                <div className="card-bottom">
                  <a className="card-action" href={url} target="_blank" rel="noopener noreferrer" aria-label={`View ${name}’s wishlist (opens in a new tab)`}>View wishlist <ArrowUpRight size={16} /></a>
                  <span className="provider">{url.includes("amazon.com") ? "Amazon" : "Giftster"}</span>
                </div>
                {ugiftCode && (
                  <div className="card-bottom">
                    <a className="card-action" href={`https://www.ugift529.com/gifttpl/ugift/create/viewGiftCodeDetails.cs?ugiftcode=${encodeURIComponent(ugiftCode)}`} target="_blank" rel="noopener noreferrer" aria-label={`Contribute to ${name}’s college savings (opens in a new tab)`}>Contribute to 529 <ArrowUpRight size={16} /></a>
                    <span className="provider">Ugift 529</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
        ))}
        <p className="list-note"><Gift size={15} strokeWidth={1.5} /> Wishlist links open on Amazon or Giftster. College savings links open on Ugift.</p>
      </main>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
