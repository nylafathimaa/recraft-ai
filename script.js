const MODEL_URL =
  "https://teachablemachine.withgoogle.com/models/XQ7tmbnx3/";

const CONFIDENCE_THRESHOLD = 0.70;

let model = null;
let selectedImage = null;
let currentCategory = null;

const $ = id => document.getElementById(id);

const imageInput = $("imageInput");
const preview = $("preview");
const identifyBtn = $("identifyBtn");
const modelStatus = $("modelStatus");

const resultPanel = $("resultPanel");
const projectPanel = $("projectPanel");
const tutorialPanel = $("tutorialPanel");

const resultTitle = $("resultTitle");
const resultDescription = $("resultDescription");
const resultEmoji = $("resultEmoji");
const confidenceText = $("confidenceText");

// ======================================
// PAGE NAVIGATION
// ======================================

function showPage(pageName) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  $(pageName).classList.add("active");

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageName
    );
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ======================================
// PROJECT DATABASE
// ======================================

const projects = {
  plastic: {
    title: "Plastic Bottles!",
    emoji: "🧴",
    description: "Your item is a plastic bottle. Here are some creative ways to reuse it!",
    ideas: [
      {
        name: "Mini Plant Pot",
        emoji: "🪴",
        description: "Give a little plant a new home.",
        difficulty: "Easy",
        time: "15–20 minutes",
        materials: [
          "Clean plastic bottle",
          "Soil",
          "Small plant",
          "Decorations or paint"
        ],
        steps: [
          "Ask an adult to prepare a bottle with a smooth, safe opening.",
          "Make sure the bottle is clean and dry.",
          "Add a little soil.",
          "Place your small plant inside.",
          "Decorate the outside of your new plant pot."
        ],
        safety: "An adult should prepare any cut edges. Make sure there are no sharp edges before handling the bottle."
      },
      {
        name: "Desk Organiser",
        emoji: "✏️",
        description: "Keep your stationery neat and organised.",
        difficulty: "Easy",
        time: "15 minutes",
        materials: [
          "Clean plastic bottle",
          "Decorative paper",
          "Glue",
          "Stickers or decorations"
        ],
        steps: [
          "Ask an adult to prepare the bottle with safe, smooth edges.",
          "Clean and dry the bottle.",
          "Wrap decorative paper around its outside.",
          "Add stickers or other decorations.",
          "Use it to store pencils and stationery."
        ],
        safety: "Only use a bottle with smooth, protected edges. Ask an adult for help with preparation."
      },
      {
        name: "Self-Watering Planter",
        emoji: "🌱",
        description: "Create a planter that helps supply water to a plant.",
        difficulty: "Medium",
        time: "25 minutes",
        materials: [
          "Plastic bottle",
          "Cotton string",
          "Soil",
          "Small plant",
          "Water"
        ],
        steps: [
          "Ask an adult to prepare the bottle safely.",
          "Set up a clean bottle planter with a cotton string wick.",
          "Add soil and your plant to the planter section.",
          "Position the wick so it can draw water from the reservoir.",
          "Add water and check that the wick works."
        ],
        safety: "An adult should prepare the bottle. Keep the planter stable and use clean water."
      }
    ]
  },

  aluminium: {
    title: "Aluminium Cans!",
    emoji: "🥫",
    description: "Your item is an aluminium can. Let's turn it into something useful!",
    ideas: [
      {
        name: "Pencil Holder",
        emoji: "✏️",
        description: "Give your desk a creative organiser.",
        difficulty: "Easy",
        time: "15 minutes",
        materials: [
          "Clean, adult-prepared aluminium can",
          "Decorative paper",
          "Glue",
          "Stickers"
        ],
        steps: [
          "Start with a clean can prepared by an adult.",
          "Check that its edges are fully smooth and protected.",
          "Wrap decorative paper around the outside.",
          "Add your favourite decorations.",
          "Use it to organise your stationery."
        ],
        safety: "Never cut or handle sharp can edges. Use only an adult-prepared can with all edges safely covered."
      },
      {
        name: "Decorative Storage Container",
        emoji: "🎨",
        description: "Make a small container for everyday items.",
        difficulty: "Easy",
        time: "20 minutes",
        materials: [
          "Clean, safe aluminium can",
          "Paint suitable for the surface",
          "Decorations",
          "Paintbrush"
        ],
        steps: [
          "Ask an adult to prepare and check the can.",
          "Make sure all edges are protected.",
          "Decorate the outside with suitable paint.",
          "Allow the paint to dry completely.",
          "Use it to store small stationery items."
        ],
        safety: "The can must have smooth, protected edges. Follow paint product safety instructions and ask an adult for help."
      },
      {
        name: "Mini Planter Cover",
        emoji: "🌼",
        description: "Create a decorative home for a small plant pot.",
        difficulty: "Easy",
        time: "15 minutes",
        materials: [
          "Clean, adult-prepared aluminium can",
          "Small plant pot",
          "Decorative paper",
          "Glue"
        ],
        steps: [
          "Choose a clean can prepared by an adult.",
          "Check that all edges are protected.",
          "Decorate its outside with paper.",
          "Place a small plant pot inside.",
          "Use it as a decorative planter cover."
        ],
        safety: "Use the can only as an outer cover for a separate plant pot. Never use one with exposed sharp edges."
      }
    ]
  },

  cardboard: {
    title: "Cardboard Boxes!",
    emoji: "📦",
    description: "Your item is a cardboard box. Here are some ways to give it a new purpose!",
    ideas: [
      {
        name: "Desk Organiser",
        emoji: "🗂️",
        description: "Create compartments for your school supplies.",
        difficulty: "Easy",
        time: "25 minutes",
        materials: [
          "Clean cardboard",
          "Ruler",
          "Glue",
          "Decorative paper"
        ],
        steps: [
          "Choose a clean cardboard box.",
          "Ask an adult to help prepare any pieces that need cutting.",
          "Arrange the pieces into compartments.",
          "Secure the pieces with glue.",
          "Decorate and organise your stationery."
        ],
        safety: "Ask an adult to help with any cutting or preparation."
      },
      {
        name: "Mini Storage Box",
        emoji: "🎁",
        description: "Turn an ordinary box into useful storage.",
        difficulty: "Easy",
        time: "20 minutes",
        materials: [
          "Small cardboard box",
          "Decorative paper",
          "Glue",
          "Ribbon or stickers"
        ],
        steps: [
          "Choose a clean cardboard box.",
          "Reinforce any loose corners.",
          "Cover the outside with decorative paper.",
          "Add stickers or ribbon.",
          "Use it to store small belongings."
        ],
        safety: "Use an adult's help if the box needs cutting or reshaping."
      },
      {
        name: "Phone Stand",
        emoji: "📱",
        description: "Make a simple stand for your phone.",
        difficulty: "Medium",
        time: "20 minutes",
        materials: [
          "Sturdy cardboard",
          "Decorative paper",
          "Glue",
          "Ruler"
        ],
        steps: [
          "Choose a sturdy piece of cardboard.",
          "Ask an adult to help prepare the shape.",
          "Fold and assemble a stable stand.",
          "Decorate the finished stand.",
          "Test its stability before placing your phone on it."
        ],
        safety: "Ask an adult to help with cutting. Make sure the stand is stable before using it."
      }
    ]
  }
};

