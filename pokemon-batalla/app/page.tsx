"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function BattleScreen() {
  const [log, setLog] = useState("¡Comienza el combate!");
  const [hp, setHp] = useState({ pikachu: 10, charmander: 10 });

  const [atkPika, setAtkPika] = useState(false);
  const [atkChar, setAtkChar] = useState(false);
  const [hitChar, setHitChar] = useState(false);
  const [hitPika, setHitPika] = useState(false);
  const [animating, setAnimating] = useState(false);

  // 👉 Detectar orientación
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // ✅ SI ESTÁ EN VERTICAL → NADA DEL JUEGO SE RENDERIZA
  if (isPortrait) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center px-6">
          <p className="text-2xl font-bold mb-4">🔄 Gira tu celular</p>
          <p className="opacity-80 text-lg">
            Esta batalla solo se juega en horizontal
          </p>
        </div>
      </div>
    );
  }

  const charAttacks = [
    { name: "Arañazo", dmg: 1 },
    { name: "Ascuas", dmg: 1 },
    { name: "Lanzallamas", dmg: 1 },
  ];

  function handleAttack(move: string) {
    if (animating) return;
    setAnimating(true);

    let dmg = 1;
    switch (move) {
      case "Impactrueno": dmg = 1; break;
      case "Rapidez": dmg = 1; break;
      case "Placaje": dmg = 1; break;
      case "Onda Trueno": dmg = 0; break;
    }

    setAtkPika(true);
    setHitChar(true);

    setHp(prev => ({ ...prev, charmander: Math.max(0, prev.charmander - dmg) }));
    setLog(`¡Pikachu usó ${move}! Causó ${dmg} de daño.`);

    setTimeout(() => { 
      setAtkPika(false); 
      setHitChar(false); 
    }, 350);

    setTimeout(() => {
      const rand = Math.floor(Math.random() * charAttacks.length);
      const attack = charAttacks[rand];

      setAtkChar(true);
      setHitPika(true);

      setHp(prev => ({ ...prev, pikachu: Math.max(0, prev.pikachu - attack.dmg) }));

      setLog(prev => prev + `\nCharmander usó ${attack.name}! Causó ${attack.dmg} de daño.`);

      setTimeout(() => {
        setAtkChar(false);
        setHitPika(false);
        setAnimating(false);
      }, 400);
    }, 600);
  }

  const getHpColor = (value: number) => {
    if (value > 6) return "bg-green-500";
    if (value > 3) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center p-4"
      style={{ 
        backgroundImage: "url('/battle-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="w-[800px] h-[600px] flex flex-col bg-transparent">

        {/* ENEMIGO */}
        <div className="flex-1 flex justify-end items-start">
          <div className="bg-black/50 border border-white/30 px-4 py-2 rounded w-[240px] mt-8 mr-4 backdrop-blur-md">
            <div className="font-bold text-sm text-white">CHARMANDER</div>
            <div className="flex items-center gap-2 text-sm mt-1 text-white">
              <span>Nv 12</span>
              <div className="flex-1 h-3 bg-black/70 border border-white/40 rounded overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getHpColor(hp.charmander)}`} 
                  style={{ width: `${(hp.charmander / 10) * 100}%` }} 
                />
              </div>
            </div>
          </div>

          <div className={`enemy-wrapper ml-4 mt-10 ${atkChar ? "attack-dash-enemy" : ""} ${hitChar ? "hit-shake" : ""}`}>
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
              width={340}
              height={340}
              alt="enemy"
              loading="eager"
              priority
              className="pixelated"
            />
          </div>
        </div>

        {/* JUGADOR */}
        <div className="flex-1 flex justify-start items-center">
          <div className={`pikachu-wrapper mr-4 mb-20 ${atkPika ? "attack-dash" : ""} ${hitPika ? "hit-shake" : ""}`}>
            <Image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png"
              width={340}
              height={340}
              alt="player"
              loading="eager"
              priority
              className="pixelated"
            />
          </div>

          <div className="bg-black/50 border border-white/30 px-4 py-2 rounded w-[240px] ml-6 mb-12 backdrop-blur-md">
            <div className="font-bold text-sm text-white">PIKACHU</div>
            <div className="flex items-center gap-2 text-sm mt-1 text-white">
              <span>Nv 10</span>
              <div className="flex-1 h-3 bg-black/70 border border-white/40 rounded overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getHpColor(hp.pikachu)}`} 
                  style={{ width: `${(hp.pikachu / 10) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-[90px] bg-black/60 border-t border-white/30 backdrop-blur-sm text-white p-2 text-center font-bold text-sm whitespace-pre-line">
          {log}
        </div>

        <div className="h-[180px] bg-black/50 border-t border-white/30 backdrop-blur-sm p-4">
          <div className="grid grid-cols-2 gap-3 text-lg font-bold text-white">
            {["Impactrueno", "Rapidez", "Placaje", "Onda Trueno"].map((atk) => (
              <button
                key={atk}
                onClick={() => handleAttack(atk)}
                disabled={animating}
                className="border-2 border-white/40 p-3 rounded hover:bg-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {atk.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .pikachu-wrapper, .enemy-wrapper { display: inline-block; will-change: transform; }
        .attack-dash { animation: dash 0.35s ease-out forwards; }
        @keyframes dash { 
          0% { transform:translateX(0); } 
          40% { transform:translateX(90px); } 
          100% { transform:translateX(0); } 
        }

        .attack-dash-enemy { animation: dash-enemy 0.35s ease-out forwards; }
        @keyframes dash-enemy { 
          0% { transform:translateX(0); } 
          40% { transform:translateX(-90px); } 
          100% { transform:translateX(0); } 
        }

        .hit-shake { animation: shake 0.25s linear; }
        @keyframes shake { 
          0% { transform:translateX(0); } 
          25% { transform:translateX(-8px); } 
          50% { transform:translateX(8px); } 
          75% { transform:translateX(-6px); } 
          100% { transform:translateX(0); } 
        }

        .pixelated { image-rendering: pixelated; }
      `}</style>
    </div>
  );
}
