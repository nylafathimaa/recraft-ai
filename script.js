
// =====================================
// RECRAFT AI - WASTE RECOGNITION
// =====================================

const MODEL_URL =
  "https://teachablemachine.withgoogle.com/models/XQ7tmbnx3/";

const CONFIDENCE_THRESHOLD = 0.70;

let model = null;
let selectedImage = null;

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const identifyBtn = document.getElementById("identifyBtn");
const modelStatus = document.getElementById("modelStatus");
const result = document.getElementById("result");

// =====================================
// PROJECT IDEAS
// =====================================

const projects = {
  plastic: {
    title: "Plastic Bottle Projects",
    emoji: "🪴",
    description: "Give your plastic bottle a useful second life!",
    ideas: [
      {
        name: "Mini Plant Pot",
        materials: "Plastic bottle, soil, small plant and paint.",
        steps: [
          "Ask an adult to prepare a bottle with a smooth, safe opening.",
          "Make sure the bottle is clean and dry.",
          "Add a little soil.",
          "Plant your small plant and decorate the outside."
        ],
        difficulty: "Easy",
        time: "15–20 minutes"
      },
      {
        name: "Desk Organiser",
        materials: "Clean plastic bottle, decorative paper and glue.",
        steps: [
          "Ask an adult to prepare a bottle with safe, smooth edges.",
          "Clean and dry the bottle.",
          "Decorate its outside with paper.",
          "Use it to organise pencils and stationery."
        ],
        difficulty: "Easy",
        time: "15 minutes"
      },
      {
        name: "Self-Watering Planter",
        materials: "Plastic bottle, cotton string, soil and a plant.",
        steps: [
          "Ask an adult to prepare the bottle safely.",
          "Set up a clean bottle planter with a cotton string wick.",
          "Add soil and your plant.",
          "Place the wick so it can draw water from the reservoir."
        ],
        difficulty: "Medium",
        time: "25 minutes"
      }
    ]
  },

  aluminium: {
    title: "Aluminium Can Projects",
    emoji: "🥫",
    description: "Turn an empty can into something practical!",
    ideas: [
      {
        name: "Pencil Holder",
        materials: "Clean, adult-prepared can, paper and glue.",
        steps: [
          "Ask an adult to prepare a can with no sharp edges.",
          "Check that its edges are safely covered.",
          "Wrap decorative paper around the can.",
          "Use it to store pens and pencils."
        ],
        difficulty: "Easy",
        time: "15 minutes"
      },
      {
        name: "Decorative Storage",
        materials: "Safe prepared can, paint and decorations.",
        steps: [
          "Start with a clean can prepared by an adult.",
          "Make sure all edges are smooth and protected.",
          "Decorate the outside.",
          "Use it to store small stationery items."
        ],
        difficulty: "Easy",
        time: "20 minutes"
      },
      {
        name: "Mini Planter Cover",
        materials: "Clean, safe can and a small plant pot.",
        steps: [
          "Use a can prepared by an adult with protected edges.",
          "Decorate its outside.",
          "Place a small plant pot inside.",
          "Use it as a decorative planter cover."
        ],
        difficulty: "Easy",
        time: "15 minutes"
      }
    ]
  },

  cardboard: {
    title: "Cardboard Box Projects",
    emoji: "📦",
    description: "Discover creative ways to reuse cardboard!",
    ideas: [
      {
        name: "Desk Organiser",
        materials: "Cardboard, ruler, glue and decorative paper.",
        steps: [
          "Choose a clean cardboard box.",
          "Ask an adult to help prepare pieces if cutting is needed.",
          "Arrange the pieces into compartments.",
          "Decorate and use your organiser."
        ],
        difficulty: "Easy",
        time: "25 minutes"
      },
      {
        name: "Mini Storage Box",
        materials: "Small cardboard box, glue and decorative paper.",
        steps: [
          "Choose a clean cardboard box.",
          "Reinforce any loose corners.",
          "Cover it with decorative paper.",
          "Use it to store small belongings."
        ],
        difficulty: "Easy",
        time: "20 minutes"
      },
      {
        name: "Phone Stand",
        materials: "Sturdy cardboard and decorative paper.",
        steps: [
          "Choose a sturdy piece of cardboard.",
          "Ask an adult to help prepare the shape.",
          "Fold and assemble a stable stand.",
          "Decorate and test it with an empty phone-sized space first."
        ],
        difficulty: "Medium",
        time: "20 minutes"
      }
    ]
  }
};

// =====================================
// LOAD THE REAL AI MODEL
// =====================================

async function loadModel() {
  try {
    modelStatus.textContent = "Loading the ReCraft AI model...";

    if (typeof tmImage === "undefined") {
      throw new Error("The AI library could not be loaded.");
    }

    model = await tmImage.load(
      MODEL_URL + "model.json",
      MODEL_URL + "metadata.json"
    );

    modelStatus.textContent = "🌱 ReCraft AI is ready!";
    identifyBtn.disabled = !selectedImage;

  } catch (error) {
    console.error("Model loading error:", error);
    modelStatus.textContent =
      "AI model could not load. Please refresh and try again.";
  }
}

