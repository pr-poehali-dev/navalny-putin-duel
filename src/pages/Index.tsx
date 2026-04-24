import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

type Screen = "menu" | "arena" | "leaderboard" | "upgrades";

interface Character {
  id: number;
  name: string;
  emoji: string;
  img: string;
  element: string;
  color: string;
  glow: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  level: number;
  xp: number;
  xpMax: number;
  combos: ComboMove[];
  upgrades: UpgradeItem[];
}

interface ComboMove {
  name: string;
  keys: string[];
  damage: number;
  emoji: string;
  color: string;
}

interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  owned: boolean;
  stat: "attack" | "defense" | "hp";
  value: number;
  emoji: string;
}

interface LeaderEntry {
  rank: number;
  name: string;
  wins: number;
  character: string;
  emoji: string;
}

interface DamagePopup {
  id: number;
  value: number;
  x: number;
  y: number;
  isCombo: boolean;
}

const FIRE_IMG = "https://cdn.poehali.dev/projects/64fd1107-3614-4f96-a0ff-4ea6d78900eb/files/a84e9af8-e859-4e10-9e80-27d30e22e725.jpg";
const ICE_IMG = "https://cdn.poehali.dev/projects/64fd1107-3614-4f96-a0ff-4ea6d78900eb/files/322afa5c-b238-46c9-bdf3-f4d6f5b3fd94.jpg";
const LIGHTNING_IMG = "https://cdn.poehali.dev/projects/64fd1107-3614-4f96-a0ff-4ea6d78900eb/files/a0ebdfc9-2253-426a-9241-5332f84748ec.jpg";

const defaultCharacters: Character[] = [
  {
    id: 1,
    name: "Огнебурст",
    emoji: "🔥",
    img: FIRE_IMG,
    element: "Огонь",
    color: "#FF6B35",
    glow: "rgba(255,107,53,0.6)",
    hp: 120,
    maxHp: 120,
    attack: 22,
    defense: 8,
    level: 1,
    xp: 0,
    xpMax: 100,
    combos: [
      { name: "Огненный Шквал", keys: ["A", "A", "D"], damage: 45, emoji: "🌪️🔥", color: "#FF4500" },
      { name: "Взрыв Магмы", keys: ["S", "A", "S", "D"], damage: 70, emoji: "💥🌋", color: "#FF6B35" },
    ],
    upgrades: [
      { id: "f1", name: "Огненное Сердце", description: "+30 к здоровью", cost: 50, owned: false, stat: "hp", value: 30, emoji: "❤️‍🔥" },
      { id: "f2", name: "Адское Пламя", description: "+8 к атаке", cost: 80, owned: false, stat: "attack", value: 8, emoji: "😈" },
      { id: "f3", name: "Щит Из Лавы", description: "+5 к защите", cost: 60, owned: false, stat: "defense", value: 5, emoji: "🛡️" },
    ],
  },
  {
    id: 2,
    name: "Ледяна",
    emoji: "❄️",
    img: ICE_IMG,
    element: "Лёд",
    color: "#00E5FF",
    glow: "rgba(0,229,255,0.6)",
    hp: 100,
    maxHp: 100,
    attack: 18,
    defense: 14,
    level: 1,
    xp: 0,
    xpMax: 100,
    combos: [
      { name: "Ледяной Шторм", keys: ["D", "D", "A"], damage: 40, emoji: "🌨️❄️", color: "#00BFFF" },
      { name: "Метель Смерти", keys: ["A", "D", "A", "S"], damage: 65, emoji: "🥶❄️", color: "#00E5FF" },
    ],
    upgrades: [
      { id: "i1", name: "Ледяная Броня", description: "+6 к защите", cost: 50, owned: false, stat: "defense", value: 6, emoji: "🧊" },
      { id: "i2", name: "Кристальный Клинок", description: "+10 к атаке", cost: 80, owned: false, stat: "attack", value: 10, emoji: "💎" },
      { id: "i3", name: "Морозный Облик", description: "+40 к здоровью", cost: 70, owned: false, stat: "hp", value: 40, emoji: "☃️" },
    ],
  },
  {
    id: 3,
    name: "Молниец",
    emoji: "⚡",
    img: LIGHTNING_IMG,
    element: "Молния",
    color: "#FFD700",
    glow: "rgba(255,215,0,0.6)",
    hp: 90,
    maxHp: 90,
    attack: 28,
    defense: 6,
    level: 1,
    xp: 0,
    xpMax: 100,
    combos: [
      { name: "Разряд Грома", keys: ["A", "S", "D"], damage: 50, emoji: "⚡💥", color: "#FFD700" },
      { name: "Громовой Хаос", keys: ["D", "A", "D", "A"], damage: 80, emoji: "🌩️👊", color: "#9B5DE5" },
    ],
    upgrades: [
      { id: "l1", name: "Молния в венах", description: "+12 к атаке", cost: 80, owned: false, stat: "attack", value: 12, emoji: "⚡" },
      { id: "l2", name: "Эл. Щит", description: "+8 к защите", cost: 70, owned: false, stat: "defense", value: 8, emoji: "🔋" },
      { id: "l3", name: "Буря Силы", description: "+25 к здоровью", cost: 50, owned: false, stat: "hp", value: 25, emoji: "🌪️" },
    ],
  },
];

