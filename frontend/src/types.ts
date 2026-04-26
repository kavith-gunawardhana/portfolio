export interface SiteSettings {
  id: number;
  full_name: string;
  handle: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  website_url: string;
  resume_url: string;
  avatar_url: string;
  terminal_lines_json: string;
  focus_areas_json: string;
  primary_color: string;
  accent_color: string;
}

export interface Skill {
  id: number;
  category_id: number;
  name: string;
  level: number;
  icon: string;
  sort_order: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  icon: string;
  sort_order: number;
  skills: Skill[];
}

export interface Promotion {
  id: number;
  job_id: number;
  title: string;
  start_date: string;
  description: string;
  sort_order: number;
}

export interface Job {
  id: number;
  company: string;
  title: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string;
  logo_url: string;
  sort_order: number;
  promotions: Promotion[];
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  issued_date: string | null;
  expires_date: string | null;
  credential_id: string;
  credential_url: string;
  image_url: string;
  description: string;
  sort_order: number;
}

export interface Project {
  id: number;
  title: string;
  summary: string;
  description: string;
  tags_json: string;
  repo_url: string;
  demo_url: string;
  image_url: string;
  featured: boolean;
  sort_order: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}
