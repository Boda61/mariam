// =====================================================
// For mo2a - Main Script (clean, organized)
// =====================================================

const SPECIAL_DATE = "2/10/2025"; // the date that unlocks the surprise
const OUR_DATE_LABEL = "2/10/2025"; // single source for the date shown in the counter text
const OUR_DATE = new Date(2025, 9, 2, 0, 0, 0); // 2 Oct 2025, 00:00 local time (month is 0-indexed)
const SONG_NAME = "Sherine - نظره عيني ❤️.mp3"; // the name of the song file (for the floating player)
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- DOM references ----------
const startButton = document.getElementById("startButton");
const scrollArrow = document.getElementById("scrollArrow");
const greetingEl = document.getElementById("greeting");
const typewriterEl = document.getElementById("typewriter");
const messageText = document.getElementById("messageText");
const counterTitleEl = document.getElementById("counterTitle");
const counterSubEl = document.querySelector(".counter-sub");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const passwordInput = document.getElementById("password");
const unlockBtn = document.getElementById("unlockBtn");
const errorEl = document.getElementById("error");
const surpriseEl = document.getElementById("surprise");
const lockedPhotos = Array.from(document.querySelectorAll(".gallery img.locked"));
const lovePopup = document.getElementById("lovePopup");
const envelope = document.getElementById("envelope");
const waxSeal = document.getElementById("waxSeal");
const heartsContainer = document.querySelector(".hearts-popup");
const song = document.getElementById("song");
const closePopupBtn = document.getElementById("closePopupBtn");
const musicPlayer = document.getElementById("musicPlayer");
const playerText = document.querySelector(".player-text");
const galleryImages = Array.from(document.querySelectorAll(".gallery img"));
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

// =====================================================
// 1) Time-based greeting
// =====================================================
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning, marioma ☀️";
  if (h >= 12 && h < 18) return "Good afternoon, my heart 🌤️";
  return "Good evening, my darling 🌙";
}
greetingEl.textContent = getGreeting();

// =====================================================
// 2) Typewriter effect in hero
// =====================================================
const TYPE_TEXT = "Some stories are written by destiny… ours is written by love";

function startTypewriter() {
  if (reduceMotion) {
    typewriterEl.textContent = TYPE_TEXT;
    return;
  }
  let i = 0;
  typewriterEl.textContent = "";
  (function tick() {
    if (i <= TYPE_TEXT.length) {
      typewriterEl.textContent = TYPE_TEXT.slice(0, i++);
      setTimeout(tick, 45);
    }
  })();
}
startTypewriter();

// =====================================================
// 3) Scroll to the surprise
// =====================================================
function scrollToSecret() {
  document.getElementById("secret").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}
startButton.addEventListener("click", scrollToSecret);
scrollArrow.addEventListener("click", scrollToSecret);

// =====================================================
// 4) Rotating messages
// =====================================================
const messages = [
  "You didn't just become my best friend… you became one of the most important people in my life. Every laugh, every crazy moment, and every memory with you means more than you know ❤️",
  "Some people come into your life and leave memories… you came into mine and became a whole collection of unforgettable ones 😂❤️",
  "They say friends come and go, but I'm genuinely grateful that you're the kind of friend I can always count on. Here's to all the memories we've made and all the crazy ones still waiting for us 🫶",
  "I don't need a thousand reasons to smile… sometimes one stupid conversation with you is more than enough 😂❤️"
];

let msgIndex = 0;

function setMessage(index, instant) {
  messageText.textContent = messages[index];
  if (instant) return;
  messageText.classList.add("fade-in");
  setTimeout(() => messageText.classList.remove("fade-in"), 650);
}

function rotateMessage() {
  if (reduceMotion) {
    msgIndex = (msgIndex + 1) % messages.length;
    setMessage(msgIndex);
    return;
  }
  messageText.classList.add("fade-out");
  setTimeout(() => {
    msgIndex = (msgIndex + 1) % messages.length;
    messageText.textContent = messages[msgIndex];
    messageText.classList.remove("fade-out");
  }, 500);
}

setMessage(0, true);
if (!reduceMotion) setInterval(rotateMessage, 6000);

// =====================================================
// 5) Counter: counts down to the date, then counts up since it
// =====================================================
function updateCounterTitle() {
  const isCountingUp = Date.now() >= OUR_DATE.getTime();
  counterTitleEl.textContent = isCountingUp
    ? "Counting Up Since Our Special Day ❤️"
    : "Counting Down To Our Special Day ❤️";
  counterSubEl.textContent = isCountingUp
    ? "counting up since our special day · " + OUR_DATE_LABEL + " 💫"
    : "counting down to our special day · " + OUR_DATE_LABEL + " 💫";
}

function updateCounter() {
  const diff = Math.abs(Date.now() - OUR_DATE.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  daysEl.textContent = days;
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}
updateCounterTitle();
updateCounter();
setInterval(updateCounter, 1000);

// =====================================================
// 6) Unlock the surprise
// =====================================================
function revealSurprise() {
  surpriseEl.classList.remove("hidden");
}

// The locked photos join the visible ones as soon as the date is right
function revealLockedPhotos() {
  lockedPhotos.forEach((img) => img.classList.remove("locked"));
}

// The floating song button only makes sense once the surprise is open
function revealMusicPlayer() {
  musicPlayer.classList.remove("hidden");
}

function tryUnlock() {
  if (passwordInput.value.trim() === SPECIAL_DATE) {
    errorEl.textContent = "";
    revealSurprise();
    revealLockedPhotos();
    revealMusicPlayer();
    openPopup();
  } else {
    errorEl.textContent = "Wrong date \u{1F494}";
  }
}
unlockBtn.addEventListener("click", tryUnlock);
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    tryUnlock();
  }
});

// =====================================================
// 7) Popup + floating hearts + song
// =====================================================
let fadeInterval = null;

function stopFade() {
  if (fadeInterval) {
    clearInterval(fadeInterval);
    fadeInterval = null;
  }
}

function playSong(fromStart) {
  // If the song is already playing, keep it going (don't restart/stop it)
  if (!song.paused) return;

  stopFade();
  if (fromStart) {
    song.currentTime = 0;
  }
  song.volume = 0;
  song.play()
    .then(() => {
      let vol = 0;
      fadeInterval = setInterval(() => {
        if (vol < 1) {
          vol = Math.min(1, vol + 0.03);
          song.volume = vol;
        } else {
          stopFade();
        }
      }, 200);
    })
    .catch(() => {});
}

function pauseSong() {
  stopFade();
  song.pause();
}

function spawnEnvelopeBurst() {
  if (!heartsContainer) return;
  heartsContainer.innerHTML = "";
  const icons = ["❤️", "💖", "✨", "🌸", "💕", "🌹"];
  for (let i = 0; i < 28; i++) {
    const heart = document.createElement("span");
    heart.classList.add("heart-popup");
    heart.textContent = icons[Math.floor(Math.random() * icons.length)];
    heart.style.left = Math.random() * 90 + 5 + "%";
    heart.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    heart.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
    heart.style.fontSize = Math.floor(16 + Math.random() * 18) + "px";
    heart.style.animationDelay = (Math.random() * 0.4).toFixed(2) + "s";
    heartsContainer.appendChild(heart);
  }
}

function openLetterEnvelope() {
  if (envelope && !envelope.classList.contains("opened")) {
    envelope.classList.add("opened");
    spawnEnvelopeBurst();
    playSong(true); // Start song when letter is opened!
  }
}

if (waxSeal) {
  waxSeal.addEventListener("click", (e) => {
    e.stopPropagation();
    openLetterEnvelope();
  });
}

