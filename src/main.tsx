import React from "react";
import ReactDOM from "react-dom/client";
import { ExternalLink, Gift } from "lucide-react";
import "./style.css";

// --- Data ---
type WishlistData = {
  name: string;
  links: string[];
};

const rawData: WishlistData[] = [
  {
    name: "Nick",
    links: ["https://www.amazon.com/hz/wishlist/ls/3INV57XVRHES?ref_=wl_share"],
  },
  {
    name: "Laurie",
    links: [
      "https://www.amazon.com/hz/wishlist/ls/112FJYSVEASO3/ref=cm_go_nav_hz",
    ],
  },
  {
    name: "Ryan",
    links: ["https://www.amazon.com/hz/wishlist/ls/NCKRG6TZZ1J5?ref_=wl_share"],
  },
  {
    name: "Grant",
    links: ["https://www.amazon.com/hz/wishlist/ls/IZSXP3V7MEUE?ref_=wl_share"],
  },
  {
    name: "Eva",
    links: [
      "https://www.amazon.com/hz/wishlist/ls/38RV7VQNSCA4I?ref_=list_d_wl_ys_list_4",
      "www.target.com/lists/shared/8470e380-b06d-11f0-baf3-1131ecd41fef?listSubType=CUSTOM",
    ],
  },
];

// --- Icons ---

const AmazonLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 40"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Amazon"
  >
    {/* Amazon text */}
    <text
      x="8"
      y="20"
      fontFamily="Arial, sans-serif"
      fontSize="18"
      fontWeight="bold"
      fill="currentColor"
    >
      amazon
    </text>
    {/* Smile arrow from 'a' to 'z' */}
    <path
      d="M 15 26 Q 50 32, 85 26"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* Arrow tip */}
    <path d="M 82 23 L 85 26 L 83 29" fill="currentColor" />
  </svg>
);

const TargetLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    role="img"
    aria-label="Target"
  >
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.909c3.916 0 7.091 3.175 7.091 7.091S15.916 19.091 12 19.091 4.909 15.916 4.909 12 8.084 4.909 12 4.909zm0 3.273c-2.109 0-3.818 1.709-3.818 3.818S9.891 15.818 12 15.818 15.818 14.109 15.818 12 14.109 8.182 12 8.182z" />
  </svg>
);

// --- Branding Helper ---
type BrandStyle = {
  name: string;
  icon: React.ReactNode;
  bgClass: string;
  borderClass: string;
  textClass: string;
  hoverClass: string;
  darkHoverClass: string;
  badgeClass: string;
};

const getBrandStyle = (url: string): BrandStyle => {
  const normalizedUrl = url.toLowerCase();

  if (normalizedUrl.includes("amazon")) {
    return {
      name: "Amazon",
      icon: <AmazonLogo className="w-5 h-5" />,
      bgClass: "bg-orange-50 dark:bg-orange-950/30",
      borderClass: "border-orange-200 dark:border-orange-800",
      textClass: "text-orange-700 dark:text-orange-400",
      hoverClass: "hover:border-orange-400 hover:shadow-orange-200",
      darkHoverClass:
        "dark:hover:border-orange-500 dark:hover:shadow-orange-900/40",
      badgeClass:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
  }

  if (normalizedUrl.includes("target")) {
    return {
      name: "Target",
      icon: <TargetLogo className="w-5 h-5" />,
      bgClass: "bg-red-50 dark:bg-red-950/30",
      borderClass: "border-red-200 dark:border-red-800",
      textClass: "text-red-700 dark:text-red-400",
      hoverClass: "hover:border-red-400 hover:shadow-red-200",
      darkHoverClass: "dark:hover:border-red-500 dark:hover:shadow-red-900/40",
      badgeClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
  }

  // Default / Generic
  return {
    name: "Wishlist",
    icon: <ExternalLink className="w-5 h-5" />,
    bgClass: "bg-slate-50 dark:bg-slate-800/50",
    borderClass: "border-slate-200 dark:border-slate-700",
    textClass: "text-slate-700 dark:text-slate-300",
    hoverClass: "hover:border-slate-400 hover:shadow-slate-200",
    darkHoverClass:
      "dark:hover:border-slate-500 dark:hover:shadow-slate-900/40",
    badgeClass:
      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  };
};

const normalizeUrl = (url: string) => {
  if (!url.startsWith("http") && !url.startsWith("//")) {
    return `https://${url}`;
  }
  return url;
};

// --- Components ---

const LinkItem = ({ url }: { url: string }) => {
  const safeUrl = normalizeUrl(url);
  const style = getBrandStyle(safeUrl);

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group flex items-center p-4 mb-3 rounded-xl border-2 transition-all duration-300 ease-in-out
        ${style.bgClass} ${style.borderClass}
        ${style.hoverClass} ${style.darkHoverClass}
        hover:-translate-y-1 hover:shadow-lg
        relative overflow-hidden
      `}
    >
      {/* Background decoration */}
      <div className="absolute right-0 top-0 opacity-[0.03] transform translate-x-1/4 -translate-y-1/4 pointer-events-none group-hover:opacity-[0.07] transition-opacity">
        {React.cloneElement(style.icon as React.ReactElement, {
          // @ts-ignore
          className: "w-32 h-32",
        })}
      </div>

      {/* Icon */}
      <div
        className={`p-3 rounded-lg bg-white dark:bg-gray-900 shadow-sm mr-4 transition-transform group-hover:scale-110 ${style.textClass}`}
      >
        {style.icon}
      </div>

      {/* Text Content */}
      <div className="flex-1 z-10">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badgeClass}`}
          >
            {style.name}
          </span>
        </div>
        <p
          className={`text-sm font-medium opacity-80 truncate max-w-[200px] sm:max-w-[300px] ${style.textClass}`}
        >
          {safeUrl.replace(/^https?:\/\/(www\.)?/, "")}
        </p>
      </div>

      {/* Arrow Indicator */}
      <div
        className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${style.textClass}`}
      >
        <ExternalLink className="w-5 h-5" />
      </div>
    </a>
  );
};

const PersonCard = ({ data, index }: { data: WishlistData; index: number }) => {
  // Stagger animation delay based on index
  const animationDelay = `${index * 100}ms`;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards"
      style={{ animationDelay }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
          {data.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {data.name}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {data.links.length}{" "}
            {data.links.length === 1 ? "Wishlist" : "Wishlists"}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {data.links.map((link, i) => (
          <LinkItem key={i} url={link} />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen transition-colors duration-500 bg-gray-50 dark:bg-gray-950">
      <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Wishlists
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-3xl mx-auto px-6 py-8 md:py-12">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              Gift Ideas & Lists
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Curated collections from Amazon, Target, and more. Click any card
              below to view the details directly on the retailer's site.
            </p>
          </div>

          <div className="grid gap-6">
            {rawData.map((person, index) => (
              <PersonCard key={person.name} data={person} index={index} />
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm gap-4"></footer>
        </main>
      </div>
    </div>
  );
}

// Render the app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
