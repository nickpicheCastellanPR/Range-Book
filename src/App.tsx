import { useEffect, useState } from "react";
import type { AppData } from "./types";
import { loadData, saveData } from "./lib/storage";
import { BottomNav, type Screen } from "./components/BottomNav";
import { KrakenMark } from "./components/art/KrakenMark";
import { WaveDivider } from "./components/art/WaveDivider";
import { PageArt } from "./components/art/PageArt";
import { PAGE_ART } from "./lib/artAssets";
import { BagScreen } from "./screens/BagScreen";
import { LogSessionScreen } from "./screens/LogSessionScreen";
import { ClubDetailScreen } from "./screens/ClubDetailScreen";
import { RangefinderScreen } from "./screens/RangefinderScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { AboutScreen } from "./screens/AboutScreen";
import { InstallBanner } from "./components/InstallBanner";

const TITLES: Record<Screen, string> = {
  bag: "My Bag",
  log: "Log Session",
  rangefinder: "Rangefinder",
  settings: "Settings",
};

export default function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [screen, setScreen] = useState<Screen>("bag");
  const [openClubId, setOpenClubId] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  function goTo(next: Screen) {
    setOpenClubId(null);
    setShowAbout(false);
    setScreen(next);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <KrakenMark size={34} />
        <h1>
          {openClubId
            ? "Club Detail"
            : screen === "settings" && showAbout
              ? "About"
              : screen === "bag"
                ? "Fathom"
                : TITLES[screen]}
        </h1>
      </header>
      <WaveDivider />

      <main className="app-main">
        {!openClubId && !showAbout && <PageArt key={screen} src={PAGE_ART[screen]} />}

        <div className="screen-content">
          {screen === "bag" && !openClubId && data.clubs.length > 0 && (
            <InstallBanner
              onLearnMore={() => {
                setScreen("settings");
                setShowAbout(true);
              }}
            />
          )}

          {screen === "bag" &&
            (openClubId ? (
              <ClubDetailScreen
                data={data}
                clubId={openClubId}
                onUpdate={setData}
                onBack={() => setOpenClubId(null)}
              />
            ) : (
              <BagScreen data={data} onUpdate={setData} onOpenClub={setOpenClubId} />
            ))}

          {screen === "log" && <LogSessionScreen data={data} onUpdate={setData} />}

          {screen === "rangefinder" && <RangefinderScreen data={data} />}

          {screen === "settings" &&
            (showAbout ? (
              <AboutScreen onBack={() => setShowAbout(false)} />
            ) : (
              <SettingsScreen
                data={data}
                onUpdate={setData}
                onReplaceAll={setData}
                onShowAbout={() => setShowAbout(true)}
              />
            ))}
        </div>
      </main>

      <BottomNav active={screen} onChange={goTo} />
    </div>
  );
}
