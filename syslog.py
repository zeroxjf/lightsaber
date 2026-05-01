#!/usr/bin/env python3
"""Filtered idevicesyslog viewer for LightSaber/DarkSword exploit chain debugging.

Usage: python3 syslog.py [output_file]
  output_file defaults to syslog.txt
  Ctrl+C to stop.

Requires: idevicesyslog (brew install libimobiledevice)
"""

import re
import signal
import subprocess
import sys
import threading
from pathlib import Path

# --- ANSI colors ---
GREEN = "\033[1;32m"
YELLOW = "\033[1;33m"
CYAN = "\033[1;36m"
MAGENTA = "\033[1;35m"
RED = "\033[1;31m"
RESET = "\033[0m"

# --- Chain log tags ---
# Bracketed tags come from components that call syslog() directly:
#   sbx1_main  -> [SBX1]       (via print -> syslog)
#   sbcustomizer -> [SBC]      (via Native.callSymbol("syslog"))
#   powercuff  -> [POWERCUFF]  (via Native.callSymbol("syslog"))
#   pe_main embedded payloads  -> [PE], [THREEAPP], [THREEAPP-AUDIT],
#                                 [SAFARI-CLEAN],
#                                 [FILE-DL], [HTTP-UPLOAD], [APP], [ICLOUD],
#                                 [KEYCHAIN], [WIFI], [FILE-DL-EARLY]
#   pe_main kernel phase       -> [PE-*] plus shorthand [+]/[-]/[!]/[i]
#
# NOTE: pe_main.js outer code (CHAIN, INJECTJS, DRIVER-POSTEXPL, TASK, VM,
# MAIN, etc.) uses console.log() which does NOT reliably reach idevicesyslog
# from an injected JSC context. Those tags are included here just in case,
# but the real fix is to switch pe_main to syslog() like sbcustomizer does.
CHAIN_TAGS = re.compile(
    r'\[PE\]|\[PE-DBG\]|\[SBX1\]|\[SBC\]|\[POWERCUFF\]|\[CHAIN-OVL\]|'
    r'\[FILE-DL\]|\[FILE-DL-EARLY\]|\[HTTP-UPLOAD\]|'
    r'\[APP\]|\[ICLOUD\]|\[KEYCHAIN\]|\[WIFI\]|\[THREEAPP\]|\[THREEAPP-AUDIT\]|\[SAFARI-CLEAN\]|'
    r'\[MG\]|\[MPD\]|\[APPLIMIT\]|'
    r'nativeCallBuff|kernel_base|kernel_slide|'
    r'SBX0|SBX1|sbx0:|sbx1:|'
    r'MIG_FILTER_BYPASS |INJECTJS |CHAIN |DRIVER-POSTEXPL |DRIVER-NEWTHREAD |'
    r'DARKSWORD-WIFI-DUMP |INFO |OFFSETS |FILE-UTILS |'
    r'PORTRIGHTINSERTER |REGISTERSSTRUCT |REMOTECALL |'
    r'TASK(?:ROP)? |THREAD |VM |MAIN |EXCEPTION |SANDBOX |'
    r'PAC (?:diagnostics|ptrs|gadget)|UTILS '
)

# --- Interesting patterns (colored) ---
INTERESTING_PATTERNS = [
    (re.compile(r'\[PE\]|\[PE-DBG\]|kernel_base|kernel_slide', re.IGNORECASE), GREEN),
    (re.compile(r'\[SBX1\]|SBX0|SBX1|sbx0:|sbx1:', re.IGNORECASE), MAGENTA),
    (re.compile(r'\[SBC\]|\[POWERCUFF\]|\[CHAIN-OVL\]|\[MG\]|\[APPLIMIT\]|\[THREEAPP\]|\[THREEAPP-AUDIT\]|\[SAFARI-CLEAN\]', re.IGNORECASE), CYAN),
    (re.compile(r'\[FILE-DL\]|\[HTTP-UPLOAD\]|\[APP\]|\[ICLOUD\]|\[KEYCHAIN\]|\[WIFI\]', re.IGNORECASE), CYAN),
    (re.compile(r'MIG_FILTER_BYPASS|INJECTJS|CHAIN |DRIVER-POSTEXPL|DRIVER-NEWTHREAD', re.IGNORECASE), YELLOW),
    (re.compile(r'SIGBUS|SIGSEGV|EXC_BAD|EXC_CRASH|pac_exception|pac.violation', re.IGNORECASE), RED),
    (re.compile(r'threw|SyntaxError|TypeError|ReferenceError', re.IGNORECASE), RED),
]

