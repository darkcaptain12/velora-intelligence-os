#!/usr/bin/env python3
"""
VELORA Wake Word Listener — "Jarvis" deyince tüm sistemi başlatır.
macOS Login Item olarak çalışır, arka planda sürekli dinler.

Kullanım:
  python scripts/velora-wakeword.py          # Manuel başlat
  launchctl load ~/Library/LaunchAgents/com.velora.wakeword.plist  # Otomatik

Komutlar:
  "Jarvis"           → VELORA sistemi başlat
  "Jarvis kapat"     → VELORA sistemi durdur
"""

import os
import subprocess
import sys
import time

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPTS_DIR)
PIDFILE = os.path.join(PROJECT_DIR, "logs", "velora.pids")
START_SCRIPT = os.path.join(SCRIPTS_DIR, "velora-start.sh")
STOP_SCRIPT = os.path.join(SCRIPTS_DIR, "velora-stop.sh")
WAKE_WORD = "jarvis"


def notify(title: str, message: str):
    """macOS bildirim gönder."""
    subprocess.run(
        ["osascript", "-e",
         f'display notification "{message}" with title "{title}" sound name "Glass"'],
        check=False, capture_output=True,
    )


def say(text: str):
    """macOS TTS ile konuş."""
    subprocess.Popen(["say", "-r", "200", text], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def is_velora_running() -> bool:
    """VELORA süreçleri çalışıyor mu?"""
    if os.path.exists(PIDFILE):
        with open(PIDFILE) as f:
            for line in f:
                pid = line.strip()
                if pid:
                    try:
                        os.kill(int(pid), 0)
                        return True
                    except (ProcessLookupError, ValueError):
                        continue
    return False


def start_velora():
    """Terminal'de velora-start.sh başlat."""
    notify("VELORA", "Sistem başlatılıyor...")
    say("Sistem başlatılıyor efendim")
    subprocess.Popen(
        ["osascript", "-e",
         f'tell application "Terminal"\n'
         f'  activate\n'
         f'  do script "{START_SCRIPT}"\n'
         f'end tell'],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def stop_velora():
    """VELORA sistemi durdur."""
    notify("VELORA", "Sistem kapatılıyor...")
    say("Sistemi kapatıyorum efendim")
    subprocess.run([STOP_SCRIPT], check=False, capture_output=True)


def main():
    try:
        import speech_recognition as sr
    except ImportError:
        print("HATA: speech_recognition kurulu değil.")
        print("  pip install SpeechRecognition PyAudio")
        sys.exit(1)

    print(f"[VELORA WakeWord] 🎤 Dinleniyor... '{WAKE_WORD}' diyerek sistemi başlatın.")
    notify("VELORA WakeWord", "'Jarvis' diyerek sistemi başlatabilirsiniz.")

    recognizer = sr.Recognizer()
    recognizer.energy_threshold = 300
    recognizer.dynamic_energy_threshold = True

    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source, duration=1)

        while True:
            try:
                audio = recognizer.listen(source, timeout=5, phrase_time_limit=4)
                text = recognizer.recognize_google(audio, language="tr-TR").lower()

                if WAKE_WORD not in text:
                    continue

                print(f"[VELORA WakeWord] 🟢 Duyuldu: '{text}'")

                if "kapat" in text or "durdur" in text:
                    if is_velora_running():
                        print("[VELORA WakeWord] 🔴 Sistem kapatılıyor...")
                        stop_velora()
                    else:
                        say("Sistem zaten kapalı efendim")
                    time.sleep(3)
                    continue

                if is_velora_running():
                    print("[VELORA WakeWord] ⚡ Sistem zaten çalışıyor.")
                    say("Sistem zaten aktif efendim")
                    time.sleep(3)
                    continue

                print("[VELORA WakeWord] 🚀 Sistem başlatılıyor!")
                start_velora()
                time.sleep(10)

            except sr.WaitTimeoutError:
                pass
            except sr.UnknownValueError:
                pass
            except KeyboardInterrupt:
                print("\n[VELORA WakeWord] 🔴 Kapatılıyor...")
                break
            except Exception as e:
                print(f"[VELORA WakeWord] ⚠️ {e}")
                time.sleep(2)


if __name__ == "__main__":
    main()
