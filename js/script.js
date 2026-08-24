const checkerForm = document.querySelector(".checker-form");
const messageInput = document.querySelector("#message-content");
const resultContainer = document.querySelector("#checker-result");

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
  resultContainer.innerHTML = `
    <div class="result-card result-loading">
      <h3>Checking this message...</h3>
      <p>Do not click or respond yet.</p>
    </div>
  `;
}

function showSuspiciousResult(detectedKeywords) {
  const keywordList = detectedKeywords
    .map((keyword) => `<li>${keyword}</li>`)
    .join("");

  resultContainer.innerHTML = `
    <div class="result-card result-warning">
      <h3>Possible scam detected</h3>

      <p>
        This message contains warning signs commonly associated with scams.
      </p>

      <h4>Warning signs detected</h4>

      <ul>
        ${keywordList}
      </ul>

      <p>
        This demonstration cannot confirm whether a message is genuine.
        Verify the sender through an official channel before taking action.
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

function showLowerRiskResult() {
  resultContainer.innerHTML = `s
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