// ======================================
// LOAD AI MODEL
// ======================================

async function loadModel() {
  try {
    modelStatus.textContent = "Loading your AI assistant...";

    if (typeof tmImage === "undefined") {
      throw new Error("The Teachable Machine library did not load.");
    }

    model = await tmImage.load(
      MODEL_URL + "model.json",
      MODEL_URL + "metadata.json"
    );

    modelStatus.textContent = "🌱 ReCraft AI is ready!";
    identifyBtn.disabled = !selectedImage;

  } catch (error) {
    console.error(error);
    modelStatus.textContent =
      "We couldn't load the AI model. Please refresh and try again.";
  }
}

// ======================================
// IMAGE UPLOAD
// ======================================

imageInput.addEventListener("change", event => {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    $("errorMessage").textContent = "Please choose an image file.";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    $("errorMessage").textContent = "Please choose an image under 10 MB.";
    return;
  }

  $("errorMessage").textContent = "";

  const reader = new FileReader();

  reader.onload = event => {
    preview.onload = () => {
      selectedImage = preview;
      preview.hidden = false;
      identifyBtn.disabled = !model;
      $("removeBtn").hidden = false;

      resultPanel.hidden = true;
      projectPanel.hidden = true;
      tutorialPanel.hidden = true;

      modelStatus.textContent = model
        ? "Image ready! Let's identify it."
        : "Image ready! Waiting for the AI model...";
    };

    preview.src = event.target.result;
  };

  reader.readAsDataURL(file);
});

// ======================================
// IDENTIFY ITEM
// ======================================

identifyBtn.addEventListener("click", async () => {
  if (!model || !selectedImage) return;

  identifyBtn.disabled = true;
  identifyBtn.textContent = "Analysing...";

  $("errorMessage").textContent = "";

  try {
    const predictions = await model.predict(selectedImage);

    const best = predictions.reduce((a, b) =>
      a.probability > b.probability ? a : b
    );

    const category = getCategory(best.className);

    if (!category || best.probability < CONFIDENCE_THRESHOLD) {
      showUncertain(best);
      return;
    }

    currentCategory = category;
    displayResult(category, best);

  } catch (error) {
    console.error(error);
    $("errorMessage").textContent =
      "Something went wrong while identifying your image. Please try again.";
  } finally {
    identifyBtn.disabled = !model || !selectedImage;
    identifyBtn.textContent = "Identify My Item →";
  }
});