const LEADERBOARD: LeaderEntry[] = [
  { rank: 1, name: "ПламяКороль", wins: 147, character: "Огнебурст", emoji: "🔥" },
  { rank: 2, name: "ЛедянойДракон", wins: 132, character: "Ледяна", emoji: "❄️" },
  { rank: 3, name: "GrindMaster", wins: 98, character: "Молниец", emoji: "⚡" },
  { rank: 4, name: "UltraFighter", wins: 87, character: "Огнебурст", emoji: "🔥" },
  { rank: 5, name: "CoolPlayer99", wins: 71, character: "Ледяна", emoji: "❄️" },
  { rank: 6, name: "ТемнаяСила", wins: 64, character: "Молниец", emoji: "⚡" },
  { rank: 7, name: "Ты", wins: 0, character: "?", emoji: "👤" },
];

const COMBO_KEYS = ["A", "S", "D", "W"];

export default function Index() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [characters, setCharacters] = useState<Character[]>(defaultCharacters);
  const [selectedCharId, setSelectedCharId] = useState<number>(1);
  const [coins, setCoins] = useState(120);
  const [wins, setWins] = useState(0);
  const [totalFights, setTotalFights] = useState(0);

  const selectedChar = characters.find((c) => c.id === selectedCharId)!;

  return (
    <div
      className="min-h-screen font-nunito text-white overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 40%, #1a0a2e 100%)",
      }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.1,
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + "s",
            }}
          />
        ))}
      </div>

      {screen !== "menu" && (
        <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/10">
          <button
            onClick={() => setScreen("menu")}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-bold text-sm"
          >
            <Icon name="ArrowLeft" size={18} />
            Меню
          </button>
          <div className="flex items-center gap-4 text-sm font-bold">
            <span className="flex items-center gap-1 text-yellow-400">🪙 {coins}</span>
            <span className="flex items-center gap-1 text-green-400">
              <Icon name="Trophy" size={14} /> {wins}
            </span>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {screen === "menu" && (
          <MenuScreen
            characters={characters}
            selectedCharId={selectedCharId}
            setSelectedCharId={setSelectedCharId}
            setScreen={setScreen}
            wins={wins}
            totalFights={totalFights}
            coins={coins}
          />
        )}
        {screen === "arena" && (
          <ArenaScreen
            characters={characters}
            setCharacters={setCharacters}
            selectedChar={selectedChar}
            setCoins={setCoins}
            setWins={setWins}
            setTotalFights={setTotalFights}
            setScreen={setScreen}
          />
        )}
        {screen === "leaderboard" && <LeaderboardScreen wins={wins} />}
        {screen === "upgrades" && (
          <UpgradesScreen
            characters={characters}
            setCharacters={setCharacters}
            selectedCharId={selectedCharId}
            setSelectedCharId={setSelectedCharId}
            coins={coins}
            setCoins={setCoins}
          />
        )}
      </div>
    </div>
  );
}

