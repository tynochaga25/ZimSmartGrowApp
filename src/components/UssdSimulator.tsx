import React, { useState, useEffect } from 'react';
import { Phone, Delete, RefreshCw, Send, Radio, Terminal, UserCheck, Shield, AlertTriangle } from 'lucide-react';

interface UssdLogEntry {
  timestamp: string;
  phoneNumber: string;
  textSent: string;
  responseReceived: string;
  type: 'CON' | 'END' | 'ERROR';
  latencyMs: number;
}

export const UssdSimulator: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('+263772111222');
  const [screenText, setScreenText] = useState('Dial *384*263# to start ZimSmart Grow');
  const [userInput, setUserInput] = useState('*384*263#');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [accumulatedText, setAccumulatedText] = useState('');
  const [sessionId, setSessionId] = useState(`session_${Date.now()}`);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<UssdLogEntry[]>([]);
  const [isCon, setIsCon] = useState(false);

  // Send request to live /api/v1/ussd/africastalking backend
  const sendUssdRequest = async (currentAccumulatedText: string) => {
    setIsLoading(true);
    const startTime = performance.now();

    try {
      const response = await fetch('/api/v1/ussd/africastalking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          serviceCode: '*384*263#',
          phoneNumber,
          text: currentAccumulatedText
        })
      });

      const responseText = await response.text();
      const latencyMs = Math.round(performance.now() - startTime);

      const startsWithCon = responseText.startsWith('CON ');
      const startsWithEnd = responseText.startsWith('END ');

      setIsCon(startsWithCon);
      if (startsWithEnd) {
        setIsSessionActive(false);
      } else if (startsWithCon) {
        setIsSessionActive(true);
      }

      // Strip CON / END for display on the LCD screen
      const cleanDisplay = responseText.replace(/^(CON|END)\s+/, '');
      setScreenText(cleanDisplay);
      setUserInput('');

      setLogs(prev => [
        {
          timestamp: new Date().toLocaleTimeString(),
          phoneNumber,
          textSent: currentAccumulatedText,
          responseReceived: responseText,
          type: startsWithCon ? 'CON' : (startsWithEnd ? 'END' : 'ERROR'),
          latencyMs
        },
        ...prev.slice(0, 9)
      ]);
    } catch (err: unknown) {
      setScreenText('Network Error: Unable to reach USSD gateway.');
      setIsSessionActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeypadPress = (val: string) => {
    setUserInput(prev => prev + val);
  };

  const handleSend = () => {
    if (!userInput.trim()) return;

    if (!isSessionActive) {
      // First dial
      if (userInput.trim() === '*384*263#' || userInput.trim() === '*384#') {
        const newSess = `sess_${Date.now()}`;
        setSessionId(newSess);
        setAccumulatedText('');
        sendUssdRequest('');
      } else {
        setScreenText('Invalid USSD Code.\nDial *384*263# for ZimSmart Grow.');
      }
    } else {
      // Continuation of active session
      const nextAccumulated = accumulatedText ? `${accumulatedText}*${userInput.trim()}` : userInput.trim();
      setAccumulatedText(nextAccumulated);
      sendUssdRequest(nextAccumulated);
    }
  };

  const handleEndCall = () => {
    setIsSessionActive(false);
    setAccumulatedText('');
    setScreenText('Call Ended.\nDial *384*263# to begin.');
    setUserInput('*384*263#');
  };

  const handleClear = () => {
    setUserInput(prev => prev.slice(0, -1));
  };

  // Quick Preset Profiles
  const selectPreset = (phone: string, label: string) => {
    setPhoneNumber(phone);
    setIsSessionActive(false);
    setAccumulatedText('');
    setUserInput('*384*263#');
    setScreenText(`Phone ready: ${label}\nPress [SEND] to dial.`);
  };

  const charCount = screenText.length;
  const isOverLimit = charCount > 182;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intro Banner */}
      <div className="mb-6 p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h2 className="text-base font-bold text-white">Tier 1 Channel: Feature-Phone USSD Simulator</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              Africa's Talking Gateway Compatible
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Simulates a basic rural 2G feature phone without internet. Enforces strict ≤182 character screen limits and stateful session logic.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-400 font-medium">Quick Profiles:</span>
          <button
            onClick={() => selectPreset('+263772111222', 'Sekuru Tendai (Makoni, Maize, Shona)')}
            className="text-xs px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-mono"
          >
            Sekuru Tendai (+263772...)
          </button>
          <button
            onClick={() => selectPreset('+263712333444', 'Mai Ruvimbo (Mazowe, Tobacco, English)')}
            className="text-xs px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-mono"
          >
            Mai Ruvimbo (+263712...)
          </button>
          <button
            onClick={() => selectPreset(`+263774${Math.floor(100000 + Math.random() * 900000)}`, 'New Unregistered Farmer')}
            className="text-xs px-2.5 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 font-mono"
          >
            + New Farmer (Onboarding)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Realistic Feature Phone Device */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[340px] bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 rounded-[44px] p-5 shadow-2xl border-4 border-stone-700 relative">
            {/* Phone Top Ear Speaker & Brand */}
            <div className="flex flex-col items-center mb-3">
              <div className="w-16 h-1.5 bg-stone-700 rounded-full mb-2"></div>
              <span className="text-[11px] font-black tracking-widest text-stone-400 uppercase font-mono">
                ZIMSMART 263
              </span>
            </div>

            {/* LCD Screen Container */}
            <div className="bg-[#1f2b1d] rounded-2xl p-4 border-2 border-stone-600 shadow-inner mb-4 relative min-h-[210px] flex flex-col justify-between font-mono">
              {/* LCD Status Header */}
              <div className="flex items-center justify-between text-[11px] text-[#86efac]/80 border-b border-[#86efac]/20 pb-1 mb-2">
                <span className="flex items-center gap-1 font-semibold">
                  <Radio className="w-3 h-3 text-[#4ade80]" />
                  <span>ECONET 2G</span>
                </span>
                <span className="text-[10px] bg-[#142312] px-1.5 py-0.5 rounded border border-[#86efac]/30">
                  {charCount} / 182c
                </span>
              </div>

              {/* LCD Screen Text Display */}
              <div className="flex-1 text-[#bbf7d0] text-xs leading-relaxed whitespace-pre-wrap font-mono tracking-tight overflow-y-auto max-h-[140px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full text-center text-[#86efac] animate-pulse">
                    Connecting to *384*263#...
                  </div>
                ) : (
                  screenText
                )}
              </div>

              {/* Current Input Box on Screen */}
              <div className="mt-2 pt-1 border-t border-[#86efac]/20 flex items-center justify-between text-xs text-[#86efac]">
                <span className="text-[10px] text-[#86efac]/60">INPUT:</span>
                <input
                  type="text"
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={isSessionActive ? "Type option..." : "*384*263#"}
                  className="bg-transparent text-[#bbf7d0] text-right font-mono text-xs focus:outline-none w-full ml-2"
                />
              </div>

              {/* Character Limit Warning if exceeded */}
              {isOverLimit && (
                <div className="absolute top-1 right-1 bg-red-900/90 text-red-200 text-[10px] px-1 rounded flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>EXCEEDED 182 LIMIT!</span>
                </div>
              )}
            </div>

            {/* Action Bar: SEND, CLEAR, END */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white py-2 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1 border-b-2 border-emerald-800 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>SEND</span>
              </button>

              <button
                onClick={handleClear}
                className="bg-stone-700 hover:bg-stone-600 active:scale-95 text-stone-200 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-1 border-b-2 border-stone-800 transition"
              >
                <Delete className="w-3.5 h-3.5" />
                <span>CLR</span>
              </button>

              <button
                onClick={handleEndCall}
                className="bg-red-700 hover:bg-red-600 active:scale-95 text-white py-2 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1 border-b-2 border-red-900 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>END</span>
              </button>
            </div>

            {/* Number Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { num: '1', sub: '.,' },
                { num: '2', sub: 'ABC' },
                { num: '3', sub: 'DEF' },
                { num: '4', sub: 'GHI' },
                { num: '5', sub: 'JKL' },
                { num: '6', sub: 'MNO' },
                { num: '7', sub: 'PQRS' },
                { num: '8', sub: 'TUV' },
                { num: '9', sub: 'WXYZ' },
                { num: '*', sub: 'SHFT' },
                { num: '0', sub: '+' },
                { num: '#', sub: 'SPACE' }
              ].map(k => (
                <button
                  key={k.num}
                  onClick={() => handleKeypadPress(k.num)}
                  className="bg-stone-800 hover:bg-stone-750 active:bg-stone-700 active:scale-95 py-2.5 rounded-xl border border-stone-700/60 shadow flex flex-col items-center justify-center transition"
                >
                  <span className="text-base font-bold text-white font-mono leading-none">{k.num}</span>
                  <span className="text-[9px] text-stone-400 font-mono tracking-tighter mt-0.5">{k.sub}</span>
                </button>
              ))}
            </div>

            {/* Phone Info Footer */}
            <div className="mt-4 pt-3 border-t border-stone-800 text-center">
              <span className="text-[10px] text-stone-500 font-mono">
                SIM MSISDN: {phoneNumber}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Africa's Talking Protocol Inspector & Live Logs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Session Status Card */}
          <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Africa's Talking Protocol Inspector</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                isSessionActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-stone-800 text-stone-400'
              }`}>
                {isSessionActive ? 'SESSION OPEN (CON)' : 'SESSION IDLE (END)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-500 block text-[10px]">CURRENT SESSION ID</span>
                <span className="text-emerald-400 break-all">{sessionId}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-stone-500 block text-[10px]">MSISDN (CALLER)</span>
                <span className="text-white">{phoneNumber}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 block text-[10px]">ACCUMULATED AT 'TEXT' PARAMETER</span>
                  <span className="text-[10px] text-stone-400">Africa's Talking Asterisk Accumulation</span>
                </div>
                <div className="mt-1 p-2 rounded bg-stone-900 text-emerald-300 font-mono text-sm border border-stone-800 break-all">
                  {accumulatedText ? `text="${accumulatedText}"` : 'text="" (Initial Dial)'}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Session Traffic Log */}
          <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Webhook Inbound / Outbound Stream</span>
                <span className="text-xs text-stone-500 font-normal">(/api/v1/ussd/africastalking)</span>
              </h3>
              <button
                onClick={() => setLogs([])}
                className="text-xs text-stone-400 hover:text-stone-200"
              >
                Clear Log
              </button>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500 font-mono border border-dashed border-stone-800 rounded-xl">
                  No USSD packets exchanged yet. Dial *384*263# on the keypad to see live requests.
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="p-3 rounded-xl bg-stone-950 border border-stone-800/80 text-xs font-mono space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-400">{log.timestamp}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500">{log.latencyMs}ms</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                          log.type === 'CON'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {log.type}
                        </span>
                      </div>
                    </div>

                    <div className="text-stone-400 text-[11px]">
                      <span className="text-stone-600">INBOUND POST: </span>
                      <span className="text-stone-300">phoneNumber={log.phoneNumber}&text="{log.textSent}"</span>
                    </div>

                    <div className="p-2 rounded bg-stone-900 border border-stone-800 text-[#86efac] whitespace-pre-wrap text-[11px]">
                      {log.responseReceived}
                    </div>

                    <div className="text-[10px] text-stone-500 flex justify-between">
                      <span>Payload Length: {log.responseReceived.length} chars</span>
                      <span className={log.responseReceived.length <= 182 ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                        {log.responseReceived.length <= 182 ? '✓ GSM & AT Compliant' : '⚠ Exceeds 182 Chars'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
