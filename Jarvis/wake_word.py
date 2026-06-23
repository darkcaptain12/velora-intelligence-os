"""
Wake-word dinleyicisi — "Jarvis" kelimesini duyunca tetiklenir.
Bulut tabanli konusma tanima kullanir (internet baglantisi gerekir).
Tamamen yerel calistirmak icin farkli bir motorla degistirilebilir.
"""

import threading
import speech_recognition as sr

WAKE_WORD = "jarvis"


class WakeWordListener:
    """
    Arka planda sürekli mikrofonu dinler.
    Wake-word duyulunca, sonrasındaki konuşmayı yakalar
    ve on_wake(text) callback'ini çağırır.
    """

    def __init__(self, on_wake, ui, is_speaking_fn=None):
        self.on_wake        = on_wake
        self.ui             = ui
        self.is_speaking_fn = is_speaking_fn  # lambda: jarvis._is_speaking
        self.recognizer     = sr.Recognizer()
        self.recognizer.energy_threshold         = 300
        self.recognizer.dynamic_energy_threshold = True
        self._thread  = None
        self._running = False

    def start(self):
        self._running = True
        self._thread  = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()
        print("[WakeWord] 🎤 Dinleniyor... 'Jarvis' diyerek başlatın.")

    def stop(self):
        self._running = False

    def _loop(self):
        import time
        with sr.Microphone() as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
            while self._running:
                # UI mute kontrolü
                if self.ui.muted:
                    time.sleep(0.2)
                    continue
                # Jarvis konuşurken dinleme — akustik geri beslemeyi önler
                if self.is_speaking_fn and self.is_speaking_fn():
                    time.sleep(0.2)
                    continue
                try:
                    # Kısa bir ses parçası al (wake-word tespiti için)
                    audio = self.recognizer.listen(source, timeout=5,
                                                   phrase_time_limit=4)
                    text = self.recognizer.recognize_google(audio,
                                                            language="tr-TR").lower()
                    if WAKE_WORD not in text:
                        print(f"[WakeWord] 👂 (wake-word yok): '{text}'")
                    else:
                        print(f"[WakeWord] 🟢 Duyuldu: '{text}'")

                    if WAKE_WORD in text:
                        # Wake-word sonrasındaki kısım varsa onu al
                        after = text.split(WAKE_WORD, 1)[-1].strip()
                        if len(after) > 3:
                            # "Jarvis müzik aç" → "müzik aç"
                            print(f"[WakeWord] ✅ Komut: '{after}'")
                            self.on_wake(after)
                            time.sleep(5.0)  # TTS bitmeden tekrar tetiklenmesin (5s)
                        else:
                            # Sadece "Jarvis" dediyse → daha fazla komut bekle
                            print("[WakeWord] ⏳ Wake-word duyuldu, komut bekleniyor...")
                            self.ui.write_log("SYS: Evet efendim?")
                            self.ui.set_state("LISTENING")
                            try:
                                audio2 = self.recognizer.listen(source,
                                                                timeout=6,
                                                                phrase_time_limit=8)
                                cmd = self.recognizer.recognize_google(
                                    audio2, language="tr-TR")
                                if cmd.strip():
                                    print(f"[WakeWord] ✅ Komut: '{cmd.strip()}'")
                                    self.on_wake(cmd.strip())
                                    time.sleep(5.0)  # TTS bitmeden tekrar tetiklenmesin (5s)
                            except (sr.WaitTimeoutError, sr.UnknownValueError):
                                pass

                except sr.WaitTimeoutError:
                    pass
                except sr.UnknownValueError:
                    pass
                except Exception as e:
                    print(f"[WakeWord] Hata: {e}")
