export const APPLICATION_STATUSES = ["Applied", "Offer issued", "Visa applied", "Visa approved", "At embassy", "Visa stamped", "Arrived", "Rejected"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export type Role = "admin" | "secretary";
export type Agent = { id: number; name: string; country: string; contactName: string; phone: string; email: string; commissionPct: number; active: number };
export type Employer = { id: number; name: string; country: string; contactName: string; phone: string; email: string; active: number };
export type Candidate = { id: number; reference: string; name: string; phone: string; email: string; passportNumber: string; nationality: string; destinationCountry: string; jobTitle: string; status: ApplicationStatus; visaRequired: number; accommodation: number; food: number; arrivalDate: string | null; agentId: number | null; agentName: string | null; employerId: number | null; employerName: string | null; agreedAmount: number; incoming: number; outgoing: number; notes: string; createdAt: string; updatedAt: string };
export type Transaction = { id: number; candidateId: number; candidateName: string; reference: string; direction: "incoming" | "outgoing"; category: string; amount: number; paidAt: string; note: string; createdAt: string };
export type ActivityItem = { id: number; userEmail: string; userName: string; action: string; entityType: string; entityId: string; details: string; createdAt: string };
export type StaffMember = { id: string; email: string; name: string; role: Role; createdAt: string };
export type PortalData = { role: Role; currentUser: string; candidates: Candidate[]; agents: Agent[]; employers: Employer[]; transactions: Transaction[]; activity: ActivityItem[]; staff: StaffMember[] };