function MenuScreen({
  characters,
  selectedCharId,
  setSelectedCharId,
  setScreen,
  wins,
  totalFights,
  coins,
}: {
  characters: Character[];
  selectedCharId: number;
  setSelectedCharId: (id: number) => void;
  setScreen: (s: Screen) => void;
  wins: number;
  totalFights: number;
  coins: number;
}) {
  const char = characters.find((c) => c.id === selectedCharId)!;

  return (
    <div className="flex flex-col items-center min-h-screen px-4 pb-8">
      <div className="mt-10 mb-2 text-center animate-bounce-in">
        <h1
          className="font-fredoka text-5xl md:text-7xl"
          style={{
            background: "linear-gradient(135deg, #FFD700, #FF6B35, #FF4D8F)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px rgba(255,107,53,0.5))",
            letterSpacing: "2px",
          }}
        >
          ⚔️ КомбоБой
        </h1>
        <p className="text-white/50 text-sm font-bold tracking-widest uppercase mt-1">
          Арена Героев
        </p>
      </div>

      <div className="flex gap-4 mb-6 mt-2">
        <div className="bg-white/10 rounded-2xl px-4 py-2 text-center border border-white/20">
          <div className="text-yellow-400 font-black text-xl">🪙 {coins}</div>
          <div className="text-white/50 text-xs">монет</div>
        </div>
        <div className="bg-white/10 rounded-2xl px-4 py-2 text-center border border-white/20">
          <div className="text-green-400 font-black text-xl">🏆 {wins}</div>
          <div className="text-white/50 text-xs">побед</div>
        </div>
        <div className="bg-white/10 rounded-2xl px-4 py-2 text-center border border-white/20">
          <div className="text-blue-400 font-black text-xl">⚔️ {totalFights}</div>
          <div className="text-white/50 text-xs">боёв</div>
        </div>
      </div>

      <div className="w-full max-w-md mb-6">
        <p className="text-center text-white/60 text-sm font-bold mb-3 uppercase tracking-wider">
          Выбери бойца
        </p>
        <div className="flex gap-3 justify-center">
          {characters.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCharId(c.id)}
              className="relative flex-1 rounded-2xl overflow-hidden transition-all duration-300 group"
              style={{
                border: selectedCharId === c.id ? `3px solid ${c.color}` : "3px solid transparent",
                boxShadow: selectedCharId === c.id ? `0 0 20px ${c.glow}` : "none",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <img
                src={c.img}
                alt={c.name}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1.5 px-1">
                <div className="text-xs font-black text-center" style={{ color: c.color }}>
                  {c.emoji} {c.name}
                </div>
                <div className="text-xs text-white/50 text-center">Ур.{c.level}</div>
              </div>
              {selectedCharId === c.id && (
                <div className="absolute top-2 right-2 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-xs text-black font-black">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        <div
          className="mt-4 rounded-2xl p-4 border"
          style={{
            background: `linear-gradient(135deg, ${char.glow.replace("0.6", "0.15")}, transparent)`,
            borderColor: char.color + "40",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl animate-float">{char.emoji}</div>
            <div>
              <div className="font-black text-lg" style={{ color: char.color }}>
                {char.name}
              </div>
              <div className="text-white/50 text-xs">Элемент: {char.element}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/10 rounded-xl p-2">
              <div className="text-red-400 font-black text-base">❤️ {char.maxHp}</div>
              <div className="text-white/40">HP</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <div className="text-orange-400 font-black text-base">⚔️ {char.attack}</div>
              <div className="text-white/40">Атака</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <div className="text-blue-400 font-black text-base">🛡️ {char.defense}</div>
              <div className="text-white/40">Защита</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col gap-3">
        <button
          onClick={() => setScreen("arena")}
          className="w-full py-5 rounded-2xl font-fredoka text-2xl text-white transition-all duration-200 active:scale-95 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #FF6B35, #FF4D8F)",
            boxShadow: "0 6px 0 #CC3A1A, 0 8px 20px rgba(255,107,53,0.4)",
          }}
        >
          ⚔️ В Бой!
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setScreen("leaderboard")}
            className="py-4 rounded-2xl font-fredoka text-lg text-white transition-all duration-200 active:scale-95 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #9B5DE5, #6A3CB5)",
              boxShadow: "0 4px 0 #4A2885, 0 6px 15px rgba(155,93,229,0.4)",
            }}
          >
            🏆 Рейтинг
          </button>
          <button
            onClick={() => setScreen("upgrades")}
            className="py-4 rounded-2xl font-fredoka text-lg text-white transition-all duration-200 active:scale-95 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FF8C00)",
              boxShadow: "0 4px 0 #CC8800, 0 6px 15px rgba(255,215,0,0.4)",
            }}
          >
            ⭐ Прокачка
          </button>
        </div>
      </div>
    </div>
  );
}

