
// =====================================
// RECRAFT AI - IMAGE RECOGNITION
// =====================================

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/XQ7tmbnx3/";

const CONFIDENCE_THRESHOLD = 0.60;

let model = null;
let selectedImage = false;

const $ = (id) => document.getElementById(id);


// =====================================
// NAVIGATION
// =====================================

function showPage(pageName) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const targetPage = $(pageName);

  if (!targetPage) return;

  targetPage.classList.add("active");

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageName
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// =====================================
// PROJECT LIBRARY
// =====================================

const projects = {

  plastic: [
    {
      name: "Bottle Plant Pot",
      emoji: "🪴",
      description: "Transform an empty plastic bottle into a little home for a plant.",
      difficulty: "Easy",
      time: "20–30 minutes",
      materials: [
        "One clean plastic bottle",
        "Potting soil",
        "A small plant or seeds",
        "Scissors",
        "Decorations (optional)"
      ],
      steps: [
        "Ask an adult to help cut the bottle to the desired height.",
        "Make sure the cut edges are smooth and safely covered.",
        "Add potting soil to the prepared bottle.",
        "Place your small plant or seeds inside.",
        "Decorate the outside if you wish.",
        "Place your new plant pot somewhere suitable."
      ],
      safety: "Have an adult handle cutting the bottle. Be careful around sharp edges and use clean materials."
    },

    {
      name: "Desk Organiser",
      emoji: "✏️",
      description: "Turn a bottle into a useful organiser for stationery.",
      difficulty: "Easy",
      time: "15–25 minutes",
      materials: [
        "One clean plastic bottle",
        "Scissors",
        "Coloured paper or paint",
        "Glue",
        "Pens and stationery"
      ],
      steps: [
        "Ask an adult to prepare the bottle by cutting it to the desired height.",
        "Make sure all edges are smooth and protected.",
        "Cover the outside with coloured paper or decorate it with paint.",
        "Allow any glue or paint to dry.",
        "Place your pens, pencils and stationery inside."
      ],
      safety: "An adult should prepare the bottle and check its edges before you decorate or use it."
    },

    {
      name: "Self-Watering Planter",
      emoji: "🌱",
      description: "Create a planter that helps supply water to your plant.",
      difficulty: "Medium",
      time: "25–35 minutes",
      materials: [
        "One clean plastic bottle",
        "Cotton string or thick cotton wick",
        "Water",
        "Potting soil",
        "A small plant"
      ],
      steps: [
        "Ask an adult to prepare the bottle by separating it into two sections.",
        "Make sure all cut edges are smooth and protected.",
        "Thread the cotton wick through the prepared opening.",
        "Add water to the lower section.",
        "Add soil and your plant to the upper section.",
        "Position the wick so it can draw water towards the soil.",
        "Check the water level regularly."
      ],
      safety: "Have an adult prepare the bottle. Keep the planter stable and avoid overwatering."
    }
  ],

  aluminium: [
    {
      name: "Pencil Holder",
      emoji: "🖊️",
      description: "Give an aluminium can a new purpose as a stationery holder.",
      difficulty: "Easy",
      time: "15–20 minutes",
      materials: [
        "An empty aluminium can prepared by an adult",
        "Coloured paper",
        "Glue",
        "Stickers or decorations",
        "Pens and pencils"
      ],
      steps: [
        "Ask an adult to prepare the can and make sure its opening is safely covered.",
        "Clean and dry the can.",
        "Wrap coloured paper around its outside.",
        "Decorate it with stickers or drawings.",
        "Let everything dry.",
        "Use it to organise your stationery."
      ],
      safety: "Only use a can prepared by an adult with smooth, protected edges. Never handle a freshly cut can."
    },

    {
      name: "Decorative Storage Can",
      emoji: "🎨",
      description: "Create a colourful container for small craft supplies.",
      difficulty: "Easy",
      time: "20–30 minutes",
      materials: [
        "An empty aluminium can prepared by an adult",
        "Decorative paper",
        "Glue",
        "Ribbon",
        "Stickers"
      ],
      steps: [
        "Ask an adult to prepare the can with a safe, covered opening.",
        "Clean and dry the outside.",
        "Measure decorative paper around the can.",
        "Glue the paper onto the outside.",
        "Add ribbon or stickers.",
        "Use it to store small craft supplies."
      ],
      safety: "The can must be professionally or safely prepared by an adult, with no exposed sharp edges."
    },

    {
      name: "Mini Planter Cover",
      emoji: "🌿",
      description: "Give a plain plant pot a decorative recycled outer cover.",
      difficulty: "Easy",
      time: "15–25 minutes",
      materials: [
        "An empty aluminium can prepared by an adult",
        "A small plant pot that fits inside",
        "Decorative paper",
        "Glue",
        "Paint or stickers"
      ],
      steps: [
        "Ask an adult to prepare the can with a safe, covered opening.",
        "Clean and dry the can.",
        "Decorate its outside using paper, paint or stickers.",
        "Allow decorations to dry completely.",
        "Place a separate small plant pot inside the can.",
        "Display your decorated planter cover."
      ],
      safety: "Use the can only as an outer cover for a separate plant pot. An adult must check that all edges are protected."
    }
  ],

  cardboard: [
    {
      name: "Desk Organiser",
      emoji: "📚",
      description: "Organise your stationery using recycled cardboard.",
      difficulty: "Easy",
      time: "25–35 minutes",
      materials: [
        "Clean cardboard",
        "A ruler",
        "Pencil",
        "Glue or tape",
        "Coloured paper"
      ],
      steps: [
        "Draw the shapes for your organiser on the cardboard.",
        "Ask an adult to help cut out the pieces if needed.",
        "Fold the cardboard into separate compartments.",
        "Secure the pieces using glue or tape.",
        "Cover the organiser with coloured paper.",
        "Add your stationery and enjoy your new organiser."
      ],
      safety: "Use child-safe craft scissors and ask an adult for help with cutting thicker cardboard."
    },

    {
      name: "Mini Storage Box",
      emoji: "📦",
      description: "Create a small storage box for your everyday belongings.",
      difficulty: "Easy",
      time: "20–30 minutes",
      materials: [
        "Clean cardboard",
        "Glue or tape",
        "Ruler",
        "Pencil",
        "Decorative paper"
      ],
      steps: [
        "Choose the size you want your storage box to be.",
        "Measure and draw the base and sides on the cardboard.",
        "Ask an adult to help cut out the pieces if needed.",
        "Fold the sides upwards.",
        "Secure them with glue or tape.",
        "Decorate your box with paper or drawings."
      ],
      safety: "Use safe craft materials and ask an adult for help with cutting."
    },

    {
      name: "Cardboard Phone Stand",
      emoji: "📱",
      description: "Make a simple stand to hold your phone upright.",
      difficulty: "Easy",
      time: "15–25 minutes",
      materials: [
        "Strong clean cardboard",
        "Ruler",
        "Pencil",
        "Glue or tape",
        "Decorative paper"
      ],
      steps: [
        "Draw two matching support shapes on the cardboard.",
        "Ask an adult to help cut out the shapes if needed.",
        "Create a small base from another piece of cardboard.",
        "Attach the supports to the base.",
        "Add a small front ledge to help hold the phone.",
        "Decorate your stand and test it with your phone."
      ],
      safety: "Make sure the stand is stable and use adult assistance when cutting thicker cardboard."
    }
  ]
};


