import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import Navbar from "./components/Navbar.tsx";
import ParallaxBackground from "./components/ParallaxBackground.tsx";
import Sidebar from "./components/Sidebar.tsx";
import CustomCursor from "./components/CustomCursor.tsx";
import { MixerProvider, useMixer } from "./state/MixerContext.tsx";
import { routeLabel, routes } from "./routes.ts";
import Landing from "./pages/Landing.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Deposit from "./pages/Deposit.tsx";
import Pool from "./pages/Pool.tsx";
import Withdraw from "./pages/Withdraw.tsx";
import Attacks from "./pages/Attacks.tsx";
import PinZkp from "./pages/PinZkp.tsx";
import MerkleTree from "./pages/MerkleTree.tsx";
import Report from "./pages/Report.tsx";
import About from "./pages/About.tsx";

const pages: Record<string, ComponentType<any>> = {
  "/": Landing,
  "/dashboard": Dashboard,
  "/deposit": Deposit,
  "/pool": Pool,
  "/withdraw": Withdraw,
  "/attacks": Attacks,
  "/pin-zkp": PinZkp,
  "/merkle-tree": MerkleTree,
  "/report": Report,
  "/about": About,
};

function RouterShell() {
  const [pathname, setPathname] = useState(window.location.pathname in pages ? window.location.pathname : "/");
  const [darkMode, setDarkMode] = useState(true);
  const { ready } = useMixer();

  useEffect(() => {
    const pop = () => setPathname(window.location.pathname in pages ? window.location.pathname : "/");
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);

  function navigate(path: string) {
    window.history.pushState({}, "", path);
    setPathname(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const Page = useMemo(() => pages[pathname] ?? Landing, [pathname]);
  const activePage = routeLabel(pathname);

  if (!ready) {
    return <div className="relative z-10 p-8 text-slate-100">Preparing cryptographic demo data...</div>;
  }

  return (
    <div className={darkMode ? "" : "theme-light"}>
      <ParallaxBackground />
      <CustomCursor />
      <div className="relative z-10 min-h-screen text-slate-100">
        <div className="flex">
          <Sidebar pathname={pathname} onNavigate={navigate} />
          <main className="min-w-0 flex-1">
            <Navbar activePage={activePage} darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
            <div className="border-b border-white/10 bg-slate-950/70 p-3 lg:hidden">
              <select className="input" value={pathname} onChange={(event) => navigate(event.target.value)}>
                {routes.map((route) => <option key={route.path} value={route.path}>{route.label}</option>)}
              </select>
            </div>
            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
              <div className="mb-5 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                Educational simulation only. No real mixer, wallet, blockchain transaction, private key, machine learning,
                computer vision, YOLO, or production anonymous finance functionality is included.
              </div>
              <Page navigate={navigate} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MixerProvider>
      <RouterShell />
    </MixerProvider>
  );
}
