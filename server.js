/********************************************************************************
 *  WEB322 – Assignment 2
 *  Name: Shobhna Beniwal
 *  Date: (add your submission date)
 *  Student ID: (add your student ID)
 ********************************************************************************/

const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------
// Middleware Setup
// ----------------------------
app.use(express.static("public")); // serve main.css, images, JS
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
// ----------------------------
// Load JSON data
// ----------------------------
let projects = [];
let sectors = [];

try {
  const projectData = fs.readFileSync(path.join(__dirname, "data", "projectData.json"), "utf8");
  const sectorData = fs.readFileSync(path.join(__dirname, "data", "sectorData.json"), "utf8");

  projects = JSON.parse(projectData);
  sectors = JSON.parse(sectorData);

  // Add readable sector names to each project
  projects = projects.map((p) => {
    const sector = sectors.find((s) => s.id === p.sector_id);
    return { ...p, sector_name: sector ? sector.sector_name : "Unknown" };
  });
} catch (err) {
  console.error("Error loading JSON data:", err.message);
}

// ----------------------------
// Routes
// ----------------------------

// Home page (shows 3 featured projects)
app.get("/", (req, res) => {
  res.render("home", {
    page: "/",
    featured: projects.slice(0, 3),
  });
});

// About page
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// All projects (with optional sector filter)
app.get("/solutions/projects", (req, res) => {
  const { sector } = req.query;

  let filtered = projects;
  if (sector) {
    filtered = projects.filter((p) =>
      p.sector_name.toLowerCase().includes(sector.toLowerCase())
    );
  }

  if (filtered.length === 0) {
    return res.status(404).render("404", {
      page: "",
      message: `No projects found for sector: ${sector}`,
    });
  }

  res.render("projects", {
    page: "/solutions/projects",
    projects: filtered,
  });
});

// Single project details
app.get("/solutions/projects/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).render("404", {
      page: "",
      message: `Project with ID ${id} not found`,
    });
  }

  res.render("project", {
    page: "/solutions/projects",
    project,
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).render("404", {
    page: "",
    message: `No view matched for ${req.originalUrl}`,
  });
});

// ----------------------------
// Start server
// ----------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
