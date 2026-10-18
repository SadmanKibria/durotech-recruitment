"use client";

import Image from "next/image";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleUserRound,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Printer,
  Search,
  Settings,
  Trash2,
  Users,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EmailCandidateButton } from "@/components/portal/email-candidate-button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  APPLICATION_STATUSES,
  type Agent,
  type ApplicationStatus,
  type Candidate,
  type Employer,
  type PortalData,
  type PortalJob,
} from "@/lib/portal/types";

type View =
  | "dashboard"
  | "candidates"
  | "jobs"
  | "agents"
  | "employers"
  | "finance"
  | "reports"
  | "activity"
  | "settings";
type Modal =
  | { type: "candidate"; item?: Candidate }
  | { type: "job"; item?: PortalJob }
  | { type: "agent"; item?: Agent }
  | { type: "employer"; item?: Employer }
  | { type: "transaction"; direction: "incoming" | "outgoing" }
  | null;
const EMPTY: PortalData = {
  role: "admin",
  currentUser: "Durotech Admin",
  candidates: [],
  jobs: [],
  agents: [],
  employers: [],
  transactions: [],
  activity: [],
  staff: [],
};
const statusStyle: Record<ApplicationStatus, string> = {
  Applied: "bg-slate-100 text-slate-700",
  "Offer issued": "bg-blue-50 text-blue-700",
  "Visa applied": "bg-violet-50 text-violet-700",
  "Visa approved": "bg-cyan-50 text-cyan-700",
  "At embassy": "bg-amber-50 text-amber-800",
  "Visa stamped": "bg-emerald-50 text-emerald-700",
  Arrived: "bg-teal-50 text-teal-700",
  Rejected: "bg-rose-50 text-rose-700",
};
const statusDot: Record<ApplicationStatus, string> = {
  Applied: "bg-slate-400",
  "Offer issued": "bg-blue-500",
  "Visa applied": "bg-violet-500",
  "Visa approved": "bg-cyan-500",
  "At embassy": "bg-amber-500",
  "Visa stamped": "bg-emerald-500",
  Arrived: "bg-teal-600",
  Rejected: "bg-rose-500",
};
const viewCopy: Record<View, [string, string]> = {
  dashboard: ["Dashboard", "What needs attention across your placements."],
  candidates: [
    "Candidates",
    "Manage agreements, placements and visa progress.",
  ],
  jobs: [
    "Job listings",
    "Publish, pause and manage every vacancy shown on the website.",
  ],
  agents: ["Agents", "Compare agent performance, profit and commission due."],
  employers: [
    "Employers",
    "Manage companies, placements and commercial performance.",
  ],
  finance: [
    "Candidate finance",
    "Review balances, payments and placement costs in one place.",
  ],
  reports: [
    "Business insights",
    "Explore trends, conversion, agent and employer performance.",
  ],
  activity: ["Activity log", "Filter and review every recorded staff action."],
  settings: [
    "Portal settings",
    "Staff permissions and the application workflow.",
  ],
};

