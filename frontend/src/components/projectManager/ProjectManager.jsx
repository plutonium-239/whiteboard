import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject } from "../../libs/storage";

function ProjectManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setProjects(getProjects());
    setIsLoading(false);
  }, []);

  const makeNewProject = () => {
    setIsLoading(true);
    const project = createProject();
    navigate(`/edit/${project.key}`);
  };

  const openProject = (ev) => {
    const key = ev.currentTarget.dataset.key;
    navigate(`/edit/${key}`);
  };

  return (
    <div className="project-manager tl-theme__dark">
      <header>
        <h1>Projects</h1>
      </header>
      <main className="projects" data-isloading={isLoading}>
        <figure
          className="project-showcase project-showcase--new"
          onClick={makeNewProject}
        >
          <figcaption className="project-showcase__info">
            <p className="project-showcase__title">New Project</p>
          </figcaption>
        </figure>

        {projects.map((project, idx) => (
          <div
            className="project-showcase"
            key={project.key}
            data-key={project.key}
            onClick={openProject}
          >
            <img src={`https://picsum.photos/250/150?${idx}`} alt="Random cover image" draggable="false" />
            <div className="project-showcase__info">
              <p className="project-showcase__title">{project.name}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default ProjectManager;
