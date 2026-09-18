// =====================================================
// For mo2a - Main Script (clean, organized)
// =====================================================

const SPECIAL_DATE = "2/10/2025"; // the date that unlocks the surprise
const OUR_DATE_LABEL = "2/10/2025"; // single source for the date shown in the counter text
const OUR_DATE = new Date(2025, 9, 2, 0, 0, 0); // 2 Oct 2025, 00:00 local time (month is 0-indexed)
const SONG_NAME = "Sherine - 3yoonak dawbony ❤️.mp3"; // the name of the song file (for the floating player)
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

function openPopup() {
  heartsContainer.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement("span");
    heart.classList.add("heart-popup");
    heart.textContent = "\u{1F496}";
    heart.style.left = Math.random() * 90 + 5 + "%";
    heart.style.animationDuration = 2 + Math.random() * 3 + "s";
    heart.style.opacity = 0.3 + Math.random() * 0.7;
    heartsContainer.appendChild(heart);
  }
  lovePopup.classList.remove("hidden");
  playSong(true); // start our song from the beginning for the surprise
}

closePopupBtn.addEventListener("click", () => {
  lovePopup.classList.add("hidden");
  // NOT pausing the song on purpose — the music keeps playing after closing
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