export function Portal({ userName }: { userName: string }) {
  const [data, setData] = useState<PortalData>({
    ...EMPTY,
    currentUser: userName,
  });
  const [view, setView] = useState<View>("dashboard");
  const [modal, setModal] = useState<Modal>(null);
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/portal/data", { cache: "no-store" });
      const body = (await response.json()) as PortalData & { error?: string };
      if (!response.ok) throw new Error(body.error);
      setData(body);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not load records",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (tool: unknown) => unknown;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const run = async (input: unknown) => {
      const response = await fetch("/api/portal/data", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error);
      await refresh();
      return { success: true };
    };
    try {
      context.registerTool(
        {
          name: "create_candidate",
          title: "Create candidate",
          description:
            "Create a candidate placement record in the Durotech portal.",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string" },
              phone: { type: "string" },
              nationality: { type: "string" },
              destinationCountry: { type: "string" },
              jobTitle: { type: "string" },
              agreedAmount: { type: "number" },
            },
            required: [
              "name",
              "nationality",
              "destinationCountry",
              "jobTitle",
              "agreedAmount",
            ],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute: (input: Record<string, unknown>) =>
            run({ action: "save_candidate", status: "Applied", ...input }),
        },
      );
      context.registerTool(
        {
          name: "update_candidate_status",
          title: "Update candidate status",
          description:
            "Move an existing candidate to one of Durotech's application stages.",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "integer" },
              status: { type: "string", enum: APPLICATION_STATUSES },
            },
            required: ["id", "status"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute: (input: Record<string, unknown>) =>
            run({ action: "update_status", ...input }),
        },
      );
      context.registerTool(
        {
          name: "record_candidate_transaction",
          title: "Record candidate transaction",
          description:
            "Record an incoming candidate payment or outgoing placement expense in GBP.",
          inputSchema: {
            type: "object",
            properties: {
              candidateId: { type: "integer" },
              direction: { type: "string", enum: ["incoming", "outgoing"] },
              category: { type: "string" },
              amount: { type: "number" },
              paidAt: { type: "string" },
              note: { type: "string" },
            },
            required: [
              "candidateId",
              "direction",
              "category",
              "amount",
              "paidAt",
            ],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute: (input: Record<string, unknown>) =>
            run({ action: "add_transaction", ...input }),
        },
      );
    } catch {}
  }, [refresh]);
  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.candidates.filter((c) =>
      `${c.name} ${c.reference} ${c.email} ${c.phone} ${c.passportNumber} ${c.nationality} ${c.destinationCountry} ${c.jobTitle} ${c.agentName} ${c.employerName}`
        .toLowerCase()
        .includes(q),
    );
  }, [data.candidates, query]);
  const updateSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) setView("candidates");
  };
  const goTo = (next: View) => {
    setView(next);
    setMobile(false);
  };
  const incoming = data.transactions
      .filter((t) => t.direction === "incoming")
      .reduce((s, t) => s + t.amount, 0),
    outgoing = data.transactions
      .filter((t) => t.direction === "outgoing")
      .reduce((s, t) => s + t.amount, 0),
    agreed = data.candidates.reduce((s, c) => s + c.agreedAmount, 0),
    outstanding = Math.max(0, agreed - incoming);
  const openModalForView = () =>
    setModal(
      view === "agents"
        ? { type: "agent" }
        : view === "employers"
          ? { type: "employer" }
          : view === "finance"
            ? { type: "transaction", direction: "incoming" }
            : { type: "candidate" },
    );
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#172033]">
      <Toaster position="top-right" />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-[#091b3a] text-white shadow-2xl transition-transform lg:translate-x-0 ${mobile ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-[82px] items-center gap-3 border-b border-white/10 px-5">
          <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#ffd35a] p-1.5">
            <Image
              src="/durotech-logo.png"
              alt="Durotech Group"
              width={48}
              height={48}
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <p className="font-semibold leading-tight">Durotech Group</p>
            <p className="mt-1 text-[11px] uppercase tracking-[.14em] text-blue-100/60">
              Operations portal
            </p>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setMobile(false)}
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4 text-[15px]">
          <Nav
            view="dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            current={view}
            go={goTo}
          />
          <Nav
            view="candidates"
            icon={Users}
            label="Candidates"
            count={String(data.candidates.length)}
            current={view}
            go={goTo}
          />
          <Nav
            view="jobs"
            icon={BriefcaseBusiness}
            label="Job listings"
            count={String(data.jobs.filter((job) => job.active).length)}
            current={view}
            go={goTo}
          />
          <Nav
            view="agents"
            icon={UsersRound}
            label="Agents"
            current={view}
            go={goTo}
          />
          <Nav
            view="employers"
            icon={Building2}
            label="Employers"
            current={view}
            go={goTo}
          />
          <Nav
            view="finance"
            icon={WalletCards}
            label="Finance"
            current={view}
            go={goTo}
          />
          <Nav
            view="reports"
            icon={FileText}
            label="Reports"
            current={view}
            go={goTo}
          />
          <Nav
            view="activity"
            icon={Activity}
            label="Activity log"
            current={view}
            go={goTo}
          />
        </nav>
        <div className="border-t border-white/10 p-4">
          <Nav
            view="settings"
            icon={Settings}
            label="Settings"
            current={view}
            go={goTo}
          />
        </div>
      </aside>
      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-4 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7">
          <button
            className="lg:hidden"
            onClick={() => setMobile(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => updateSearch(e.target.value)}
              className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
              placeholder="Search name, reference, email, phone or passport"
            />
          </div>
          <div className="ml-auto flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{data.currentUser}</p>
              <p className="text-xs capitalize text-slate-500">{data.role}</p>
            </div>
            <div className="grid size-10 place-items-center rounded-full bg-[#fff4cf] text-[#0d1974]">
              <CircleUserRound className="size-5" />
            </div>
            <form action="/api/portal/auth/logout" method="post">
              <button
                className="grid size-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto max-w-[1480px] p-4 sm:p-7 lg:p-8">
          <div className="relative mb-5 sm:hidden">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => updateSearch(e.target.value)}
              className="h-11 rounded-xl bg-white pl-9"
              placeholder="Search candidates"
            />
          </div>
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-sm font-semibold text-[#0d1974]">
                Durotech Group operations
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-[30px]">
                {viewCopy[view][0]}
              </h1>
              <p className="mt-1 text-[15px] text-slate-500">
                {viewCopy[view][1]}
              </p>
            </div>
            <div className="flex gap-2">
              {view === "reports" && (
                <Button
                  variant="outline"
                  className="h-11 gap-2 rounded-xl"
                  onClick={() => window.print()}
                >
                  <Printer className="size-4" />
                  Print report
                </Button>
              )}
              {[
                "candidates",
                "jobs",
                "agents",
                "employers",
                "finance",
                "dashboard",
              ].includes(view) && (
                <Button
                  className="h-11 gap-2 rounded-xl bg-[#0d1974] px-5 hover:bg-[#17258d]"
                  onClick={
                    view === "jobs"
                      ? () => setModal({ type: "job" })
                      : openModalForView
                  }
                >
                  <Plus className="size-4" />
                  {view === "jobs"
                    ? "Add job"
                    : view === "agents"
                      ? "Add agent"
                      : view === "employers"
                        ? "Add employer"
                        : view === "finance"
                          ? "Record payment"
                          : "Add candidate"}
                </Button>
              )}
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <>
              {view === "dashboard" && (
                <Dashboard
                  data={data}
                  incoming={incoming}
                  outgoing={outgoing}
                  outstanding={outstanding}
                  openCandidate={() => setModal({ type: "candidate" })}
                  go={setView}
                />
              )}{" "}
              {view === "candidates" && (
                <Candidates
                  data={data}
                  rows={searched}
                  edit={(item) => setModal({ type: "candidate", item })}
                  refresh={refresh}
                />
              )}{" "}
              {view === "jobs" && (
                <Jobs
                  data={data}
                  edit={(item) => setModal({ type: "job", item })}
                  refresh={refresh}
                />
              )}{" "}
              {view === "agents" && (
                <Agents
                  data={data}
                  edit={(item) => setModal({ type: "agent", item })}
                />
              )}{" "}
              {view === "employers" && (
                <Employers
                  data={data}
                  edit={(item) => setModal({ type: "employer", item })}
                />
              )}{" "}
              {view === "finance" && (
                <Finance
                  data={data}
                  open={(direction) =>
                    setModal({ type: "transaction", direction })
                  }
                />
              )}{" "}
              {view === "reports" && <ReportDashboard data={data} />}{" "}
              {view === "activity" && <ActivityLog data={data} />}{" "}
              {view === "settings" && <PortalSettings data={data} />}
            </>
          )}
        </main>
      </div>
      <RecordDialog
        modal={modal}
        close={() => setModal(null)}
        data={data}
        refresh={refresh}
      />
      {mobile && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden"
          onClick={() => setMobile(false)}
          aria-label="Close navigation overlay"
        />
      )}
    </div>
  );
}

