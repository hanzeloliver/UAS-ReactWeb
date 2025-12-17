import { useEffect, useState } from "react";

export default function App() {
  // ===== AVATAR =====
  const avatars = [
    "images/avatar1.png",
    "images/avatar2.png",
    "images/avatar3.png",
    "images/avatar4.png",
  ];
  const [avatarIndex, setAvatarIndex] = useState(0);

  // ===== GAME FLOW =====
  const [showGame, setShowGame] = useState(false);
  const [playerName, setPlayerName] = useState("");

  // ===== TIME =====
  const [day, setDay] = useState(1);
  const [time, setTime] = useState(360); // 06:00

  // ===== STATUS =====
  const [hunger, setHunger] = useState(50);
  const [sleep, setSleep] = useState(50);
  const [hygiene, setHygiene] = useState(50);
  const [happiness, setHappiness] = useState(50);
  const [money, setMoney] = useState(100);

  const [gameOver, setGameOver] = useState(false);

  // ===== TIME LOOP =====
  useEffect(() => {
    if (!showGame || gameOver) return;

    const interval = setInterval(() => {
      setTime((t) => {
        if (t >= 1440) {
          setDay((d) => d + 1);
          return 360;
        }
        return t + 10;
      });

      setHunger((v) => Math.max(v - 1, 0));
      setSleep((v) => Math.max(v - 0.5, 0));
      setHygiene((v) => Math.max(v - 0.5, 0));
      setHappiness((v) => Math.max(v - 0.3, 0));
    }, 3000);

    return () => clearInterval(interval);
  }, [showGame, gameOver]);

  // ===== GAME OVER CHECK =====
  useEffect(() => {
    if (hunger <= 0 || sleep <= 0 || hygiene <= 0 || happiness <= 0) {
      setGameOver(true);
    }
  }, [hunger, sleep, hygiene, happiness]);

  // ===== FORMAT TIME =====
  const formatTime = () => {
    const h = Math.floor(time / 60);
    const m = time % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
  };

  // ===== ACTIVITIES =====
  const doActivity = (type) => {
    switch (type) {
      case "eat":
        setHunger((v) => Math.min(v + 30, 100));
        setMoney((m) => m - 10);
        break;
      case "sleep":
        setSleep((v) => Math.min(v + 40, 100));
        setTime((t) => t + 240);
        break;
      case "clean":
        setHygiene((v) => Math.min(v + 40, 100));
        break;
      case "play":
        setHappiness((v) => Math.min(v + 20, 100));
        break;
      default:
        break;
    }
  };

  return (
    <div className="text-gray-900 font-sans flex items-center justify-center min-h-screen p-4">

      {/* ================= CHARACTER SELECTION ================= */}
      {!showGame && (
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-4xl">
          <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-700">
            UMN - Ucup Exploring the Archipelago
          </h1>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 flex justify-center">
              <div className="flex items-center gap-6">
                <img
                  src="images/left.png"
                  className="w-10 h-10 cursor-pointer"
                  onClick={() =>
                    setAvatarIndex((i) => (i - 1 + avatars.length) % avatars.length)
                  }
                />
                <img
                  src={avatars[avatarIndex]}
                  className="rounded-full border-4 border-blue-500 shadow-lg w-36 h-36"
                />
                <img
                  src="images/right.png"
                  className="w-10 h-10 cursor-pointer"
                  onClick={() =>
                    setAvatarIndex((i) => (i + 1) % avatars.length)
                  }
                />
              </div>
            </div>

            <div className="md:w-1/2 flex flex-col space-y-6">
              <input
                type="text"
                placeholder="Character Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-gray-100 border rounded-lg p-2.5"
              />

              <span className="text-center text-gray-600">
                {avatarIndex + 1} / {avatars.length}
              </span>

              <button
                disabled={!playerName}
                onClick={() => setShowGame(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
              >
                Confirm & Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= GAME SCREEN ================= */}
      {showGame && !gameOver && (
        <div className="bg-white/90 p-6 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col">

          <div className="flex justify-between border-b pb-3 mb-4">
            <h1 className="text-2xl font-bold text-blue-700">
              UMN - Ucup Exploring the Archipelago
            </h1>
            <div className="text-right">
              <div>DAY {day}</div>
              <div>{formatTime()}</div>
            </div>
          </div>

          <div className="text-center text-xl mb-4 text-blue-600">
            Welcome, {playerName}!
          </div>

          {/* STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[hunger, sleep, hygiene, happiness].map((v, i) => (
                <div key={i} className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${v}%` }}
                  >
                    {Math.round(v)}%
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-100 p-3 rounded-lg flex justify-center items-center gap-2">
              <img src="images/gems.png" className="w-6 h-6" />
              <span className="text-2xl font-bold">{money}</span>
            </div>
          </div>

          {/* MAP */}
          <div id="map-area">
            <img
              id="map-background-img"
              src="images/WorldMap.png"
            />
          </div>

          {/* ACTIVITIES */}
          <div className="flex justify-center gap-3 mt-6">
            <button className="popup-btn" onClick={() => doActivity("eat")}>
              🍜 Eat
            </button>
            <button className="popup-btn" onClick={() => doActivity("sleep")}>
              🛏 Sleep
            </button>
            <button className="popup-btn" onClick={() => doActivity("clean")}>
              🚿 Clean
            </button>
            <button className="popup-btn" onClick={() => doActivity("play")}>
              🎮 Play
            </button>
          </div>
        </div>
      )}

      {/* ================= GAME OVER ================= */}
      {gameOver && (
        <div id="game-over-screen">
          <div className="bg-red-100 p-10 rounded-lg text-center">
            <h2 className="text-4xl font-bold text-red-700 mb-4">
              GAME OVER
            </h2>
            <p className="mb-6">
              You survived {day} days
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
