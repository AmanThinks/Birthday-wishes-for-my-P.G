
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Floating hearts
function createHeart() {
  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = ["♡", "♥", "ღ", "✧"][
    Math.floor(Math.random() * 4)
  ];

  heart.style.left = Math.random() * 100 + "%";
  heart.style.fontSize = 12 + Math.random() * 20 + "px";
  heart.style.setProperty("--duration", 6 + Math.random() * 5 + "s");

  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 12000);
}

for (let i = 0; i < 8; i++) {
  setTimeout(createHeart, i * 300);
}
setInterval(createHeart, 1000);

// Reveal sections while scrolling
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$(".reveal").forEach((section) => observer.observe(section));

// Confetti shower
function celebrate(count = 25) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = [
        "#e98da9", "#f5c2d0", "#ffffff",
        "#d7a1b5", "#f7d58b"
      ][Math.floor(Math.random() * 5)];
      piece.style.borderRadius =
        Math.random() > 0.5 ? "50%" : "2px";
      piece.style.setProperty(
        "--duration",
        2 + Math.random() * 2 + "s"
      );

      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 4500);
    }, i * 25);
  }
}

// Start the surprise
$("#startBtn").addEventListener("click", () => {
  $("#birthday").scrollIntoView({ behavior: "smooth" });
  celebrate(20);
});

// Birthday candles
$("#candleBtn").addEventListener("click", () => {
  const candles = [...$$(".candle")];
  const areOut = candles.every((c) =>
    c.classList.contains("out")
  );

  if (areOut) {
    candles.forEach((c) => c.classList.remove("out"));
    $("#wishText").textContent =
      "Candles relit! Make another wish, my love. ✨";
  } else {
    candles.forEach((c) => c.classList.add("out"));
    $("#wishText").textContent =
      "Wish made! May all your dreams come true, Betuuuu. ❤️";
    celebrate(30);
  }
});

// Ten reasons I love you
$$(".reason").forEach((card) => {
  card.addEventListener("click", () => {
    $$(".reason").forEach((other) =>
      other.classList.remove("opened")
    );

    card.classList.add("opened");
    $("#reasonMessage").textContent = card.dataset.message;
    celebrate(5);
  });
});

// Open the birthday gift
$("#giftBtn").addEventListener("click", () => {
  const gift = $("#giftBtn");
  const message = $("#finalMessage");
  const opening = gift.classList.toggle("open");

  message.hidden = !opening;

  $("#giftHint").textContent = opening
    ? "A little reminder, just for you ♡"
    : "Tap the gift, Betuuuu 🎁";

  if (opening) {
    celebrate(55);
    message.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
});

// Try autoplay, then retry after the first user interaction if the browser blocks it.
const song = $("#song");

async function startSong() {
  try {
    await song.play();
  } catch (error) {
    if (error.name === "NotAllowedError") {
      document.addEventListener("pointerdown", startOnInteraction, { once: true });
      document.addEventListener("keydown", startOnInteraction, { once: true });
    } else {
      console.error("Could not play assets/our-song.mp4:", error);
    }
  }
}

function startOnInteraction() {
  document.removeEventListener("pointerdown", startOnInteraction);
  document.removeEventListener("keydown", startOnInteraction);
  void startSong();
}

void startSong();

// Replay the experience
$("#replayBtn").addEventListener("click", () => {
  $$(".candle").forEach((c) => c.classList.remove("out"));
  $("#wishText").textContent = "";

  $$(".reason").forEach((c) => c.classList.remove("opened"));
  $("#reasonMessage").textContent = "Choose a heart, my love ♡";

  $("#giftBtn").classList.remove("open");
  $("#finalMessage").hidden = true;
  $("#giftHint").textContent = "Tap the gift, Betuuuu 🎁";

  $("#home").scrollIntoView({ behavior: "smooth" });
  celebrate(25);
});
