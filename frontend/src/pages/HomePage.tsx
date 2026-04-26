import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  Certification,
  Job,
  Project,
  SiteSettings,
  SkillCategory,
} from "../types";
import MatrixBackground from "../components/MatrixBackground";
import Navbar from "../components/Navbar";
import ScrollProgress from "../components/ScrollProgress";
import KonamiEasterEgg from "../components/KonamiEasterEgg";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Experience from "../sections/Experience";
import Certifications from "../sections/Certifications";
import Projects from "../sections/Projects";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get<SiteSettings>("/api/settings"),
      api.get<SkillCategory[]>("/api/skill-categories"),
      api.get<Job[]>("/api/jobs"),
      api.get<Certification[]>("/api/certifications"),
      api.get<Project[]>("/api/projects"),
    ])
      .then(([s, sk, j, c, p]) => {
        if (!mounted) return;
        setSettings(s.data);
        setSkills(sk.data);
        setJobs(j.data);
        setCerts(c.data);
        setProjects(p.data);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !settings) {
    return (
      <div className="min-h-screen grid place-items-center font-mono text-cyber-cyan">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-4 bg-cyber-cyan animate-blink" />
          loading_portfolio…
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MatrixBackground />
      <ScrollProgress />
      <KonamiEasterEgg />
      <div className="relative z-10">
        <Navbar name={settings.handle || settings.full_name} />
        <main>
          <Hero settings={settings} />
          <About settings={settings} />
          <Skills categories={skills} />
          <Experience jobs={jobs} />
          <Certifications items={certs} />
          <Projects items={projects} />
          <Contact settings={settings} />
        </main>
        <Footer settings={settings} />
      </div>
    </div>
  );
}