# --- ReportCrash: only if SpringBoard crashed ---
REPORTCRASH_SB = re.compile(r'ReportCrash.*SpringBoard|SpringBoard.*ReportCrash', re.IGNORECASE)
PE_SHORTHAND_TAGS = re.compile(r'mediaplaybackd(?:\([^)]*\))?\[\d+\].*(?:\[\+\]|\[-\]|\[!\]|\[i\])')

TIMESTAMP_PATTERN = re.compile(r'^[A-Z][a-z]{2}\s+\d+\s+\d+:\d+:\d+\.\d+\s+\S+\[\d+\]\s*')
PROCESS_PATTERN = re.compile(r'^[A-Z][a-z]{2}\s+\d+\s+\d+:\d+:\d+\.\d+\s+([A-Za-z0-9_.-]+)(?:\([^)]*\))?\[\d+\]')

_seen_messages = set()
_seen_order = []
DEDUP_MAX_SIZE = 50


def is_duplicate(line):
    key = TIMESTAMP_PATTERN.sub('', line)
    if key in _seen_messages:
        return True
    _seen_messages.add(key)
    _seen_order.append(key)
    while len(_seen_order) > DEDUP_MAX_SIZE:
        _seen_messages.discard(_seen_order.pop(0))
    return False


def should_show(line):
    """Only show lines matching chain tags or SpringBoard ReportCrash."""
    if CHAIN_TAGS.search(line):
        return True
    if PE_SHORTHAND_TAGS.search(line):
        return True
    if REPORTCRASH_SB.search(line):
        return True
    return False


def reader(proc, outfile):
    while proc.poll() is None:
        try:
            line = proc.stdout.readline()
            if not line:
                break
            line = line.rstrip('\n')

            if not should_show(line):
                continue

            color = None
            for pattern, pat_color in INTERESTING_PATTERNS:
                if pattern.search(line):
                    color = pat_color
                    break

            if not is_duplicate(line):
                outfile.write(line + "\n")
                outfile.flush()
                if color:
                    print(f"{color}{line}{RESET}", flush=True)
                else:
                    print(line, flush=True)

        except Exception:
            break


def main():
    from datetime import datetime

    logdir = Path(__file__).resolve().parent / "logs"
    logdir.mkdir(exist_ok=True)

    if len(sys.argv) > 1:
        outpath = Path(sys.argv[1])
    else:
        stamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        outpath = logdir / f"syslog_{stamp}.txt"

    try:
        proc = subprocess.Popen(
            ["idevicesyslog"],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
            bufsize=1,
        )
    except FileNotFoundError:
        print("idevicesyslog not found. Install with: brew install libimobiledevice")
        sys.exit(1)

    outfile = open(outpath, "w")
    print(f"[syslog] PID {proc.pid} -> {outpath}")
    print(f"[syslog] Ctrl+C to stop\n")

    t = threading.Thread(target=reader, args=(proc, outfile), daemon=True)
    t.start()

    def cleanup(*_):
        proc.terminate()
        try:
            proc.wait(timeout=2)
        except subprocess.TimeoutExpired:
            proc.kill()
        outfile.close()
        print(f"\n[syslog] Stopped. Output saved to {outpath}")
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)
    t.join()
    cleanup()


if __name__ == "__main__":
    main()
