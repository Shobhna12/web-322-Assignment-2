const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

function initialize() {
  return new Promise((resolve, reject) => {
    if (projectData && sectorData) {
      projectData.forEach(project => {
        const matchingSector = sectorData.find(sector => sector.id === project.sector_id);
        const newProject = {
          ...project,
          sector: matchingSector ? matchingSector.sector_name : "Unknown"
        };
        projects.push(newProject);
      });
      resolve(); // Resolve with no data once the array is filled.
    } else {
      reject("Data not loaded");
    }
  });
}

function getAllProjects() {
  return new Promise((resolve, reject) => {
    if (projects.length > 0) {
      resolve(projects);
    } else {
      reject("No projects found");
    }
  });
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      resolve(project);
    } else {
      reject("Unable to find requested project");
    }
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    const lowerSector = sector.toLowerCase();
    const filtered = projects.filter(p => p.sector.toLowerCase().includes(lowerSector));
    if (filtered.length > 0) {
      resolve(filtered);
    } else {
      reject("Unable to find requested projects");
    }
  });
}

// Export the functions as a module.
module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };
