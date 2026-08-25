const checkerForm = document.querySelector(".checker-form");
const messageInput = document.querySelector("#message-content");
const resultContainer = document.querySelector("#checker-result");
const checkerButton = checkerForm.querySelector("#check-message-button");
const menuButton = document.querySelector(".mobile-menu-button");
const menuCloseButton = document.querySelector(".mobile-menu-close");
const mobileMenu = document.querySelector("#mobile-menu");

function closeMobileMenu() {
  mobileMenu.classList.remove("is-open");
  menuButton.classList.remove("is-hidden");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
  mobileMenu.classList.add("is-open");
  menuButton.classList.add("is-hidden");
  menuButton.setAttribute("aria-expanded", "true");
});

menuCloseButton.addEventListener("click", () => {
  closeMobileMenu();
});

const mobileMenuLinks = mobileMenu.querySelectorAll("a");

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
    closeMobileMenu();
    menuButton.focus();
  }
});

const warningPatterns = [
  {
    label: "Urgency to act",
    keywords: ["urgent", "immediately", "act now"]
  },
  {
    label: "Suspicious link",
    keywords: ["click here", "http://", "https://"]
  },
  {
    label: "Request for personal information",
    keywords: ["password", "bank details", "verify account"]
  },
  {
    label: "Unexpected payment or prize",
    keywords: ["prize", "delivery fee", "payment required"]
  }
];

checkerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) {
    showError();
    return;
  }

  showLoading();

  setTimeout(() => {
    analyseMessage(message);
  }, 1200);
});

function analyseMessage(message) {
  const lowerCaseMessage = message.toLowerCase();

  const detectedWarnings = warningPatterns
    .filter((pattern) =>
      pattern.keywords.some((keyword) =>
        lowerCaseMessage.includes(keyword)
      )
    )
    .map((pattern) => pattern.label);

  if (detectedWarnings.length > 0) {
    showSuspiciousResult(detectedWarnings);
  } else {
    showLowerRiskResult();
  }
}

function showError() {
  resultContainer.innerHTML = `
    <div class="result-card result-error">
      <h3>Please enter a message</h3>
      <p>Paste a suspicious message before checking.</p>
    </div>
  `;
}

function showLoading() {
  checkerButton.disabled = true;
  checkerButton.classList.add("is-loading");

  checkerButton.innerHTML = `
    <span class="loading-spinner" aria-hidden="true"></span>
    <span>Checking this message...</span>
  `;

  document.querySelector(".demo-note").classList.add("is-hidden");

  resultContainer.innerHTML = `
    <p class="loading-warning">
    <img  src="assets/icons/warning-magenta.svg" alt="" aria-hidden="true">
      <span>Do not click or respond yet!</span>
    </p>
  `;
}

function restoreCheckerButton() {
  checkerButton.disabled = false;
  checkerButton.classList.remove("is-loading");
  checkerButton.innerHTML = "Check this message";

  document.querySelector(".demo-note").classList.remove("is-hidden");
}

function showSuspiciousResult(detectedWarnings) {
  restoreCheckerButton();

  const warningList = detectedWarnings
    .map((warning) => `<li>${warning}</li>`)
    .join("");

  resultContainer.innerHTML = `
    <div class="result-card result-warning">
      <h3 class="result-warning-title">
  <img
    src="assets/icons/alert-magenta.svg"
    alt=""
    aria-hidden="true"
  >
  <span>Possible scam signs found</span>
</h3>

      <p>
        This message contains warning signs commonly associated with scams.
      </p>

      <h4>Warning signs detected</h4>

      <ul>
        ${warningList}
      </ul>

      <p class="result-question">
        Did you share any personal information?
      </p>

     <button
  type="button"
  class="button sos-button reset-checker"
>
  Start SOS Plan
</button>
    </div>
  `;

  addResetListener();
}

function showLowerRiskResult() {
  restoreCheckerButton();

  resultContainer.innerHTML = `
    <div class="result-card result-success">
      <h3 class="result-success-title">
        <img
          src="assets/icons/check-blue.svg"
          alt=""
          aria-hidden="true"
        >
        <span>No obvious warning signs found</span>
      </h3>

      <p>
        This does not guarantee that the message is safe.
        Always verify the sender if you are uncertain. If in doubt, verify the sender by contacting them through trusted channels.
      </p>

    </div>
  `;

  addResetListener();
}

function addResetListener() {
  const resetButton = document.querySelector(".reset-checker");

  resetButton.addEventListener("click", () => {
    messageInput.value = "";
    resultContainer.innerHTML = "";
    messageInput.focus();
  });
}