function openPopup() {
  if (envelope) {
    envelope.classList.remove("opened");
  }
  if (heartsContainer) {
    heartsContainer.innerHTML = "";
  }
  lovePopup.classList.remove("hidden");
}

function closePopup() {
  lovePopup.classList.add("hidden");
}

closePopupBtn.addEventListener("click", closePopup);

lovePopup.addEventListener("click", (e) => {
  if (e.target === lovePopup) {
    closePopup();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lovePopup.classList.contains("hidden")) {
    closePopup();
  }
});

// =====================================================
// 8) Floating music player
// =====================================================
function updatePlayerUI() {
  const isPlaying = !song.paused;
  musicPlayer.classList.toggle("playing", isPlaying);
  playerText.textContent = isPlaying ? SONG_NAME : "Play our song";
}

musicPlayer.addEventListener("click", () => {
  if (song.paused) {
    playSong(false); // resume from where it left off
  } else {
    pauseSong();
  }
});

song.addEventListener("play", updatePlayerUI);
song.addEventListener("pause", updatePlayerUI);

// =====================================================
// 9) Lightbox for the gallery
// =====================================================
let currentPhoto = 0;
let visiblePhotos = [];

// Photos inside the locked surprise are not browsable before they are revealed
function getVisiblePhotos() {
  return galleryImages.filter((img) => img.getClientRects().length > 0);
}

function showPhoto() {
  lightboxImg.src = visiblePhotos[currentPhoto].src;
  lightboxImg.alt = visiblePhotos[currentPhoto].alt;
}

function openLightbox(img) {
  visiblePhotos = getVisiblePhotos();
  currentPhoto = visiblePhotos.indexOf(img);
  if (currentPhoto < 0) {
    visiblePhotos = [img];
    currentPhoto = 0;
  }
  showPhoto();
  lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.add("hidden");
  document.body.style.overflow = "";
  lightboxImg.src = "";
}

function nextPhoto() {
  currentPhoto = (currentPhoto + 1) % visiblePhotos.length;
  showPhoto();
}

function prevPhoto() {
  currentPhoto = (currentPhoto - 1 + visiblePhotos.length) % visiblePhotos.length;
  showPhoto();
}

galleryImages.forEach((img) => {
  img.addEventListener("click", () => openLightbox(img));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxNext.addEventListener("click", nextPhoto);
lightboxPrev.addEventListener("click", prevPhoto);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (lightbox.classList.contains("hidden")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") nextPhoto();
  if (event.key === "ArrowLeft") prevPhoto();
});

// =====================================================
// 10) STAR SKY — animated stars on canvas background
// =====================================================
(function initStars() {
  const canvas = document.getElementById("starCanvas");
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x:      Math.random() * canvas.width,
        y:      Math.random() * canvas.height,
        r:      Math.random() * 1.6 + 0.3,
        alpha:  Math.random(),
        speed:  Math.random() * 0.006 + 0.002,
        dir:    Math.random() < 0.5 ? 1 : -1,
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      s.alpha += s.speed * s.dir;
      if (s.alpha >= 1 || s.alpha <= 0) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 57, 70, ${s.alpha * 0.7})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  resize();
  createStars(160);
  drawStars();
  window.addEventListener("resize", () => { resize(); createStars(160); });
})();

// =====================================================
// 11) CONFETTI — burst on first load
// =====================================================
(function initConfetti() {
  if (reduceMotion) return;

  const duration = 3500;
  const end = Date.now() + duration;

  const colors = ["#e63946", "#ff8fa3", "#ff4d6d", "#ffd6dc", "#c9184a"];

  function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  }

  // Small delay so it fires after the page paints
  setTimeout(frame, 400);
})();

