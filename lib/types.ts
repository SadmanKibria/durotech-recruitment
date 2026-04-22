export interface Job {
  id: string
  title: string
  description: string
  location: string
  country: string
  region: "europe" | "middle_east" | "asia"
  industry: "construction" | "food_production" | "health" | "engineering" | "warehousing" | "garments"
  employment_type: "full_time" | "part_time" | "contract" | "temporary"
  salary_range: string | null
  currency: string
  positions_available: number
  company_name: string | null
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
  visa_required: string
  visa_status: string | null
  citizenship_country: string | null
  accommodation_required: string
  food_required: string
  reference_agent: string | null
  total_agreed_amount: number | null
  arrival_date: string | null
  assigned_company: string | null
  status_changed_at: string | null
  is_duplicate: boolean
  duplicate_application_ids: string[] | null
  resume_url: string
  resume_filename: string
  cover_letter: string | null
  status:
    | "applied"
    | "offer_issued"
    | "visa_applied"
    | "visa_approved"
    | "at_embassy"
    | "visa_stamped"
    | "arrived"
    | "rejected"
  admin_notes: string | null
  created_at: string
  updated_at: string
  job?: Job
}

export interface ApplicationNote {
  id: string
  application_id: string
  note_type: string
  content: string
  created_by: string
  created_at: string
}

export interface ApplicationPayment {
  id: string
  application_id: string
  payment_type: "incoming" | "outgoing"
  category: string
  amount: number
  currency: string
  description: string | null
  payment_date: string
  created_at: string
}

export interface Company {
  id: string
  name: string
  contact_person: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  commission_rate: number
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface SpeculativeCV {
  id: string
  name: string
  email: string
  phone: string
  preferred_region: string | null
  preferred_industry: string | null
  right_to_work: string
  resume_url: string
  resume_filename: string
  cover_letter: string | null
  status: "new" | "reviewed" | "contacted" | "archived"
  admin_notes: string | null
  created_at: string
  updated_at: string
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
  garments: "Garments",
} as const

export const EMPLOYMENT_TYPES = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
  temporary: "Temporary",
} as const

export const APPLICATION_STATUSES = {
  applied: "Applied",
  offer_issued: "Offer Issued",
  visa_applied: "Visa Applied",
  visa_approved: "Visa Approved",
  at_embassy: "At Embassy",
  visa_stamped: "Visa Stamped",
  arrived: "Arrived",
  rejected: "Rejected",
} as const

export const CV_STATUSES = {
  new: "New",
  reviewed: "Reviewed",
  contacted: "Contacted",
  archived: "Archived",
} as const

export const CURRENCIES = {
  GBP: "£ GBP",
  USD: "$ USD",
  EUR: "€ EUR",
  AED: "AED",
  SAR: "SAR",
  QAR: "QAR",
  BDT: "৳ BDT",
  INR: "₹ INR",
  PKR: "₨ PKR",
} as const

export const PAYMENT_CATEGORIES = {
  visa_fee: "Visa Fee",
  medical_fee: "Medical Fee",
  flight_ticket: "Flight Ticket",
  accommodation: "Accommodation",
  food_allowance: "Food Allowance",
  agency_fee: "Agency Fee",
  deposit: "Deposit",
  refund: "Refund",
  other: "Other",
} as const

export interface AdminUser {
  id: string
  user_id: string
  email: string
  name: string | null
  role: "superadmin" | "manager" | "admin"
  created_at: string
  updated_at: string
}

export type AdminRole = "superadmin" | "manager" | "admin"

export const ADMIN_PERMISSIONS = {
  superadmin: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    canManageAdmins: true,
    canAccessFinancials: true,
  },
  manager: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: false, // Cannot delete applicants or financial data
    canManageAdmins: false,
    canAccessFinancials: true,
  },
  admin: {
    canCreate: true,
    canRead: true,
    canUpdate: true, // Read and write only
    canDelete: false,
    canManageAdmins: false,
    canAccessFinancials: false,
  },
} as const
