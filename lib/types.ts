export interface Job {
  id: string
  title: string
  description: string
  location: string
  country: string
  region: "europe" | "middle_east" | "asia"
  industry: "construction" | "food_production" | "health" | "engineering" | "warehousing"
  employment_type: "full_time" | "part_time" | "contract" | "temporary"
  salary_range: string | null
  requirements: string | null
  benefits: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  job_id: string
  name: string
  email: string
  phone: string
  right_to_work: string
  resume_url: string
  resume_filename: string
  cover_letter: string | null
  status: "new" | "reviewed" | "shortlisted" | "rejected" | "hired"
  admin_notes: string | null
  created_at: string
  updated_at: string
  job?: Job
}

export const REGIONS = {
  europe: "Europe",
  middle_east: "Middle East",
  asia: "Asia",
} as const

export const INDUSTRIES = {
  construction: "Construction",
  food_production: "Food Production",
  health: "Healthcare",
  engineering: "Engineering",
  warehousing: "Warehousing",
} as const

export const EMPLOYMENT_TYPES = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
  temporary: "Temporary",
} as const

export const APPLICATION_STATUSES = {
  new: "New",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired",
} as const
