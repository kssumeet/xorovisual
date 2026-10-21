export const fields = [
  "name",
  "email",
  "company",
  "country",
  "projectType",
  "budget",
  "timeline",
  "deliverables",
  "description",
  "references",
] as const;

export type Field = (typeof fields)[number];

export type ContactState = {
  status: "idle" | "invalid" | "sent" | "failed" | "unconfigured";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  values?: Partial<Record<Field, string>>;
};

export const initialState: ContactState = { status: "idle" };

export const budgets = [
  "Under USD 2,000",
  "USD 2,000 – 5,000",
  "USD 5,000 – 15,000",
  "USD 15,000 – 50,000",
  "Over USD 50,000",
  "Not sure yet",
];

export const timelines = ["Within 2 weeks", "2 – 4 weeks", "1 – 3 months", "Flexible"];