// =====================================================
// 12) MOUSE TRAIL — romantic words follow the cursor
// =====================================================
(function initMouseTrail() {
  if (reduceMotion) return;

  const container = document.getElementById("mouseTrail");
  const words = ["❤️", "love", "marioma", "✨", "💕", "forever", "🌸", "sweet", "💫"];
  let wordIndex = 0;
  let lastTime = 0;
  const THROTTLE = 200; // ms between words

  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastTime < THROTTLE) return;
    lastTime = now;

    const span = document.createElement("span");
    span.className = "trail-word";
    span.textContent = words[wordIndex % words.length];
    wordIndex++;
    span.style.left = e.clientX + "px";
    span.style.top  = e.clientY + "px";
    container.appendChild(span);

    span.addEventListener("animationend", () => span.remove(), { once: true });
  });
})();

// =====================================================
// 13) BIRTHDAY COUNTDOWN — November 15
// =====================================================
(function initBirthdayCounter() {
  const bdaysEl    = document.getElementById("bdays");
  const bhoursEl   = document.getElementById("bhours");
  const bminutesEl = document.getElementById("bminutes");
  const bsecondsEl = document.getElementById("bseconds");

  function getNextBirthday() {
    const now = new Date();
    let bday = new Date(now.getFullYear(), 10, 15, 0, 0, 0); // Nov = month 10
    if (bday <= now) bday = new Date(now.getFullYear() + 1, 10, 15, 0, 0, 0);
    return bday;
  }

  function updateBirthday() {
    const diff = getNextBirthday() - Date.now();
    if (diff <= 0) {
      bdaysEl.textContent    = "🎂";
      bhoursEl.textContent   = "Happy";
      bminutesEl.textContent = "Birth";
      bsecondsEl.textContent = "day!";
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    bdaysEl.textContent    = d;
    bhoursEl.textContent   = String(h).padStart(2, "0");
    bminutesEl.textContent = String(m).padStart(2, "0");
    bsecondsEl.textContent = String(s).padStart(2, "0");
  }

  updateBirthday();
  setInterval(updateBirthday, 1000);
})();

// =====================================================
// 14) FLIP CARDS — toggle on click / Enter key
// =====================================================
document.querySelectorAll(".flip-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("flipped"));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.classList.toggle("flipped");
    }
  });
});

// =====================================================
// 15) SCRATCH CARD — canvas-based scratcher
// =====================================================
(function initScratchCard() {
  const canvas  = document.getElementById("scratchCanvas");
  const ctx     = canvas.getContext("2d");
  const resetBtn = document.getElementById("scratchReset");

  function buildScratchLayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pink/rose gradient cover
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#e63946");
    grad.addColorStop(1, "#c1121f");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, 20);
    ctx.fill();

    // Hint text on top
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "bold 18px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🪙  Scratch here!", canvas.width / 2, canvas.height / 2 - 8);
    ctx.font = "14px Poppins, sans-serif";
    ctx.fillText("Use your finger or mouse", canvas.width / 2, canvas.height / 2 + 18);
  }

  buildScratchLayer();

  // Eraser compositing
  ctx.globalCompositeOperation = "destination-out";

  let painting = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (canvas.width  / rect.width),
      y: (src.clientY - rect.top)  * (canvas.height / rect.height),
    };
  }

  function scratch(e) {
    if (!painting) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener("mousedown",  (e) => { painting = true; scratch(e); });
  canvas.addEventListener("mousemove",  scratch);
  canvas.addEventListener("mouseup",    () => { painting = false; });
  canvas.addEventListener("mouseleave", () => { painting = false; });

  canvas.addEventListener("touchstart", (e) => { e.preventDefault(); painting = true; scratch(e); }, { passive: false });
  canvas.addEventListener("touchmove",  (e) => { e.preventDefault(); scratch(e); },                  { passive: false });
  canvas.addEventListener("touchend",   () => { painting = false; });

  resetBtn.addEventListener("click", () => {
    // Reset composite to source-over to repaint the cover
    ctx.globalCompositeOperation = "source-over";
    buildScratchLayer();
    ctx.globalCompositeOperation = "destination-out";
  });
})();

