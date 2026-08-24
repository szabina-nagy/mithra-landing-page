const checkerForm = document.querySelector(".checker-form");
const messageInput = document.querySelector("#message-content");
const resultContainer = document.querySelector("#checker-result");
const checkerButton = checkerForm.querySelector("#check-message-button");

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
      <h3>No obvious warning signs found</h3>

      <p>
        This does not guarantee that the message is safe.
        Always verify the sender if you are uncertain.
      </p>

      <button
        type="button"
        class="button button-secondary reset-checker"
      >
        Check another message
      </button>
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