// ======================================
// MATCH MODEL LABELS
// ======================================

function getCategory(label) {
  const name = label.toLowerCase();

  if (name.includes("plastic") || name.includes("bottle")) {
    return "plastic";
  }

  if (
    name.includes("aluminium") ||
    name.includes("aluminum") ||
    name.includes("can")
  ) {
    return "aluminium";
  }

  if (
    name.includes("cardboard") ||
    name.includes("carton") ||
    name.includes("box")
  ) {
    return "cardboard";
  }

  return null;
}

// ======================================
// SHOW IDENTIFICATION RESULT
// ======================================

function displayResult(category, prediction) {
  const item = projects[category];

  resultEmoji.textContent = item.emoji;
  resultTitle.textContent = item.title;
  resultDescription.textContent = item.description;

  confidenceText.textContent =
    "AI confidence: " +
    (prediction.probability * 100).toFixed(1) + "%";

  resultPanel.hidden = false;
  projectPanel.hidden = true;
  tutorialPanel.hidden = true;

  resultPanel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function showUncertain(prediction) {
  resultEmoji.textContent = "🤔";
  resultTitle.textContent = "Let's try another picture!";
  resultDescription.textContent =
    "The AI couldn't confidently identify this item. Its top prediction was " +
    prediction.className +
    ". Try a clearer picture of a plastic bottle, aluminium can or cardboard box.";

  confidenceText.textContent =
    "AI confidence: " +
    (prediction.probability * 100).toFixed(1) + "%";

  $("exploreBtn").hidden = true;

  resultPanel.hidden = false;
  projectPanel.hidden = true;
  tutorialPanel.hidden = true;

  resultPanel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// ======================================
// OPEN PROJECT COLLECTION
// ======================================

$("exploreBtn").addEventListener("click", () => {
  if (!currentCategory) return;

  const item = projects[currentCategory];

  $("projectHeading").textContent =
    "What can you create with " +
    item.title.toLowerCase().replace("!", "") + "?";

  $("projectIntro").textContent =
    "Choose a project to see its materials and step-by-step instructions.";

  const grid = $("projectGrid");
  grid.replaceChildren();

  item.ideas.forEach((idea, index) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const button = document.createElement("button");
    button.type = "button";

    const icon = document.createElement("div");
    icon.className = "project-icon";
    icon.textContent = idea.emoji;

    const title = document.createElement("h3");
    title.textContent = idea.name;

    const description = document.createElement("p");
    description.textContent = idea.description;

    const link = document.createElement("span");
    link.className = "card-link";
    link.textContent = "View tutorial →";

    button.append(icon, title, description, link);
    button.addEventListener("click", () => openTutorial(index));

    card.appendChild(button);
    grid.appendChild(card);
  });

  resultPanel.hidden = true;
  projectPanel.hidden = false;
  tutorialPanel.hidden = true;

  projectPanel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// ======================================
// OPEN INDIVIDUAL TUTORIAL
// ======================================

function openTutorial(index) {
  const idea = projects[currentCategory].ideas[index];

  $("tutorialEmoji").textContent = idea.emoji;
  $("tutorialTitle").textContent = idea.name;
  $("tutorialDescription").textContent = idea.description;
  $("tutorialDifficulty").textContent =
    "Difficulty: " + idea.difficulty;
  $("tutorialTime").textContent =
    "Estimated time: " + idea.time;

  const materialsList = $("materialsList");
  materialsList.replaceChildren();

  idea.materials.forEach(material => {
    const li = document.createElement("li");
    li.textContent = material;
    materialsList.appendChild(li);
  });

  const stepsList = $("stepsList");
  stepsList.replaceChildren();

  idea.steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });

  $("safetyText").textContent = idea.safety;

  projectPanel.hidden = true;
  tutorialPanel.hidden = false;

  tutorialPanel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// ======================================
// BACK BUTTONS
// ======================================

$("backToResult").addEventListener("click", () => {
  projectPanel.hidden = true;
  tutorialPanel.hidden = true;
  resultPanel.hidden = false;

  resultPanel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

$("backToProjects").addEventListener("click", () => {
  tutorialPanel.hidden = true;
  projectPanel.hidden = false;

  projectPanel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// ======================================
// REMOVE IMAGE AND RESET
// ======================================

$("removeBtn").addEventListener("click", () => {
  imageInput.value = "";
  preview.removeAttribute("src");
  preview.hidden = true;

  selectedImage = null;
  currentCategory = null;

  identifyBtn.disabled = true;
  $("removeBtn").hidden = true;

  resultPanel.hidden = true;
  projectPanel.hidden = true;
  tutorialPanel.hidden = true;

  $("exploreBtn").hidden = false;
  $("errorMessage").textContent = "";

  modelStatus.textContent =
    model ? "🌱 ReCraft AI is ready!" : "Loading AI model...";
});

// ======================================
// START RECRAFT AI
// ======================================

loadModel();