function ArenaScreen({
  characters,
  setCharacters,
  selectedChar,
  setCoins,
  setWins,
  setTotalFights,
  setScreen,
}: {
  characters: Character[];
  setCharacters: (c: Character[]) => void;
  selectedChar: Character;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  setWins: React.Dispatch<React.SetStateAction<number>>;
  setTotalFights: React.Dispatch<React.SetStateAction<number>>;
  setScreen: (s: Screen) => void;
}) {
  const enemies = characters.filter((c) => c.id !== selectedChar.id);
  const [enemy] = useState<Character>(() => {
    const e = enemies[Math.floor(Math.random() * enemies.length)];
    return { ...e, hp: e.maxHp };
  });

  const [playerHp, setPlayerHp] = useState(selectedChar.maxHp);
  const [enemyHp, setEnemyHp] = useState(enemy.maxHp);
  const [comboInput, setComboInput] = useState<string[]>([]);
  const [comboTimer, setComboTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [gameState, setGameState] = useState<"fighting" | "win" | "lose">("fighting");
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const [lastCombo, setLastCombo] = useState<ComboMove | null>(null);
  const [enemyShaking, setEnemyShaking] = useState(false);
  const [playerShaking, setPlayerShaking] = useState(false);
  const [log, setLog] = useState<string[]>(["Бой начался! Нажимай комбо-кнопки!", "Враг готов сражаться!"]);
  const popupIdRef = useRef(0);
  const playerHpRef = useRef(playerHp);
  const enemyHpRef = useRef(enemyHp);
  const gameStateRef = useRef(gameState);

  playerHpRef.current = playerHp;
  enemyHpRef.current = enemyHp;
  gameStateRef.current = gameState;

  const addPopup = useCallback((value: number, isCombo: boolean, isEnemy: boolean) => {
    const id = ++popupIdRef.current;
    const x = isEnemy ? 60 + Math.random() * 20 : 5 + Math.random() * 20;
    const y = 20 + Math.random() * 20;
    setDamagePopups((prev) => [...prev, { id, value, x, y, isCombo }]);
    setTimeout(() => setDamagePopups((prev) => prev.filter((p) => p.id !== id)), 900);
  }, []);

  const enemyAttack = useCallback(() => {
    if (gameStateRef.current !== "fighting") return;
    const dmg = Math.max(1, enemy.attack - Math.floor(selectedChar.defense / 2) + Math.floor(Math.random() * 6));
    const newHp = Math.max(0, playerHpRef.current - dmg);
    setPlayerHp(newHp);
    playerHpRef.current = newHp;
    setPlayerShaking(true);
    setTimeout(() => setPlayerShaking(false), 500);
    addPopup(dmg, false, false);
    setLog((prev) => [`${enemy.emoji} ${enemy.name} атакует! -${dmg} HP`, ...prev.slice(0, 4)]);
    if (newHp <= 0) {
      setGameState("lose");
      gameStateRef.current = "lose";
    }
  }, [enemy, selectedChar.defense, addPopup]);

  const doAttack = useCallback(
    (combo?: ComboMove) => {
      if (gameStateRef.current !== "fighting") return;

      let dmg: number;
      let isCombo = false;
      let label = "";

      if (combo) {
        dmg = Math.max(1, combo.damage - Math.floor(enemy.defense / 2));
        isCombo = true;
        label = `${combo.emoji} КОМБО: ${combo.name}! -${dmg} HP`;
        setLastCombo(combo);
        setTimeout(() => setLastCombo(null), 1500);
      } else {
        dmg = Math.max(1, selectedChar.attack + Math.floor(Math.random() * 5) - Math.floor(enemy.defense / 2));
        label = `${selectedChar.emoji} Удар! -${dmg} HP`;
      }

      const newHp = Math.max(0, enemyHpRef.current - dmg);
      setEnemyHp(newHp);
      enemyHpRef.current = newHp;
      setEnemyShaking(true);
      setTimeout(() => setEnemyShaking(false), 500);
      addPopup(dmg, isCombo, true);
      setLog((prev) => [label, ...prev.slice(0, 4)]);

      if (newHp <= 0) {
        setGameState("win");
        gameStateRef.current = "win";
        setWins((w) => w + 1);
        setTotalFights((t) => t + 1);
        const reward = 20 + Math.floor(Math.random() * 30);
        setCoins((c) => c + reward);
        setLog((prev) => [`🏆 Победа! +${reward} монет!`, ...prev.slice(0, 4)]);
      } else {
        setTimeout(enemyAttack, 700 + Math.random() * 600);
      }
    },
    [selectedChar, enemy, addPopup, setWins, setTotalFights, setCoins, enemyAttack]
  );

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStateRef.current !== "fighting") return;

      setComboInput((prev) => {
        const newInput = [...prev, key];

        if (comboTimer) clearTimeout(comboTimer);
        const timer = setTimeout(() => {
          doAttack();
          setComboInput([]);
        }, 800);
        setComboTimer(timer);

        for (const combo of selectedChar.combos) {
          if (
            combo.keys.length === newInput.length &&
            combo.keys.every((k, i) => k === newInput[i])
          ) {
            clearTimeout(timer);
            setComboTimer(null);
            doAttack(combo);
            return [];
          }
        }

        const isPrefixValid = selectedChar.combos.some((c) =>
          c.keys.slice(0, newInput.length).every((k, i) => k === newInput[i])
        );
        if (!isPrefixValid) {
          clearTimeout(timer);
          doAttack();
          return [];
        }
        return newInput;
      });
    },
    [comboTimer, doAttack, selectedChar.combos]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, string> = {
        a: "A", s: "S", d: "D", w: "W",
        ArrowLeft: "A", ArrowDown: "S", ArrowRight: "D", ArrowUp: "W",
      };
      const k = map[e.key];
      if (k) handleKeyPress(k);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState === "lose") setTotalFights((t) => t + 1);
  }, [gameState, setTotalFights]);

  const playerHpPct = Math.max(0, (playerHp / selectedChar.maxHp) * 100);
  const enemyHpPct = Math.max(0, (enemyHp / enemy.maxHp) * 100);

  return (
    <div className="px-4 pb-6 max-w-lg mx-auto">
      <h2 className="font-fredoka text-2xl text-center mt-4 mb-4" style={{ color: "#FFD700" }}>
        ⚔️ Арена Боёв
      </h2>

      <div className="flex gap-3 mb-4 relative">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-black" style={{ color: selectedChar.color }}>
              {selectedChar.emoji} {selectedChar.name}
            </span>
            <span className="text-xs font-bold text-white/80">
              {playerHp}/{selectedChar.maxHp}
            </span>
          </div>
          <div className="h-4 rounded-full bg-white/10 overflow-hidden border border-white/20">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${playerHpPct}%`,
                background:
                  playerHpPct > 50
                    ? "linear-gradient(90deg, #39FF14, #00CC00)"
                    : playerHpPct > 25
                    ? "linear-gradient(90deg, #FFD700, #FF8C00)"
                    : "linear-gradient(90deg, #FF4444, #CC0000)",
              }}
            />
          </div>
        </div>
        <div className="font-fredoka text-xl self-end pb-1 text-white/50">VS</div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-white/80">
              {enemyHp}/{enemy.maxHp}
            </span>
            <span className="text-xs font-black" style={{ color: enemy.color }}>
              {enemy.emoji} {enemy.name}
            </span>
          </div>
          <div className="h-4 rounded-full bg-white/10 overflow-hidden border border-white/20 flex justify-end">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${enemyHpPct}%`,
                background:
                  enemyHpPct > 50
                    ? "linear-gradient(270deg, #39FF14, #00CC00)"
                    : enemyHpPct > 25
                    ? "linear-gradient(270deg, #FFD700, #FF8C00)"
                    : "linear-gradient(270deg, #FF4444, #CC0000)",
              }}
            />
          </div>
        </div>

        {damagePopups.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none font-fredoka font-black animate-damage-pop"
            style={{
              left: p.x + "%",
              top: p.y + "%",
              color: p.isCombo ? "#FFD700" : "#FF4444",
              fontSize: p.isCombo ? "28px" : "20px",
              textShadow: p.isCombo ? "0 0 10px #FFD700" : "0 0 8px #FF4444",
              zIndex: 50,
            }}
          >
            {p.isCombo ? `💥 ${p.value}!` : `-${p.value}`}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end gap-4 mb-4 relative">
        <div
          className={`flex-1 rounded-2xl overflow-hidden border-2 ${playerShaking ? "animate-shake" : ""}`}
          style={{ borderColor: selectedChar.color + "60", boxShadow: `0 0 20px ${selectedChar.glow}` }}
        >
          <img src={selectedChar.img} alt={selectedChar.name} className="w-full aspect-square object-cover" />
        </div>
        <div className="text-center">
          <div className="font-fredoka text-3xl text-white/30">⚡</div>
        </div>
        <div
          className={`flex-1 rounded-2xl overflow-hidden border-2 ${enemyShaking ? "animate-shake" : ""}`}
          style={{ borderColor: enemy.color + "60", boxShadow: `0 0 20px ${enemy.glow}` }}
        >
          <img src={enemy.img} alt={enemy.name} className="w-full aspect-square object-cover scale-x-[-1]" />
        </div>
      </div>

      {lastCombo && (
        <div
          className="text-center mb-3 font-fredoka text-2xl animate-combo-flash"
          style={{ color: lastCombo.color, textShadow: `0 0 20px ${lastCombo.color}` }}
        >
          {lastCombo.emoji} {lastCombo.name}!
        </div>
      )}

      {gameState === "fighting" && (
        <div className="flex justify-center gap-2 mb-3 min-h-8">
          {comboInput.map((k, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-black"
              style={{ background: "#FFD700", boxShadow: "0 0 10px rgba(255,215,0,0.6)" }}
            >
              {k}
            </div>
          ))}
        </div>
      )}

      {gameState !== "fighting" && (
        <div
          className="text-center py-6 rounded-2xl mb-4 animate-bounce-in"
          style={{
            background:
              gameState === "win"
                ? "linear-gradient(135deg, #1a3a1a, #0a2a0a)"
                : "linear-gradient(135deg, #3a1a1a, #2a0a0a)",
            border: `2px solid ${gameState === "win" ? "#39FF14" : "#FF4444"}`,
          }}
        >
          <div className="text-5xl mb-2">{gameState === "win" ? "🏆" : "💀"}</div>
          <div
            className="font-fredoka text-3xl"
            style={{ color: gameState === "win" ? "#39FF14" : "#FF4444" }}
          >
            {gameState === "win" ? "Победа!" : "Поражение!"}
          </div>
          <button
            onClick={() => setScreen("menu")}
            className="mt-4 px-8 py-3 rounded-2xl font-fredoka text-lg font-bold text-black"
            style={{ background: gameState === "win" ? "#39FF14" : "#FF6B6B" }}
          >
            В Меню
          </button>
        </div>
      )}

      {gameState === "fighting" && (
        <>
          <div className="mb-3">
            <p className="text-xs text-white/40 text-center mb-2 uppercase tracking-wider">
              Твои комбо-атаки
            </p>
            <div className="flex flex-col gap-2">
              {selectedChar.combos.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl px-3 py-2 border"
                  style={{ background: c.color + "15", borderColor: c.color + "40" }}
                >
                  <span className="text-sm font-bold" style={{ color: c.color }}>
                    {c.emoji} {c.name}
                  </span>
                  <div className="flex gap-1 items-center">
                    {c.keys.map((k, ki) => (
                      <span
                        key={ki}
                        className="w-6 h-6 rounded flex items-center justify-center text-xs font-black text-black"
                        style={{ background: c.color }}
                      >
                        {k}
                      </span>
                    ))}
                    <span className="text-xs ml-1 font-bold text-white/60">-{c.damage}💥</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-3">
            {COMBO_KEYS.map((k) => (
              <button
                key={k}
                onPointerDown={() => handleKeyPress(k)}
                className="py-4 rounded-2xl font-fredoka text-xl text-black font-black active:scale-90 transition-transform select-none"
                style={{
                  background: "linear-gradient(135deg, #FFD700, #FF8C00)",
                  boxShadow: "0 4px 0 #CC6600",
                  touchAction: "manipulation",
                }}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="rounded-2xl p-3 bg-black/30 border border-white/10 max-h-28 overflow-hidden">
            {log.map((l, i) => (
              <div
                key={i}
                className="text-xs py-0.5"
                style={{
                  opacity: 1 - i * 0.2,
                  color: i === 0 ? "#FFD700" : "rgba(255,255,255,0.5)",
                }}
              >
                {l}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function LeaderboardScreen({ wins }: { wins: number }) {
  const board = LEADERBOARD.map((e) => (e.name === "Ты" ? { ...e, wins } : e))
    .sort((a, b) => b.wins - a.wins)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="px-4 pb-8 max-w-lg mx-auto">
      <h2 className="font-fredoka text-3xl text-center mt-6 mb-6" style={{ color: "#FFD700" }}>
        🏆 Таблица Лидеров
      </h2>

      <div className="flex flex-col gap-3">
        {board.map((entry, i) => (
          <div
            key={entry.rank}
            className="flex items-center gap-4 rounded-2xl px-4 py-3 border animate-slide-up"
            style={{
              animationDelay: `${i * 0.06}s`,
              background:
                entry.name === "Ты"
                  ? "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,53,0.1))"
                  : i < 3
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.04)",
              borderColor:
                entry.name === "Ты"
                  ? "#FFD700"
                  : i === 0
                  ? "#FFD700"
                  : i === 1
                  ? "#C0C0C0"
                  : i === 2
                  ? "#CD7F32"
                  : "rgba(255,255,255,0.1)",
              boxShadow: entry.name === "Ты" ? "0 0 15px rgba(255,215,0,0.3)" : "none",
            }}
          >
            <div className="text-2xl w-8 text-center">
              {i < 3 ? (
                medals[i]
              ) : (
                <span className="text-white/40 font-black text-sm">#{entry.rank}</span>
              )}
            </div>
            <div className="text-2xl">{entry.emoji}</div>
            <div className="flex-1">
              <div className={`font-black text-base ${entry.name === "Ты" ? "text-yellow-400" : "text-white"}`}>
                {entry.name}
              </div>
              <div className="text-xs text-white/40">{entry.character}</div>
            </div>
            <div className="text-right">
              <div className="font-fredoka text-xl text-green-400">{entry.wins}</div>
              <div className="text-xs text-white/40">побед</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-white/30 text-xs">
        Побеждай врагов чтобы подняться выше!
      </div>
    </div>
  );
}

function UpgradesScreen({
  characters,
  setCharacters,
  selectedCharId,
  setSelectedCharId,
  coins,
  setCoins,
}: {
  characters: Character[];
  setCharacters: (c: Character[]) => void;
  selectedCharId: number;
  setSelectedCharId: (id: number) => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
}) {
  const char = characters.find((c) => c.id === selectedCharId)!;

  const buyUpgrade = (upgradeId: string) => {
    const upg = char.upgrades.find((u) => u.id === upgradeId);
    if (!upg || upg.owned || coins < upg.cost) return;

    setCoins((c) => c - upg.cost);
    setCharacters(
      characters.map((c) => {
        if (c.id !== selectedCharId) return c;
        return {
          ...c,
          maxHp: upg.stat === "hp" ? c.maxHp + upg.value : c.maxHp,
          hp: upg.stat === "hp" ? c.hp + upg.value : c.hp,
          attack: upg.stat === "attack" ? c.attack + upg.value : c.attack,
          defense: upg.stat === "defense" ? c.defense + upg.value : c.defense,
          upgrades: c.upgrades.map((u) => (u.id === upgradeId ? { ...u, owned: true } : u)),
        };
      })
    );
  };

  return (
    <div className="px-4 pb-8 max-w-lg mx-auto">
      <h2 className="font-fredoka text-3xl text-center mt-6 mb-2" style={{ color: "#FFD700" }}>
        ⭐ Прокачка
      </h2>
      <p className="text-center text-white/50 text-sm mb-4">🪙 {coins} монет</p>

      <div className="flex gap-2 mb-5 justify-center">
        {characters.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCharId(c.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all"
            style={{
              background: selectedCharId === c.id ? c.color : "rgba(255,255,255,0.08)",
              color: selectedCharId === c.id ? "#000" : "rgba(255,255,255,0.6)",
              boxShadow: selectedCharId === c.id ? `0 4px 15px ${c.glow}` : "none",
            }}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl p-4 mb-5 border"
        style={{ background: char.glow.replace("0.6", "0.1"), borderColor: char.color + "40" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <img
            src={char.img}
            alt={char.name}
            className="w-16 h-16 rounded-xl object-cover border-2"
            style={{ borderColor: char.color }}
          />
          <div>
            <div className="font-black text-xl" style={{ color: char.color }}>
              {char.emoji} {char.name}
            </div>
            <div className="text-white/50 text-sm">Уровень {char.level}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-black/30 rounded-xl p-2">
            <div className="text-red-400 font-black">❤️ {char.maxHp}</div>
            <div className="text-white/40 text-xs">HP</div>
          </div>
          <div className="bg-black/30 rounded-xl p-2">
            <div className="text-orange-400 font-black">⚔️ {char.attack}</div>
            <div className="text-white/40 text-xs">Атака</div>
          </div>
          <div className="bg-black/30 rounded-xl p-2">
            <div className="text-blue-400 font-black">🛡️ {char.defense}</div>
            <div className="text-white/40 text-xs">Защита</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {char.upgrades.map((upg, i) => (
          <div
            key={upg.id}
            className="flex items-center gap-4 rounded-2xl px-4 py-4 border animate-slide-up"
            style={{
              animationDelay: `${i * 0.08}s`,
              background: upg.owned
                ? "linear-gradient(135deg, rgba(57,255,20,0.1), rgba(0,200,0,0.05))"
                : "rgba(255,255,255,0.05)",
              borderColor: upg.owned ? "#39FF14" : "rgba(255,255,255,0.1)",
              opacity: upg.owned ? 0.8 : 1,
            }}
          >
            <div className="text-3xl">{upg.emoji}</div>
            <div className="flex-1">
              <div className="font-black text-base text-white">{upg.name}</div>
              <div className="text-sm text-white/50">{upg.description}</div>
            </div>
            {upg.owned ? (
              <div className="text-green-400 font-black text-sm flex items-center gap-1">
                <Icon name="Check" size={16} /> Куплено
              </div>
            ) : (
              <button
                onClick={() => buyUpgrade(upg.id)}
                disabled={coins < upg.cost}
                className="px-4 py-2 rounded-xl font-fredoka text-sm font-bold transition-all active:scale-95"
                style={{
                  background:
                    coins >= upg.cost
                      ? "linear-gradient(135deg, #FFD700, #FF8C00)"
                      : "rgba(255,255,255,0.1)",
                  color: coins >= upg.cost ? "#000" : "rgba(255,255,255,0.3)",
                  boxShadow: coins >= upg.cost ? "0 3px 0 #CC6600" : "none",
                }}
              >
                🪙 {upg.cost}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
