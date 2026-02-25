const PROJECTS_KEY = "whiteboard:projects";
const snapshotKey = (id) => `whiteboard:snapshot:${id}`;

export function getProjects() {
  return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
}

export function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function createProject() {
  const key = crypto.randomUUID();
  const project = { key, name: `Project - ${Date.now()}` };
  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);
  return project;
}

export function getSnapshot(id) {
  const raw = localStorage.getItem(snapshotKey(id));
  return raw ? JSON.parse(raw) : {};
}

export function saveSnapshot(id, snapshot) {
  localStorage.setItem(snapshotKey(id), JSON.stringify(snapshot));
}
