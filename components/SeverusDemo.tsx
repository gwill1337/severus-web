"use client";

import { useEffect, useRef, useState } from "react";

/* ================= TYPES ================= */

type User = { id: string; username: string; encryptionCode?: string; };
type Msg = { from: string; body: string; sys?: boolean };
type Dialogs = Record<string, Msg[]>;
type Room = { name: string; users: string[] };
type Bot = User & { lines: string[] };


/* ================= TEST DATA ================= */
// Static ids to avoid hydration mismatch during SSR.

const ME_ID = "me";
const GENERAL_ID = "7d3f2a10-5b6e-4c1a-9e0d-1a2b3c4d5e6f";

const BOTS: Bot[] = [
  { id: "u-lily", username: "Lily", lines: ["Hey! This is a test reply 👋", "Everything here is encrypted with Noise.", "Sounds great."] },
  { id: "u-draco", username: "Draco", lines: ["Ping looks good, all stable.", "Try creating a room!", "QUIC over Iroh is awesome."] },
  { id: "u-minerva", username: "Minerva", lines: ["Traffic runs over TLS + Noise XX.", "Fingerprint saved (TOFU).", "Agreed."] },
  { id: "u-albus", username: "Albus", lines: ["Welcome to Severus.", "You can whisper or chat in a room.", "See you around!"] },
];

const randomHex = (length: number): string =>
  Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join("");

const generateCode = (groups = 6, groupLength = 5): string =>
  Array.from({ length: groups }, () => randomHex(groupLength)).join(" ");

const INITIAL_ROOMS: Record<string, Room> = {
  [GENERAL_ID]: { name: "general", users: ["u-lily", "u-draco", "u-minerva"] },
};

const INITIAL_DIALOGS: Dialogs = {
  [`room_${GENERAL_ID}`]: [
    { from: "Lily", body: "Hi everyone! This is a demo room." },
    { from: "Draco", body: "Join us: Join room → general" },
  ],
  "u-albus": [{ from: "Albus", body: "Pick me in the list and write something." }],
};

/* ================= COMPONENT ================= */

export default function SeverusDemo() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const [connType, setConnType] = useState<"direct" | "quic">("direct");
  const [ip, setIp] = useState("127.0.0.1:5173");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [dialogs, setDialogs] = useState<Dialogs>(INITIAL_DIALOGS);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const [roomName, setRoomName] = useState("");
  const [roomIdToJoin, setRoomIdToJoin] = useState("");
  const [msgInput, setMsgInput] = useState("");

  const [ping, setPing] = useState(24);
  const [toast, setToast] = useState<string | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const chatKey = activeRoomId ? `room_${activeRoomId}` : activeUserId;
  const activeRoom = activeRoomId ? rooms[activeRoomId] : null;
  const messages = chatKey ? dialogs[chatKey] ?? [] : [];

  const connectionState = !connected ? "offline" : ping > 150 ? "bad" : "ok";
  const nickUsername = nickname.trim() || "Me";

  const members: User[] = activeRoom
    ? [{ id: ME_ID, username: `${nickUsername} (me)` }, ...BOTS.filter((b) => activeRoom.users.includes(b.id))]
    : BOTS;

  const [bots, setBots] = useState<Bot[]>(BOTS);

  const activeBot = bots.find((b) => b.id === activeUserId) ?? null;
  const sessionStarted = !!activeBot?.encryptionCode;

  /* ---------- effects ---------- */

  useEffect(() => {
    if (!connected) return;
    const p = setInterval(() => setPing((v) => Math.max(8, Math.min(190, Math.round(v + Math.random() * 30 - 15)))), 1500);
    return () => clearInterval(p);
  }, [connected]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages.length, chatKey]);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  /* ---------- helpers ---------- */

  const flash = (text: string) => {
    setToast(text);
    timeouts.current.push(setTimeout(() => setToast(null), 1800));
  };

  const push = (key: string, msg: Msg) =>
    setDialogs((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), msg] }));

  /* ---------- actions ---------- */

  const handleConnect = () => {
    const n = nickname.trim();
    if (!n) return setError("Enter a nickname");
    if (bots.some((b) => b.username.toLowerCase() === n.toLowerCase())) return setError("Name already taken");
    setError("");
    setConnecting(true);
    timeouts.current.push(
      setTimeout(() => {
        setConnecting(false);
        setConnected(true);
        handleCode("u-albus");
      }, 700)
    );
  };

  const sendMessage = () => {
    const text = msgInput.trim();
    if (!text || !chatKey) return;
    setMsgInput("");

    if (activeUserId) handleCode(activeUserId);

    push(chatKey, { from: nickUsername, body: text });

    const roomBots = activeRoom ? bots.filter((b) => activeRoom.users.includes(b.id)) : [];
    const bot = activeRoom ? roomBots[Math.floor(Math.random() * roomBots.length)] : bots.find((b) => b.id === activeUserId);
    if (!bot) return;

    timeouts.current.push(
      setTimeout(
        () => push(chatKey, { from: bot.username, body: bot.lines[Math.floor(Math.random() * bot.lines.length)] }),
        700 + Math.random() * 900
      )
    );
  };

  const enterRoom = (id: string, sysText: string) => {
    setActiveRoomId(id);
    setActiveUserId(null);
    push(`room_${id}`, { from: "", body: sysText, sys: true });
  };

  const handleCreate = () => {
    const name = roomName.trim();
    if (!name) return;
    const id = crypto.randomUUID();
    setRooms((r) => ({ ...r, [id]: { name, users: [] } }));
    setRoomName("");
    enterRoom(id, `Room created: ${name}`);
  };

  const handleJoin = () => {
    const v = roomIdToJoin.trim();
    if (!v) return;
    const id = Object.keys(rooms).find((i) => i === v || rooms[i].name === v);
    if (!id) return flash("Room not found");
    setRoomIdToJoin("");
    enterRoom(id, `You joined ${rooms[id].name}`);
  };

  const handleCopy = async () => {
    if (!activeRoomId) return;
    try {
      await navigator.clipboard.writeText(activeRoomId);
    } catch { }
    flash("Copied!");
  };

  const handleCode = (userId: string) => {
    setBots((prev) =>
      prev.map((b) =>
        b.id === userId && !b.encryptionCode
          ? { ...b, encryptionCode: generateCode() }
          : b
      )
    );
  };


  /* ================= RENDER ================= */

  return (
    <div className="relative w-full max-w-5xl mx-auto h-160 max-h-[92vh] flex flex-col overflow-hidden rounded-xl border border-white/10 bg-dungeon-surface text-snape-silver font-mono text-sm shadow-[0_0_60px_rgba(74,222,128,0.07)]">
      <div className="fog-bg absolute inset-0" />

      {/* window bar */}
      <div className="relative z-10 flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-black/40">
        <i className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <i className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <i className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-gray-500">Severus · client</span>
      </div>

      {/* ============ CONNECT ============ */}
      {!connected && (
        <div className="relative z-10 flex-1 flex items-center justify-center p-5">
          <div className="w-full max-w-sm text-center">
            <h1 className="text-3xl font-serif tracking-[0.25em] uppercase">Severus</h1>
            <p className="text-[10px] text-potion-glow/60 mt-2 mb-6 uppercase tracking-widest">Encrypted · Noise XX · TLS</p>

            <div className="flex gap-2 mb-3">
              {(["direct", "quic"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setConnType(t);
                    setIp(t === "direct" ? "127.0.0.1:5173" : "endpointaaq3k5y7demo2ticketx4n6…");
                  }}
                  className={`flex-1 rounded border border-slytherin py-2 text-xs uppercase tracking-widest transition-all ${connType === t ? "bg-slytherin/60 text-potion-glow shadow-[0_0_10px_rgba(74,222,128,0.2)]" : "hover:bg-slytherin/10"
                    }`}
                >
                  {t === "direct" ? "Direct" : "QUIC / Iroh"}
                </button>
              ))}
            </div>

            <input
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              aria-label="Address"
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 mb-3 outline-none text-xs text-center focus:border-potion-glow/50 transition-colors"
            />
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              placeholder="Nickname"
              maxLength={16}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 mb-2 outline-none text-xs text-center focus:border-potion-glow/50 transition-colors"
            />
            <div className="h-5 text-[11px] text-red-400">{error}</div>

            <button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full border border-slytherin/50 text-green-400 rounded py-3 text-xs uppercase tracking-widest hover:bg-slytherin/10 hover:text-green-300 hover:border-slytherin transition-all shadow-[0_0_15px_rgba(74,222,128,0.1)] hover:shadow-[0_0_20px_rgba(74,222,128,0.25)] disabled:opacity-60"
            >
              {connecting ? "[ Handshake… ]" : "[ Connect ]"}
            </button>
          </div>
        </div>
      )}

      {/* ============ CHAT ============ */}
      {connected && (
        <div className="relative z-10 flex-1 min-h-0 flex flex-col gap-3 p-4">
          {/* top: rooms + board */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1.5">
                <input
                  className="w-36 bg-black/40 border border-white/10 rounded px-3 py-1 text-xs outline-none focus:border-potion-glow/50"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Room's name"
                />
                <button className="text-[10px] uppercase tracking-tighter text-left hover:text-potion-glow" onClick={handleCreate}>
                  [ Create room ]
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                <input
                  className="w-36 bg-black/40 border border-white/10 rounded px-3 py-1 text-xs outline-none focus:border-potion-glow/50"
                  value={roomIdToJoin}
                  onChange={(e) => setRoomIdToJoin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="Room's ID/Name"
                />
                <button className="text-[10px] uppercase tracking-tighter text-left hover:text-potion-glow" onClick={handleJoin}>
                  [ Join room ]
                </button>
              </div>
            </div>

            <div className="text-right max-sm:text-left">
              <span className="text-lg font-serif tracking-[0.25em] uppercase">Severus </span>
              <span className={ping > 150 ? "text-red-500" : "text-potion-glow"}>{ping}ms</span>
              <div
                className={`text-[10px] uppercase tracking-widest ${connectionState === "ok" ? "text-green-500" : connectionState === "bad" ? "text-red-500 animate-pulse" : "text-gray-500"
                  }`}
              >
                {connectionState === "ok" && `Connected to ${ip.length > 21 ? ip.slice(0, 21) + "..." : ip}`}
                {connectionState === "bad" && "Connection unstable"}
                {connectionState === "offline" && "Disconnected"}
              </div>
            </div>
          </div>

          {/* main */}
          <div className="flex-1 min-h-0 flex gap-3 max-sm:flex-col">
            {/* users */}
            <div className="w-52 max-sm:w-full max-sm:max-h-28 shrink-0 overflow-y-auto rounded-l-lg max-sm:rounded-lg border border-white/10 bg-dungeon-surface/60 backdrop-blur p-2">
              <div className="text-[10px] text-gray-500 uppercase mb-3 px-2 tracking-widest">
                {activeRoomId ? "Room Members" : "Online Users"}
              </div>
              {members.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    if (u.id === ME_ID) return;
                    setActiveUserId(u.id);
                    setActiveRoomId(null);
                  }}
                  className={`text-xs p-2 mb-1 rounded cursor-pointer transition-colors ${activeUserId === u.id ? "bg-slytherin/40 text-potion-glow" : "hover:bg-white/5"
                    }`}
                >
                  {u.username}
                </div>
              ))}
            </div>

            {/* chat pane */}
            <div className="flex-1 min-w-0 flex flex-col rounded-r-lg max-sm:rounded-lg border border-white/10 bg-dungeon-surface/60 backdrop-blur p-3 overflow-hidden">
              <div className="px-2 pb-2 mb-2 border-b border-white/5 flex justify-between items-center">
                <div className="flex-1 text-[10px] uppercase tracking-[0.25em] text-gray-400 flex items-center gap-1.5">
                  {activeRoom ? (
                    <>
                      Location: Room <span className="text-white">{activeRoom.name}</span> [
                      <button onClick={handleCopy} title="Click to copy" className="text-emerald-400 hover:text-emerald-300 active:scale-95 transition">
                        {activeRoomId!.slice(0, 8)}...
                      </button>
                      ]
                    </>
                  ) : activeUserId ? (
                    <div className="flex gap-1.5 items-center justify-between w-full">
                      <div>Whisper: {activeBot?.username}</div>
                      {sessionStarted ? (
                        <div className="mt-1 normal-case tracking-normal ">
                          <h1 className="text-[10px] mt-1 text-x text-green-500">
                            E2EE ACTIVE
                          </h1>
                          <div className="mt-1 text-xs text-gray-200/80">
                            Safety number:{" "}
                            <span className="text-emerald-400">{activeBot!.encryptionCode}</span>
                          </div>
                          <h2 className="mt-0.5 text-[10px] text-gray-500">
                            Compare it with your contact over another channel (call, other messenger).
                          </h2>
                        </div>
                      ) : (
                        <div className="mt-1 normal-case tracking-normal">
                          Secure session starts with your first message
                        </div>
                      )}
                    </div>
                  ) : (
                    "Select Target"
                  )}
                </div>
                {activeRoomId && (
                  <button onClick={() => setActiveRoomId(null)} className="text-[9px] text-red-900 hover:text-red-500 uppercase">
                    Leave Room
                  </button>
                )}
              </div>

              {!chatKey ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500 uppercase tracking-widest animate-pulse">Waiting for selection...</p>
                </div>
              ) : (
                <>
                  <div ref={logRef} className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1.5">
                    <div className="mt-auto" />
                    {messages.map((m, i) =>
                      m.sys ? (
                        <div key={i} className="text-xs text-gray-500">— {m.body}</div>
                      ) : (
                        <div key={i} className="leading-relaxed wrap-break-word">
                          <span className="text-potion-glow opacity-80">[{m.from}]</span> <span className="text-gray-200">{m.body}</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex gap-3 mt-2">
                    <input
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={activeRoomId ? "Message room..." : "Whisper..."}
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-potion-glow/30 transition-all"
                    />
                    <button onClick={sendMessage} className="text-potion-glow text-xs uppercase tracking-widest hover:brightness-125 px-3">
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      <div
        className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 z-20 rounded bg-slytherin px-3.5 py-1.5 text-[11px] text-potion-glow transition-opacity ${toast ? "opacity-100" : "opacity-0"
          }`}
      >
        {toast}
      </div>
    </div>
  );
}