// =====================================
// LOAD THE TEACHABLE MACHINE MODEL
// =====================================

async function loadModel() {
  $("modelStatus").textContent = "Loading AI model...";

  try {
    if (typeof tmImage === "undefined") {
      throw new Error("The AI library could not be loaded.");
    }

    model = await tmImage.load(
      MODEL_URL + "model.json",
      MODEL_URL + "metadata.json"
    );

    $("modelStatus").textContent = "✓ AI model ready! Upload your photo.";
    $("identifyBtn").disabled = !selectedImage;

  } catch (error) {
    console.error("Model loading error:", error);

    $("modelStatus").textContent = "AI model could not be loaded.";
    $("errorMessage").textContent =
      "Please check your internet connection and refresh the page.";
  }
}


// =====================================
// IMAGE UPLOAD AND PREVIEW
// =====================================

$("imageInput").addEventListener("change", function(event) {

  const file = event.target.files[0];

  if (!file) return;

  $("errorMessage").textContent = "";

  if (!file.type.startsWith("image/")) {
    $("errorMessage").textContent = "Please choose an image file.";
    this.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    $("errorMessage").textContent = "Please choose an image smaller than 10 MB.";
    this.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {

    $("preview").onload = function() {
      selectedImage = true;
      $("previewContainer").hidden = false;
      $("identifyBtn").disabled = !model;

      $("resultPanel").hidden = true;
      $("projectPanel").hidden = true;
      $("tutorialPanel").hidden = true;
    };

    $("preview").src = e.target.result;
  };

  reader.onerror = function() {
    $("errorMessage").textContent = "Could not read this image. Try another one.";
  };

  reader.readAsDataURL(file);
});


// =====================================
// IDENTIFY THE MATERIAL
// =====================================

$("identifyBtn").addEventListener("click", async function() {

  if (!model || !selectedImage) return;

  const button = this;

  button.disabled = true;
  button.textContent = "Analysing your photo...";

  $("errorMessage").textContent = "";
  $("resultPanel").hidden = true;
  $("projectPanel").hidden = true;
  $("tutorialPanel").hidden = true;

  try {

    const predictions = await model.predict($("preview"));

    const bestPrediction = predictions.reduce((best, current) => {
      return current.probability > best.probability ? current : best;
    });

    const category = getCategory(bestPrediction.className);

    if (!category) {
      throw new Error(
        "The model returned an unexpected category. Check your model labels."
      );
    }

    if (bestPrediction.probability < CONFIDENCE_THRESHOLD) {
      showUncertain();
      return;
    }

    displayResult(category, bestPrediction.probability);

  } catch (error) {

    console.error("Recognition error:", error);

    $("errorMessage").textContent =
      "Something went wrong while identifying your photo. Please try again.";

  } finally {

    button.disabled = !model || !selectedImage;
    button.textContent = "Identify My Waste →";

  }
});


// =====================================
// MATCH THE MODEL LABELS
// =====================================

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


// =====================================
// DISPLAY AI RESULT
// =====================================

function displayResult(category, probability) {

  const details = {
    plastic: {
      name: "Plastic Bottles",
      emoji: "🧴",
      description: "Your image appears to show a plastic bottle! Let's give it a second life."
    },

    aluminium: {
      name: "Aluminium Cans",
      emoji: "🥫",
      description: "Your image appears to show an aluminium can! There are creative ways to reuse it."
    },

    cardboard: {
      name: "Cardboard Boxes",
      emoji: "📦",
      description: "Your image appears to show cardboard! Let's turn it into something useful."
    }
  };

  const result = details[category];

  $("resultEmoji").textContent = result.emoji;
  $("resultTitle").textContent = result.name;
  $("resultDescription").textContent = result.description;

  $("confidenceText").textContent =
    "Model confidence: " + (probability * 100).toFixed(1) + "%";

  $("resultPanel").hidden = false;

  $("projectIntro").textContent =
    "Here are some creative ways to reuse your " + result.name.toLowerCase() + ".";

  displayProjects(category);

  $("projectPanel").hidden = false;

  $("tutorialPanel").hidden = true;

  $("resultPanel").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// =====================================
// LOW CONFIDENCE RESULT
// =====================================

function showUncertain() {

  $("resultEmoji").textContent = "🤔";
  $("resultTitle").textContent = "We're not quite sure!";
  $("resultDescription").textContent =
    "The AI is not confident enough about this photo. Try uploading a clearer picture with the item fully visible.";

  $("confidenceText").textContent =
    "Try taking the photo in good lighting.";

  $("resultPanel").hidden = false;
  $("projectPanel").hidden = true;
  $("tutorialPanel").hidden = true;

  $("resultPanel").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// =====================================
// DISPLAY PROJECT OPTIONS
// =====================================

function displayProjects(category) {

  const grid = $("projectGrid");

  grid.innerHTML = "";

  projects[category].forEach((project, index) => {

    const card = document.createElement("article");
    card.className = "project-card";

    const emoji = document.createElement("div");
    emoji.className = "project-emoji";
    emoji.textContent = project.emoji;

    const title = document.createElement("h3");
    title.textContent = project.name;

    const description = document.createElement("p");
    description.textContent = project.description;

    const button = document.createElement("button");
    button.textContent = "View Tutorial →";

    button.addEventListener("click", () => {
      openTutorial(category, index);
    });

    card.append(emoji, title, description, button);

    grid.appendChild(card);
  });
}


// =====================================
// OPEN A PROJECT TUTORIAL
// =====================================

function openTutorial(category, index) {

  const project = projects[category][index];

  if (!project) return;

  $("tutorialEmoji").textContent = project.emoji;
  $("tutorialTitle").textContent = project.name;
  $("tutorialDescription").textContent = project.description;

  $("tutorialDifficulty").textContent =
    "Difficulty: " + project.difficulty;

  $("tutorialTime").textContent =
    "Estimated time: " + project.time;

  // Materials list
  const materialsList = $("materialsList");
  materialsList.innerHTML = "";

  project.materials.forEach(material => {
    const li = document.createElement("li");
    li.textContent = material;
    materialsList.appendChild(li);
  });

  // Instructions list
  const stepsList = $("stepsList");
  stepsList.innerHTML = "";

  project.steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });

  $("safetyText").textContent = project.safety;

  // Keep the project cards visible.
  $("tutorialPanel").hidden = false;

  $("tutorialPanel").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


// =====================================
// REMOVE IMAGE AND RESET
// =====================================

$("removeImage").addEventListener("click", function() {

  selectedImage = false;

  $("imageInput").value = "";
  $("preview").src = "";

  $("previewContainer").hidden = true;
  $("identifyBtn").disabled = true;

  $("resultPanel").hidden = true;
  $("projectPanel").hidden = true;
  $("tutorialPanel").hidden = true;

  $("errorMessage").textContent = "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


// =====================================
// START THE WEBSITE
// =====================================

loadModel();