function Nav({
  view,
  icon: Icon,
  label,
  count,
  current,
  go,
}: {
  view: View;
  icon: typeof Users;
  label: string;
  count?: string;
  current: View;
  go: (v: View) => void;
}) {
  const active = view === current;
  return (
    <button
      onClick={() => go(view)}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active ? "bg-white/12 font-semibold text-white" : "text-blue-100/72 hover:bg-white/7 hover:text-white"}`}
    >
      <Icon className="size-[18px]" />
      <span>{label}</span>
      {count && (
        <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs">
          {count}
        </span>
      )}
    </button>
  );
}
function Loading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 rounded-2xl" />
      ))}
    </div>
  );
}
function money(pence: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(pence / 100);
}
function initials(name: string) {
  return name
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
function date(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(
    new Date(value.includes("T") ? value : value.replace(" ", "T") + "Z"),
  );
}
function Metric({
  label,
  value,
  note,
  icon: Icon,
  tone = "teal",
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Users;
  tone?: "teal" | "amber" | "rose";
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <span
          className={`grid size-10 place-items-center rounded-xl ${tone === "amber" ? "bg-amber-50 text-amber-600" : tone === "rose" ? "bg-rose-50 text-rose-600" : "bg-[#fff4cf] text-[#0d1974]"}`}
        >
          <Icon className="size-[19px]" />
        </span>
      </div>
      <p className="mt-4 text-xs text-slate-500">{note}</p>
    </div>
  );
}
function Dashboard({
  data,
  incoming,
  outgoing,
  outstanding,
  go,
}: {
  data: PortalData;
  incoming: number;
  outgoing: number;
  outstanding: number;
  openCandidate: () => void;
  go: (v: View) => void;
}) {
  const active = data.candidates.filter(
    (c) => !(["Arrived", "Rejected"] as string[]).includes(c.status),
  ).length;
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Active candidates"
          value={String(active)}
          note={`${data.candidates.length} total records`}
          icon={Users}
        />
        <Metric
          label="Awaiting action"
          value={String(
            data.candidates.filter((c) =>
              ["At embassy", "Visa approved"].includes(c.status),
            ).length,
          )}
          note="Visa or embassy follow-up"
          icon={CalendarDays}
          tone="amber"
        />
        <Metric
          label="Total received"
          value={money(incoming)}
          note={`${data.transactions.filter((t) => t.direction === "incoming").length} payments`}
          icon={ArrowDownLeft}
        />
        <Metric
          label="Outstanding"
          value={money(outstanding)}
          note="Against agreed candidate fees"
          icon={ArrowUpRight}
          tone="rose"
        />
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div className="rounded-2xl border bg-white">
          <PanelHead
            title="Application pipeline"
            sub={`${data.candidates.length} candidates across all stages`}
            action={() => go("candidates")}
          />
          <div className="grid gap-x-7 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
            {APPLICATION_STATUSES.map((s) => {
              const count = data.candidates.filter(
                (c) => c.status === s,
              ).length;
              return (
                <div key={s}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span className={`size-2 rounded-full ${statusDot[s]}`} />
                      {s}
                    </span>
                    <b>{count}</b>
                  </div>
                  <Progress
                    value={
                      data.candidates.length
                        ? (count / data.candidates.length) * 100
                        : 0
                    }
                    className="h-1.5 bg-slate-100"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl bg-[#10284d] p-6 text-white shadow-[0_12px_32px_rgba(16,40,77,.16)]">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-blue-100/70">Financial position</p>
              <h2 className="mt-2 text-3xl font-semibold">
                {money(incoming - outgoing)}
              </h2>
              <p className="mt-1 text-sm text-blue-100/70">Net cash recorded</p>
            </div>
            <span className="h-fit rounded-full bg-white/10 px-3 py-1 text-xs">
              GBP
            </span>
          </div>
          <div className="my-6 h-px bg-white/10" />
          <div className="space-y-4">
            <FinanceLine
              label="Candidate payments"
              amount={money(incoming)}
              good
            />
            <FinanceLine
              label="Visa & placement costs"
              amount={money(outgoing)}
            />
            <FinanceLine
              label="Agent commission accrued"
              amount={money(
                data.candidates.reduce(
                  (s, c) =>
                    s +
                    c.agreedAmount *
                      ((data.agents.find((a) => a.id === c.agentId)
                        ?.commissionPct ?? 0) /
                        100),
                  0,
                ),
              )}
            />
          </div>
          <button
            onClick={() => go("finance")}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-medium hover:bg-white/15"
          >
            Open finance overview <ArrowUpRight className="size-4" />
          </button>
        </div>
      </section>
      <section className="mt-5 overflow-hidden rounded-2xl border bg-white">
        <PanelHead
          title="Recently updated candidates"
          sub="Latest changes made by your team"
          action={() => go("candidates")}
        />
        <CandidateTable
          data={data}
          rows={data.candidates.slice(0, 5)}
          compact
        />
      </section>
    </>
  );
}
function PanelHead({
  title,
  sub,
  action,
}: {
  title: string;
  sub: string;
  action?: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500">{sub}</p>
      </div>
      {action && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={action}
        >
          View all
        </Button>
      )}
    </div>
  );
}
function FinanceLine({
  label,
  amount,
  good,
}: {
  label: string;
  amount: string;
  good?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-blue-100/75">{label}</span>
      <b className={`text-sm ${good ? "text-[#62d3c9]" : "text-white"}`}>
        {amount}
      </b>
    </div>
  );
}
function Candidates({
  data,
  rows,
  edit,
  refresh,
}: {
  data: PortalData;
  rows: Candidate[];
  edit: (c: Candidate) => void;
  refresh: () => Promise<void>;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white">
      <PanelHead
        title="Candidate records"
        sub={`${rows.length} shown · status can be updated directly`}
      />
      <CandidateTable data={data} rows={rows} edit={edit} refresh={refresh} />
    </section>
  );
}
function Jobs({
  data,
  edit,
  refresh,
}: {
  data: PortalData;
  edit: (job: PortalJob) => void;
  refresh: () => Promise<void>;
}) {
  const [filter, setFilter] = useState("all"),
    [search, setSearch] = useState("");
  const jobs = data.jobs.filter(
    (job) =>
      (filter === "all" || (filter === "live" ? job.active : !job.active)) &&
      `${job.title} ${job.companyName} ${job.location} ${job.country}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const act = async (body: unknown) => {
    const response = await fetch("/api/portal/data", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok)
      return toast.error(result.error || "Job could not be updated");
    toast.success("Job listing updated");
    await refresh();
  };
  return (
    <section className="overflow-hidden rounded-2xl border bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-semibold">Website job listings</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {data.jobs.filter((job) => job.active).length} live ·{" "}
            {data.jobs.length} total · no artificial listing cap
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 rounded-xl pl-9 sm:w-64"
              placeholder="Search jobs"
            />
          </div>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-10 rounded-xl border bg-white px-3 text-sm"
          >
            <option value="all">All listings</option>
            <option value="live">Live only</option>
            <option value="paused">Paused only</option>
          </select>
        </div>
      </div>
      <div className="grid gap-3 p-4 sm:p-6">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="grid gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-[#0d1974]/25 hover:shadow-sm md:grid-cols-[1fr_auto] md:items-center"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{job.title}</h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${job.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                >
                  {job.active ? "Live" : "Paused"}
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {job.positionsAvailable}{" "}
                  {job.positionsAvailable === 1 ? "position" : "positions"}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {job.companyName || "Durotech client"} · {job.location},{" "}
                {job.country}
              </p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                {job.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() =>
                  void act({
                    action: "toggle_job",
                    id: job.id,
                    active: !job.active,
                  })
                }
              >
                {job.active ? "Pause" : "Publish"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => edit(job)}
              >
                <Pencil className="size-4" />
                Edit
              </Button>
              {data.role === "admin" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  aria-label={`Delete ${job.title}`}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete ${job.title}? This cannot be undone.`,
                      )
                    )
                      void act({ action: "delete_job", id: job.id });
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          </article>
        ))}
        {!jobs.length && (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <BriefcaseBusiness className="mx-auto size-9 text-slate-300" />
            <p className="mt-3 font-semibold">No matching jobs</p>
            <p className="mt-1 text-sm text-slate-500">
              Create a listing or change the current filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
function CandidateTable({
  data,
  rows,
  edit,
  refresh,
  compact,
}: {
  data: PortalData;
  rows: Candidate[];
  edit?: (c: Candidate) => void;
  refresh?: () => Promise<void>;
  compact?: boolean;
}) {
  const act = async (body: unknown) => {
    const r = await fetch("/api/portal/data", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
      j = (await r.json()) as { error?: string };
    if (!r.ok) throw new Error(j.error);
    toast.success("Record updated");
    await refresh?.();
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-3">Candidate</th>
            <th className="px-5 py-3">Placement</th>
            <th className="px-5 py-3">Agent / employer</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Balance</th>
            {!compact && <th className="w-12 px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/70">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-[#edf5ff] text-xs font-bold text-[#285b92]">
                    {initials(c.name)}
                  </span>
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-slate-500">
                      {c.reference} · {c.nationality}
                      {c.passportNumber ? ` · ${c.passportNumber}` : ""}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <p className="font-medium">{c.jobTitle}</p>
                <p className="text-xs text-slate-500">{c.destinationCountry}</p>
              </td>
              <td className="px-5 py-4">
                <p>{c.agentName ?? "No agent"}</p>
                <p className="text-xs text-slate-500">
                  {c.employerName ?? "No employer"}
                </p>
              </td>
              <td className="px-5 py-4">
                {compact ? (
                  <Status status={c.status} />
                ) : (
                  <Select
                    value={c.status}
                    onValueChange={(value) =>
                      act({
                        action: "update_status",
                        id: c.id,
                        status: value,
                      }).catch((e) => toast.error(e.message))
                    }
                  >
                    <SelectTrigger
                      className={`h-8 w-[145px] border-0 shadow-none ${statusStyle[c.status]}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </td>
              <td className="px-5 py-4">
                <p className="font-semibold">
                  {money(Math.max(0, c.agreedAmount - c.incoming))}
                </p>
                <p className="text-xs text-slate-500">
                  of {money(c.agreedAmount)}
                </p>
              </td>
              {!compact && (
                <td className="px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${c.name}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {c.email && (
                        <div className="px-2 py-1">
                          <EmailCandidateButton candidate={c} />
                        </div>
                      )}
                      <DropdownMenuItem onClick={() => edit?.(c)}>
                        <Pencil />
                        Edit record
                      </DropdownMenuItem>
                      {data.role === "admin" && (
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            confirm(`Delete ${c.name}?`) &&
                            act({ action: "delete_candidate", id: c.id }).catch(
                              (e) => toast.error(e.message),
                            )
                          }
                        >
                          <Trash2 />
                          Delete record
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="p-10 text-center text-sm text-slate-500">
          No matching candidates.
        </p>
      )}
    </div>
  );
}
function Status({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[status]}`}
    >
      {status}
    </span>
  );
}
function Agents({
  data,
  edit,
}: {
  data: PortalData;
  edit: (a: Agent) => void;
}) {
  const [search, setSearch] = useState("");
  const agents = data.agents.filter((agent) =>
    `${agent.name} ${agent.country} ${agent.contactName} ${agent.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl text-sm text-blue-900">
          Performance combines candidate volume, arrival outcomes, cash
          received, placement costs and accrued commission.
        </p>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-10 bg-white sm:w-64"
          placeholder="Search agents"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => {
          const rows = data.candidates.filter((c) => c.agentId === a.id),
            received = rows.reduce((s, c) => s + c.incoming, 0),
            expenses = rows.reduce((s, c) => s + c.outgoing, 0),
            commission = rows.reduce(
              (s, c) => s + (c.agreedAmount * a.commissionPct) / 100,
              0,
            ),
            profit = received - expenses - commission,
            arrived = rows.filter((c) => c.status === "Arrived").length,
            active = rows.filter(
              (c) => !["Arrived", "Rejected"].includes(c.status),
            ).length,
            rate = rows.length ? Math.round((arrived / rows.length) * 100) : 0;
          return (
            <article
              key={a.id}
              className="rounded-2xl border bg-white p-5 shadow-[0_8px_30px_rgba(15,35,70,.04)]"
            >
              <div className="flex justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-[#fff4cf] font-bold text-[#0d1974]">
                  {initials(a.name)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => edit(a)}
                  aria-label={`Edit ${a.name}`}
                >
                  <Pencil className="size-4" />
                </Button>
              </div>
              <h2 className="mt-4 font-semibold">{a.name}</h2>
              <p className="text-sm text-slate-500">
                {a.country} · {a.contactName || "No contact set"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                  {active} active
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {arrived} arrived
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                  {rate}% arrival rate
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                <div>
                  <b>{money(received)}</b>
                  <p className="text-xs text-slate-500">Cash received</p>
                </div>
                <div>
                  <b>{money(expenses)}</b>
                  <p className="text-xs text-slate-500">Placement costs</p>
                </div>
                <div>
                  <b
                    className={
                      profit < 0 ? "text-rose-600" : "text-emerald-700"
                    }
                  >
                    {money(profit)}
                  </b>
                  <p className="text-xs text-slate-500">Net contribution</p>
                </div>
                <div>
                  <b className="text-amber-700">{money(commission)}</b>
                  <p className="text-xs text-slate-500">Commission due</p>
                </div>
              </div>
              {(a.email || a.phone) && (
                <div className="mt-4 flex flex-wrap gap-3 border-t pt-4 text-xs">
                  <a
                    href={`mailto:${a.email}`}
                    className="font-semibold text-[#0d1974] hover:underline"
                  >
                    {a.email || "Add email"}
                  </a>
                  {a.phone && (
                    <a
                      href={`tel:${a.phone}`}
                      className="text-slate-500 hover:text-[#0d1974]"
                    >
                      {a.phone}
                    </a>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
function Employers({
  data,
  edit,
}: {
  data: PortalData;
  edit: (e: Employer) => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border bg-white">
      <PanelHead
        title="Employer performance"
        sub={`${data.employers.length} employer relationships · placements, outcomes and value`}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-3">Employer</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Candidates</th>
              <th className="px-5 py-3">Arrived</th>
              <th className="px-5 py-3">Active pipeline</th>
              <th className="px-5 py-3">Agreed value</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.employers.map((e) => {
              const rows = data.candidates.filter((c) => c.employerId === e.id);
              return (
                <tr key={e.id}>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{e.name}</p>
                    <p className="text-xs text-slate-500">{e.country}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p>{e.contactName || "No contact set"}</p>
                    <p className="text-xs text-slate-500">{e.phone}</p>
                    {e.email && (
                      <a
                        href={`mailto:${e.email}`}
                        className="text-xs text-[#0d1974] hover:underline"
                      >
                        {e.email}
                      </a>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold">{rows.length}</td>
                  <td className="px-5 py-4 text-emerald-700">
                    {rows.filter((c) => c.status === "Arrived").length}
                  </td>
                  <td className="px-5 py-4">
                    {
                      rows.filter(
                        (c) => !["Arrived", "Rejected"].includes(c.status),
                      ).length
                    }
                  </td>
                  <td className="px-5 py-4 font-semibold">
                    {money(rows.reduce((sum, c) => sum + c.agreedAmount, 0))}
                  </td>
                  <td className="px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => edit(e)}
                      aria-label={`Edit ${e.name}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
function Finance({
  data,
  open,
}: {
  data: PortalData;
  open: (d: "incoming" | "outgoing") => void;
}) {
  const [search, setSearch] = useState(""),
    [selectedId, setSelectedId] = useState<number | null>(
      data.candidates[0]?.id ?? null,
    );
  const matches = data.candidates.filter((c) =>
      `${c.name} ${c.reference} ${c.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    ),
    candidate = data.candidates.find((c) => c.id === selectedId) ?? matches[0],
    ledger = candidate
      ? data.transactions.filter((t) => t.candidateId === candidate.id)
      : [],
    received = ledger
      .filter((t) => t.direction === "incoming")
      .reduce((s, t) => s + t.amount, 0),
    spent = ledger
      .filter((t) => t.direction === "outgoing")
      .reduce((s, t) => s + t.amount, 0),
    allReceived = data.transactions
      .filter((t) => t.direction === "incoming")
      .reduce((s, t) => s + t.amount, 0),
    allSpent = data.transactions
      .filter((t) => t.direction === "outgoing")
      .reduce((s, t) => s + t.amount, 0),
    allAgreed = data.candidates.reduce((s, c) => s + c.agreedAmount, 0);
  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total agreed"
          value={money(allAgreed)}
          note={`${data.candidates.length} candidate agreements`}
          icon={FileText}
        />
        <Metric
          label="Payments received"
          value={money(allReceived)}
          note={`${data.transactions.filter((t) => t.direction === "incoming").length} incoming records`}
          icon={ArrowDownLeft}
        />
        <Metric
          label="Placement costs"
          value={money(allSpent)}
          note={`${data.transactions.filter((t) => t.direction === "outgoing").length} outgoing records`}
          icon={ArrowUpRight}
          tone="amber"
        />
        <Metric
          label="Net cash"
          value={money(allReceived - allSpent)}
          note={`${allAgreed ? Math.round((allReceived / allAgreed) * 100) : 0}% of agreed fees collected`}
          icon={WalletCards}
        />
      </section>
      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <aside className="self-start rounded-2xl border bg-white p-4">
          <Label htmlFor="finance-search">Find candidate</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="finance-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              placeholder="Name, reference or email"
            />
          </div>
          <div className="mt-3 max-h-[580px] space-y-1 overflow-y-auto">
            {matches.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full rounded-xl p-3 text-left transition ${candidate?.id === c.id ? "bg-[#fff4cf] ring-1 ring-[#0d1974]/20" : "hover:bg-slate-50"}`}
              >
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {c.reference} ·{" "}
                  {money(Math.max(0, c.agreedAmount - c.incoming))} due
                </p>
              </button>
            ))}
            {!matches.length && (
              <p className="py-8 text-center text-sm text-slate-500">
                No candidate found.
              </p>
            )}
          </div>
        </aside>
        {candidate ? (
          <div>
            <section className="rounded-2xl border bg-white p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-semibold text-[#0d1974]">
                    {candidate.reference}
                  </p>
                  <h2 className="mt-1 text-xl font-bold">{candidate.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {candidate.jobTitle} · {candidate.destinationCountry} ·{" "}
                    {candidate.agentName ?? "No agent"}
                  </p>
                </div>
                <Status status={candidate.status} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ReportNumber
                  label="Agreed fee"
                  value={money(candidate.agreedAmount)}
                />
                <ReportNumber label="Received" value={money(received)} />
                <ReportNumber label="Expenses" value={money(spent)} />
                <ReportNumber
                  label="Balance due"
                  value={money(Math.max(0, candidate.agreedAmount - received))}
                />
              </div>
              <Progress
                value={
                  candidate.agreedAmount
                    ? Math.min(100, (received / candidate.agreedAmount) * 100)
                    : 0
                }
                className="mt-5 h-2"
              />
              <p className="mt-2 text-xs text-slate-500">
                {candidate.agreedAmount
                  ? Math.round((received / candidate.agreedAmount) * 100)
                  : 0}
                % collected
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  onClick={() => open("incoming")}
                  className="bg-[#0d1974]"
                >
                  <ArrowDownLeft />
                  Record payment
                </Button>
                <Button onClick={() => open("outgoing")} variant="outline">
                  <ArrowUpRight />
                  Record expense
                </Button>
                {candidate.email && (
                  <EmailCandidateButton candidate={candidate} />
                )}
              </div>
            </section>
            <section className="mt-5 overflow-hidden rounded-2xl border bg-white">
              <PanelHead
                title={`${candidate.name} — payment history`}
                sub={`${ledger.length} transactions · all amounts in GBP`}
              />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Category & note</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ledger.map((t) => (
                      <tr key={t.id}>
                        <td className="px-6 py-4">{date(t.paidAt)}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${t.direction === "incoming" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                          >
                            {t.direction === "incoming"
                              ? "Incoming"
                              : "Outgoing"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {t.category}
                          <p className="text-xs text-slate-500">{t.note}</p>
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-semibold ${t.direction === "incoming" ? "text-emerald-700" : "text-rose-700"}`}
                        >
                          {t.direction === "incoming" ? "+" : "−"}
                          {money(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!ledger.length && (
                  <p className="p-10 text-center text-sm text-slate-500">
                    No payments or expenses recorded for this candidate.
                  </p>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">
            Select a candidate to view their finances.
          </div>
        )}
      </div>
    </div>
  );
}
function ReportDashboard({ data }: { data: PortalData }) {
  const currentYear = String(new Date().getFullYear());
  const years = Array.from(
    new Set([
      currentYear,
      ...data.candidates.map((c) => c.createdAt.slice(0, 4)),
      ...data.transactions.map((t) => t.paidAt.slice(0, 4)),
    ]),
  )
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a));
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [employerFilter, setEmployerFilter] = useState("all");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const inPeriod = (value: string) =>
    (year === "all" || value.slice(0, 4) === year) &&
    (month === "all" || value.slice(5, 7) === month);
  const candidates = data.candidates.filter(
    (c) =>
      inPeriod(c.createdAt) &&
      (agentFilter === "all" || String(c.agentId) === agentFilter) &&
      (employerFilter === "all" || String(c.employerId) === employerFilter),
  );
  const candidateIds = new Set(candidates.map((c) => c.id));
  const transactions = data.transactions.filter(
    (t) => candidateIds.has(t.candidateId) && inPeriod(t.paidAt),
  );
  const total = candidates.length;
  const statusData = APPLICATION_STATUSES.map((name, i) => ({
    name,
    value: candidates.filter((c) => c.status === name).length,
    fill: [
      "#94a3b8",
      "#3b82f6",
      "#8b5cf6",
      "#06b6d4",
      "#f59e0b",
      "#10b981",
      "#0f766e",
      "#f43f5e",
    ][i],
  }));
  const agentData = data.agents
    .map((agent) => {
      const rows = candidates.filter((c) => c.agentId === agent.id);
      const ids = new Set(rows.map((c) => c.id));
      const received = transactions
        .filter((t) => ids.has(t.candidateId) && t.direction === "incoming")
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = transactions
        .filter((t) => ids.has(t.candidateId) && t.direction === "outgoing")
        .reduce((sum, t) => sum + t.amount, 0);
      const commission = rows.reduce(
        (sum, c) => sum + (c.agreedAmount * agent.commissionPct) / 100,
        0,
      );
      const arrived = rows.filter((c) => c.status === "Arrived").length;
      return {
        name: agent.name,
        candidates: rows.length,
        arrived,
        rejected: rows.filter((c) => c.status === "Rejected").length,
        arrivalRate: rows.length
          ? Math.round((arrived / rows.length) * 100)
          : 0,
        commission,
        profit: received - expenses - commission,
      };
    })
    .sort(
      (a, b) => b.arrivalRate - a.arrivalRate || b.candidates - a.candidates,
    );
  const progressStatuses = statusData.filter(
    (s) => !["Arrived", "Rejected"].includes(s.name),
  );
  const bottleneck = [...progressStatuses].sort((a, b) => b.value - a.value)[0];
  const topAgent = agentData.find((a) => a.candidates > 0);
  const approval = candidates.filter((c) =>
    ["Visa approved", "At embassy", "Visa stamped", "Arrived"].includes(
      c.status,
    ),
  ).length;
  const arrived = candidates.filter((c) => c.status === "Arrived").length;
  const rejected = candidates.filter((c) => c.status === "Rejected").length;
  const agreed = candidates.reduce((sum, c) => sum + c.agreedAmount, 0);
  const received = transactions
    .filter((t) => t.direction === "incoming")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.direction === "outgoing")
    .reduce((sum, t) => sum + t.amount, 0);
  const collectionRate = agreed ? Math.round((received / agreed) * 100) : 0;
  const trendData = months.map((name, index) => {
    const key = String(index + 1).padStart(2, "0"),
      rows = data.candidates.filter(
        (c) =>
          (year === "all" || c.createdAt.slice(0, 4) === year) &&
          c.createdAt.slice(5, 7) === key &&
          (agentFilter === "all" || String(c.agentId) === agentFilter) &&
          (employerFilter === "all" || String(c.employerId) === employerFilter),
      );
    return {
      name: name.slice(0, 3),
      applications: rows.length,
      arrivals: rows.filter((c) => c.status === "Arrived").length,
    };
  });
  const employerData = data.employers
    .map((employer) => {
      const rows = candidates.filter((c) => c.employerId === employer.id),
        ids = new Set(rows.map((c) => c.id)),
        cash = transactions
          .filter((t) => ids.has(t.candidateId) && t.direction === "incoming")
          .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: employer.name,
        country: employer.country,
        candidates: rows.length,
        arrived: rows.filter((c) => c.status === "Arrived").length,
        active: rows.filter((c) => !["Arrived", "Rejected"].includes(c.status))
          .length,
        agreed: rows.reduce((sum, c) => sum + c.agreedAmount, 0),
        cash,
      };
    })
    .filter((row) => row.candidates > 0)
    .sort((a, b) => b.candidates - a.candidates);
  const periodLabel = `${month === "all" ? "All months" : months[Number(month) - 1]} · ${year === "all" ? "All years" : year}`;
  return (
    <div className="print-area space-y-5">
      <section className="rounded-2xl border bg-white p-6 sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-5 border-b pb-6 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold text-[#0d1974]">
              DUROTECH GROUP
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Business performance report
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {periodLabel} · generated {date(new Date().toISOString())}
            </p>
          </div>
          <div className="grid gap-2 print:hidden sm:grid-cols-2">
            <select
              aria-label="Report year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-10 rounded-xl border bg-white px-3 text-sm"
            >
              <option value="all">All years</option>
              {years.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <select
              aria-label="Report month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-10 rounded-xl border bg-white px-3 text-sm"
            >
              <option value="all">All months</option>
              {months.map((name, index) => (
                <option key={name} value={String(index + 1).padStart(2, "0")}>
                  {name}
                </option>
              ))}
            </select>
            <select
              aria-label="Report agent"
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="h-10 rounded-xl border bg-white px-3 text-sm"
            >
              <option value="all">All agents</option>
              {data.agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Report employer"
              value={employerFilter}
              onChange={(e) => setEmployerFilter(e.target.value)}
              className="h-10 rounded-xl border bg-white px-3 text-sm"
            >
              <option value="all">All employers</option>
              {data.employers.map((employer) => (
                <option key={employer.id} value={employer.id}>
                  {employer.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportNumber
            label="Active applications"
            value={String(
              candidates.filter(
                (c) =>
                  !(["Arrived", "Rejected"] as string[]).includes(c.status),
              ).length,
            )}
          />
          <ReportNumber
            label="Visa progress rate"
            value={`${total ? Math.round((approval / total) * 100) : 0}%`}
          />
          <ReportNumber
            label="Arrival rate"
            value={`${total ? Math.round((arrived / total) * 100) : 0}%`}
          />
          <ReportNumber label="Collection rate" value={`${collectionRate}%`} />
        </div>
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 sm:p-6">
          <h3 className="font-semibold">Application status</h3>
          <p className="mb-3 text-sm text-slate-500">
            Applications opened in the selected period
          </p>
          <ChartContainer
            config={{
              applications: { label: "Applications", color: "#0d1974" },
            }}
            className="h-[300px] w-full"
          >
            <BarChart
              data={statusData}
              margin={{ left: 0, right: 10, top: 10, bottom: 55 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                interval={0}
                height={70}
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" name="Applications" radius={[6, 6, 0, 0]}>
                {statusData.map((s) => (
                  <Cell key={s.name} fill={s.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
        <div className="rounded-2xl border bg-white p-5 sm:p-6">
          <h3 className="font-semibold">Agent profit contribution</h3>
          <p className="mb-3 text-sm text-slate-500">
            Period payments minus expenses and accrued commission
          </p>
          <ChartContainer
            config={{ profit: { label: "Profit", color: "#0d1974" } }}
            className="h-[300px] w-full"
          >
            <BarChart
              data={agentData}
              layout="vertical"
              margin={{ left: 25, right: 20 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) =>
                  `£${Math.round(Number(value) / 100000)}k`
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                width={105}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => money(Number(value))}
                  />
                }
              />
              <Bar
                dataKey="profit"
                fill="var(--color-profit)"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </section>
      <section className="rounded-2xl border bg-white p-5 sm:p-6">
        <h3 className="font-semibold">Monthly application trend</h3>
        <p className="mb-3 text-sm text-slate-500">
          New applications and arrivals across the selected year
        </p>
        <ChartContainer
          config={{
            applications: { label: "Applications", color: "#0d1974" },
            arrivals: { label: "Arrivals", color: "#f0ad24" },
          }}
          className="h-[300px] w-full"
        >
          <LineChart data={trendData} margin={{ left: 0, right: 12, top: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="var(--color-applications)"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="arrivals"
              stroke="var(--color-arrivals)"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </section>
      <section className="rounded-2xl border bg-white">
        <PanelHead
          title="Agent performance matrix"
          sub={`Placement outcomes and financial contribution · ${periodLabel}`}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Agent</th>
                <th className="px-5 py-3">Candidates</th>
                <th className="px-5 py-3">Arrived</th>
                <th className="px-5 py-3">Rejected</th>
                <th className="px-5 py-3">Arrival rate</th>
                <th className="px-5 py-3">Durotech profit</th>
                <th className="px-6 py-3">Commission due</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {agentData.map((agent) => (
                <tr key={agent.name}>
                  <td className="px-6 py-4 font-semibold">{agent.name}</td>
                  <td className="px-5 py-4">{agent.candidates}</td>
                  <td className="px-5 py-4">{agent.arrived}</td>
                  <td className="px-5 py-4">{agent.rejected}</td>
                  <td className="px-5 py-4">
                    <b>{agent.arrivalRate}%</b>
                  </td>
                  <td
                    className={`px-5 py-4 font-semibold ${agent.profit < 0 ? "text-rose-600" : "text-emerald-700"}`}
                  >
                    {money(agent.profit)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-amber-700">
                    {money(agent.commission)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="rounded-2xl border bg-white">
        <PanelHead
          title="Employer breakdown"
          sub={`Demand, outcomes and collections · ${periodLabel}`}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Employer</th>
                <th className="px-5 py-3">Country</th>
                <th className="px-5 py-3">Candidates</th>
                <th className="px-5 py-3">Active</th>
                <th className="px-5 py-3">Arrived</th>
                <th className="px-5 py-3">Agreed value</th>
                <th className="px-6 py-3">Cash collected</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employerData.map((employer) => (
                <tr key={employer.name}>
                  <td className="px-6 py-4 font-semibold">{employer.name}</td>
                  <td className="px-5 py-4">{employer.country}</td>
                  <td className="px-5 py-4">{employer.candidates}</td>
                  <td className="px-5 py-4">{employer.active}</td>
                  <td className="px-5 py-4 text-emerald-700">
                    {employer.arrived}
                  </td>
                  <td className="px-5 py-4 font-semibold">
                    {money(employer.agreed)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#0d1974]">
                    {money(employer.cash)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!employerData.length && (
            <p className="p-8 text-center text-sm text-slate-500">
              No employer data for the selected filters.
            </p>
          )}
        </div>
      </section>
      <section>
        <div className="mb-3">
          <h3 className="font-semibold">Business insights</h3>
          <p className="text-sm text-slate-500">
            Decision prompts calculated from the selected reporting period
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Insight
            label="Pipeline bottleneck"
            value={bottleneck?.name ?? "No active cases"}
            note={`${bottleneck?.value ?? 0} candidates here — prioritise follow-ups at this stage.`}
          />
          <Insight
            label="Leading agent"
            value={topAgent?.name ?? "No agent data"}
            note={`${topAgent?.arrivalRate ?? 0}% arrival rate across ${topAgent?.candidates ?? 0} candidates.`}
          />
          <Insight
            label="Cash collection"
            value={`${collectionRate}%`}
            note={`${money(received)} received against ${money(agreed)} agreed fees.`}
          />
          <Insight
            label="Placement costs"
            value={money(expenses)}
            note={`${money(total ? expenses / total : 0)} average expense per candidate.`}
          />
          <Insight
            label="Rejection rate"
            value={`${total ? Math.round((rejected / total) * 100) : 0}%`}
            note={`${rejected} rejected applications — review source and destination patterns.`}
          />
          <Insight
            label="Upcoming arrivals"
            value={String(
              candidates.filter(
                (c) => c.arrivalDate && new Date(c.arrivalDate) >= new Date(),
              ).length,
            )}
            note="Future arrival dates recorded for applications in this period."
          />
        </div>
      </section>
    </div>
  );
}

function Insight({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#0d1974]">
        {label}
      </p>
      <h3 className="mt-2 text-lg font-bold">{value}</h3>
      <p className="mt-1 text-sm text-slate-500">{note}</p>
    </div>
  );
}
function ReportNumber({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <b className="mt-1 block text-lg">{value}</b>
    </div>
  );
}
function ActivityLog({ data }: { data: PortalData }) {
  const [query, setQuery] = useState(""),
    [user, setUser] = useState("all"),
    [action, setAction] = useState("all"),
    [range, setRange] = useState("all"),
    [now] = useState(() => Date.now());
  const users = Array.from(
      new Set(data.activity.map((item) => item.userName)),
    ).sort(),
    actions = Array.from(
      new Set(data.activity.map((item) => item.action)),
    ).sort(),
    cutoff = range === "all" ? 0 : now - Number(range) * 86400000,
    rows = data.activity.filter(
      (item) =>
        (user === "all" || item.userName === user) &&
        (action === "all" || item.action === action) &&
        (!cutoff || new Date(item.createdAt).getTime() >= cutoff) &&
        `${item.userName} ${item.action} ${item.details}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
  return (
    <section className="overflow-hidden rounded-2xl border bg-white">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div>
          <h2 className="font-semibold">Staff activity</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Search and audit every recorded staff action
          </p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search activity"
            />
          </div>
          <select
            value={user}
            onChange={(event) => setUser(event.target.value)}
            className="h-9 rounded-md border bg-white px-3 text-sm"
          >
            <option value="all">All staff</option>
            {users.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select
            value={action}
            onChange={(event) => setAction(event.target.value)}
            className="h-9 rounded-md border bg-white px-3 text-sm"
          >
            <option value="all">All actions</option>
            {actions.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="h-9 rounded-md border bg-white px-3 text-sm"
          >
            <option value="all">All time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Showing {rows.length} of {data.activity.length} events
        </p>
      </div>
      <div className="divide-y">
        {rows.map((a) => (
          <div key={a.id} className="flex gap-4 px-5 py-4 sm:px-6">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-[#ffd35a]" />
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <b>{a.userName}</b>{" "}
                {a.details.charAt(0).toLowerCase() + a.details.slice(1)}
              </p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>{date(a.createdAt)}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                  {a.action}
                </span>
              </div>
            </div>
          </div>
        ))}
        {!rows.length && (
          <div className="p-12 text-center text-sm text-slate-500">
            No activity matches these filters.
          </div>
        )}
      </div>
    </section>
  );
}
function PortalSettings({ data }: { data: PortalData }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="rounded-2xl border bg-white">
        <PanelHead
          title="Staff access"
          sub="One administrator and up to two secretaries"
        />
        <div className="divide-y">
          {data.staff.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-6 py-4">
              <span className="grid size-9 place-items-center rounded-full bg-slate-100 text-xs font-bold">
                {initials(s.name)}
              </span>
              <div>
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-xs text-slate-500">{s.email}</p>
              </div>
              <span className="ml-auto rounded-full bg-[#fff4cf] px-2.5 py-1 text-xs font-semibold capitalize text-[#0d1974]">
                {s.role}
              </span>
            </div>
          ))}
        </div>
        <p className="px-6 py-4 text-xs text-slate-500">
          Secretaries can read, add and edit records. Only the administrator can
          delete.
        </p>
      </section>
      <section className="rounded-2xl border bg-white">
        <PanelHead
          title="Application workflow"
          sub="The fixed stages used across every placement"
        />
        <div className="grid grid-cols-2 gap-3 p-6">
          {APPLICATION_STATUSES.map((s, i) => (
            <div
              key={s}
              className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
            >
              <span
                className={`grid size-7 place-items-center rounded-full text-xs font-bold text-white ${statusDot[s]}`}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium">{s}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RecordDialog({
  modal,
  close,
  data,
  refresh,
}: {
  modal: Modal;
  close: () => void;
  data: PortalData;
  refresh: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  if (!modal) return null;
  const title =
    modal.type === "candidate"
      ? modal.item
        ? "Edit candidate"
        : "Add candidate"
      : modal.type === "job"
        ? modal.item
          ? "Edit job listing"
          : "Add job listing"
        : modal.type === "agent"
          ? modal.item
            ? "Edit agent"
            : "Add agent"
          : modal.type === "employer"
            ? modal.item
              ? "Edit employer"
              : "Add employer"
            : modal.direction === "incoming"
              ? "Record candidate payment"
              : "Record placement expense";
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const action =
      modal.type === "candidate"
        ? "save_candidate"
        : modal.type === "job"
          ? "save_job"
          : modal.type === "agent"
            ? "save_agent"
            : modal.type === "employer"
              ? "save_employer"
              : "add_transaction";
    const response = await fetch("/api/portal/data", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action,
        ...("item" in modal && modal.item ? { id: modal.item.id } : {}),
        ...(modal.type === "transaction" ? { direction: modal.direction } : {}),
        ...values,
      }),
    });
    const result = (await response.json()) as { error?: string };
    setSaving(false);
    if (!response.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Saved successfully");
    close();
    await refresh();
  };
  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {modal.type === "job"
              ? "This listing can be published immediately or saved as paused."
              : "All financial amounts are in pounds sterling."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {modal.type === "candidate" && (
            <CandidateFields item={modal.item} data={data} />
          )}{" "}
          {modal.type === "job" && <JobFields item={modal.item} />}{" "}
          {modal.type === "agent" && <AgentFields item={modal.item} />}{" "}
          {modal.type === "employer" && <EmployerFields item={modal.item} />}{" "}
          {modal.type === "transaction" && (
            <TransactionFields data={data} direction={modal.direction} />
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button disabled={saving} className="bg-[#0d1974]">
              {saving ? "Saving…" : "Save record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}
function NativeSelect({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="h-9 w-full rounded-md border bg-white px-3 text-sm"
      >
        {children}
      </select>
    </div>
  );
}
function CandidateFields({
  item,
  data,
}: {
  item?: Candidate;
  data: PortalData;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" name="name" defaultValue={item?.name} required />
      <Field
        label="Email address"
        name="email"
        type="email"
        defaultValue={item?.email}
      />
      <Field label="Phone" name="phone" defaultValue={item?.phone} />
      <Field
        label="Passport number"
        name="passportNumber"
        defaultValue={item?.passportNumber}
      />
      <Field
        label="Nationality"
        name="nationality"
        defaultValue={item?.nationality}
        required
      />
      <Field
        label="Destination country"
        name="destinationCountry"
        defaultValue={item?.destinationCountry}
        required
      />
      <Field
        label="Job title"
        name="jobTitle"
        defaultValue={item?.jobTitle}
        required
      />
      <Field
        label="Agreed amount (£)"
        name="agreedAmount"
        type="number"
        defaultValue={item ? item.agreedAmount / 100 : undefined}
        required
      />
      <NativeSelect
        label="Status"
        name="status"
        defaultValue={item?.status ?? "Applied"}
      >
        {APPLICATION_STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </NativeSelect>
      <Field
        label="Arrival date"
        name="arrivalDate"
        type="date"
        defaultValue={item?.arrivalDate ?? ""}
      />
      <NativeSelect
        label="Visa required"
        name="visaRequired"
        defaultValue={item?.visaRequired ?? 1}
      >
        <option value="1">Yes</option>
        <option value="0">No</option>
      </NativeSelect>
      <NativeSelect
        label="Accommodation required"
        name="accommodation"
        defaultValue={item?.accommodation ?? 0}
      >
        <option value="1">Yes</option>
        <option value="0">No</option>
      </NativeSelect>
      <NativeSelect
        label="Food required"
        name="food"
        defaultValue={item?.food ?? 0}
      >
        <option value="1">Yes</option>
        <option value="0">No</option>
      </NativeSelect>
      <NativeSelect
        label="Agent"
        name="agentId"
        defaultValue={item?.agentId ?? ""}
      >
        <option value="">No agent</option>
        {data.agents.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect
        label="Employer"
        name="employerId"
        defaultValue={item?.employerId ?? ""}
      >
        <option value="">No employer</option>
        {data.employers.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </NativeSelect>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={item?.notes}
          placeholder="Latest update or follow-up note"
        />
      </div>
    </div>
  );
}
function JobFields({ item }: { item?: PortalJob }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label="Job title"
        name="title"
        defaultValue={item?.title}
        required
      />
      <Field
        label="Employer / company"
        name="companyName"
        defaultValue={item?.companyName}
      />
      <Field
        label="Location"
        name="location"
        defaultValue={item?.location}
        required
      />
      <Field
        label="Country"
        name="country"
        defaultValue={item?.country}
        required
      />
      <NativeSelect
        label="Region"
        name="region"
        defaultValue={item?.region ?? "europe"}
      >
        <option value="europe">Europe</option>
        <option value="middle_east">Middle East</option>
        <option value="asia">Asia</option>
      </NativeSelect>
      <NativeSelect
        label="Industry"
        name="industry"
        defaultValue={item?.industry ?? "construction"}
      >
        <option value="construction">Construction</option>
        <option value="food_production">Food production</option>
        <option value="health">Health</option>
        <option value="engineering">Engineering</option>
        <option value="warehousing">Warehousing</option>
        <option value="garments">Garments</option>
      </NativeSelect>
      <NativeSelect
        label="Employment type"
        name="employmentType"
        defaultValue={item?.employmentType ?? "full_time"}
      >
        <option value="full_time">Full-time</option>
        <option value="part_time">Part-time</option>
        <option value="contract">Contract</option>
        <option value="temporary">Temporary</option>
      </NativeSelect>
      <Field
        label="Positions available"
        name="positionsAvailable"
        type="number"
        defaultValue={item?.positionsAvailable ?? 1}
        required
      />
      <Field
        label="Salary range"
        name="salaryRange"
        defaultValue={item?.salaryRange}
      />
      <Field
        label="Currency"
        name="currency"
        defaultValue={item?.currency ?? "GBP"}
      />
      <NativeSelect
        label="Listing status"
        name="active"
        defaultValue={String(item?.active ?? true)}
      >
        <option value="true">Live</option>
        <option value="false">Paused</option>
      </NativeSelect>
      <div />
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={item?.description}
          rows={5}
          required
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          name="requirements"
          defaultValue={item?.requirements}
          rows={4}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="benefits">Benefits</Label>
        <Textarea
          id="benefits"
          name="benefits"
          defaultValue={item?.benefits}
          rows={3}
        />
      </div>
    </div>
  );
}
function AgentFields({ item }: { item?: Agent }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label="Agency name"
        name="name"
        defaultValue={item?.name}
        required
      />
      <Field
        label="Country"
        name="country"
        defaultValue={item?.country}
        required
      />
      <Field
        label="Contact person"
        name="contactName"
        defaultValue={item?.contactName}
      />
      <Field
        label="Email address"
        name="email"
        type="email"
        defaultValue={item?.email}
      />
      <Field label="Phone" name="phone" defaultValue={item?.phone} />
      <Field
        label="Commission percentage"
        name="commissionPct"
        type="number"
        defaultValue={item?.commissionPct}
        required
      />
    </div>
  );
}
function EmployerFields({ item }: { item?: Employer }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label="Company name"
        name="name"
        defaultValue={item?.name}
        required
      />
      <Field
        label="Country"
        name="country"
        defaultValue={item?.country}
        required
      />
      <Field
        label="Contact person"
        name="contactName"
        defaultValue={item?.contactName}
      />
      <Field
        label="Email address"
        name="email"
        type="email"
        defaultValue={item?.email}
      />
      <Field label="Phone" name="phone" defaultValue={item?.phone} />
    </div>
  );
}
function TransactionFields({
  data,
  direction,
}: {
  data: PortalData;
  direction: "incoming" | "outgoing";
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <NativeSelect label="Candidate" name="candidateId">
        <option value="">Select candidate</option>
        {data.candidates.map((c) => (
          <option key={c.id} value={c.id}>
            {c.reference} — {c.name}
          </option>
        ))}
      </NativeSelect>
      <Field label="Amount (£)" name="amount" type="number" required />
      <NativeSelect label="Category" name="category">
        {(direction === "incoming"
          ? [
              "Candidate payment",
              "Deposit",
              "Final instalment",
              "Refund received",
            ]
          : [
              "Visa fee",
              "Transportation",
              "Accommodation",
              "Medical",
              "Translation",
              "Other expense",
            ]
        ).map((x) => (
          <option key={x}>{x}</option>
        ))}
      </NativeSelect>
      <Field
        label="Date"
        name="paidAt"
        type="date"
        defaultValue={new Date().toISOString().slice(0, 10)}
        required
      />
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          name="note"
          placeholder="Payment method, receipt reference or expense detail"
        />
      </div>
    </div>
  );
}
