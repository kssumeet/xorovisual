export type Step = {
  name: string;
  summary: string;
  youProvide: string;
  youReceive: string;
};

export const process: Step[] = [
  {
    name: "Discover",
    summary: "A call to understand the audience, the placement and what the film has to achieve.",
    youProvide: "Your brief, brand guidelines, references and any footage or product assets.",
    youReceive: "A written scope with deliverables, timeline and a fixed quote.",
  },
  {
    name: "Develop",
    summary: "We turn the brief into a concept you can see before production starts.",
    youProvide: "Feedback on the treatment, in one consolidated round.",
    youReceive: "A treatment with mood frames, script or shot list, and look references.",
  },
  {
    name: "Produce",
    summary: "Generation, shooting, design and animation, depending on the approach agreed.",
    youProvide: "Approvals on key frames when we ask for them.",
    youReceive: "Progress frames so there are no surprises at the first cut.",
  },
  {
    name: "Refine",
    summary: "Edit, colour, sound and finishing, shaped by your feedback.",
    youProvide: "Time-coded notes on each cut, gathered from your stakeholders.",
    youReceive: "Revised cuts within the revision rounds set out in your quote.",
  },
  {
    name: "Deliver",
    summary: "Masters and every agreed format, named and organised for your team.",
    youProvide: "Final sign-off.",
    youReceive: "Final files by download link, with source files if they're in scope.",
  },
];