// =====================================
// IMAGE UPLOAD AND PREVIEW
// =====================================

imageInput.addEventListener("change", function(event) {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    modelStatus.textContent = "Please select an image file.";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    modelStatus.textContent = "Please choose an image under 10 MB.";
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    preview.onload = function() {
      selectedImage = preview;
      preview.hidden = false;
      identifyBtn.disabled = !model;
      result.replaceChildren();
      modelStatus.textContent = model
        ? "Image ready! Click Identify My Item."
        : "Image ready! Waiting for AI model...";
    };

    preview.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

// =====================================
// IDENTIFY MATERIAL
// =====================================

identifyBtn.addEventListener("click", async function() {
  if (!model || !selectedImage) return;

  identifyBtn.disabled = true;
  identifyBtn.textContent = "Analysing...";

  result.replaceChildren();

  try {
    const predictions = await model.predict(selectedImage);

    const best = predictions.reduce((a, b) =>
      a.probability > b.probability ? a : b
    );

    const confidence = best.probability;
    const label = best.className.toLowerCase();

    const category = getCategory(label);

    if (confidence < CONFIDENCE_THRESHOLD || !category) {
      showUncertainResult(best.className, confidence);
      return;
    }

    showResult(category, best.className, confidence);

  } catch (error) {
    console.error("Prediction error:", error);
    result.textContent =
      "Something went wrong while analysing your image. Please try again.";
  } finally {
    identifyBtn.disabled = !model || !selectedImage;
    identifyBtn.textContent = "Identify My Item";
  }
});

// =====================================
// MATCH MODEL LABELS TO CATEGORIES
// =====================================

function getCategory(label) {
  if (label.includes("plastic") || label.includes("bottle")) {
    return "plastic";
  }

  if (label.includes("aluminium") ||
      label.includes("aluminum") ||
      label.includes("can")) {
    return "aluminium";
  }

  if (label.includes("cardboard") ||
      label.includes("carton") ||
      label.includes("box")) {
    return "cardboard";
  }

  return null;
}

// =====================================
// DISPLAY PREDICTION
// =====================================

function showResult(category, label, confidence) {
  const project = projects[category];

  const heading = document.createElement("h3");
  heading.textContent = "🌿 We identified your item!";

  const prediction = document.createElement("p");
  prediction.textContent = project.emoji + " " + project.title;

  const score = document.createElement("p");
  score.textContent =
    "Model confidence: " + (confidence * 100).toFixed(1) + "%";

  const note = document.createElement("p");
  note.textContent =
    "Predicted category: " + label;

  result.append(heading, prediction, score, note);

  showProjects(category);
}

// =====================================
// UNCERTAIN RESULT
// =====================================

function showUncertainResult(label, confidence) {
  const heading = document.createElement("h3");
  heading.textContent = "🤔 We're not confident enough yet.";

  const message = document.createElement("p");
  message.textContent =
    "The model's top prediction was " + label +
    " with " + (confidence * 100).toFixed(1) +
    "% confidence. Try a clearer picture of one of our three trained categories.";

  result.append(heading, message);
}

// =====================================
// SHOW MATCHING PROJECTS
// =====================================

function showProjects(category) {
  const project = projects[category];

  const container = document.createElement("div");
  container.className = "project-results";

  const heading = document.createElement("h3");
  heading.textContent = "✨ " + project.description;
  container.appendChild(heading);

  project.ideas.forEach((idea) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const title = document.createElement("h4");
    title.textContent = idea.name;

    const materials = document.createElement("p");
    materials.textContent = "Materials: " + idea.materials;

    const difficulty = document.createElement("p");
    difficulty.textContent =
      "Difficulty: " + idea.difficulty +
      " | Estimated time: " + idea.time;

    const stepsHeading = document.createElement("strong");
    stepsHeading.textContent = "How to make it:";

    const steps = document.createElement("ol");

    idea.steps.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      steps.appendChild(li);
    });

    const safety = document.createElement("p");
    safety.className = "safety-note";
    safety.textContent =
      "Safety: Ask an adult for help with any cutting or preparation. Never handle sharp can edges.";

    card.append(
      title,
      materials,
      difficulty,
      stepsHeading,
      steps,
      safety
    );

    container.appendChild(card);
  });

  result.appendChild(container);
}

// =====================================
// RESET UPLOAD
// =====================================

const resetButton = document.createElement("button");

resetButton.textContent = "Choose another image";
resetButton.className = "primary-btn";
resetButton.style.marginTop = "20px";
resetButton.type = "button";

resetButton.addEventListener("click", function() {
  imageInput.value = "";
  preview.removeAttribute("src");
  preview.hidden = true;
  selectedImage = null;

  result.replaceChildren();
  identifyBtn.disabled = true;
  modelStatus.textContent = "Choose an image to get started.";

  resetButton.remove();
});

imageInput.parentElement.appendChild(resetButton);

// =====================================
// START RECRAFT AI
// =====================================

loadModel();
