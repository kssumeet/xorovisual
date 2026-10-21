"use client";

import { useActionState, useEffect, useRef } from "react";
import { projectTypes } from "@/content/services";
import { submitInquiry } from "./actions";
import { budgets, initialState, timelines, type ContactState, type Field } from "./state";
import styles from "./contact.module.css";

function FieldError({ field, errors }: { field: Field; errors: ContactState["errors"] }) {
  const message = errors?.[field];
  if (!message) return null;
  return (
    <p id={`${field}-error`} className={styles.error}>
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(submitInquiry, initialState);
  const startedRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef(0);
  const typeRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Arm the timing check and honour ?type= links from service and agency pages.
  useEffect(() => {
    mountedAt.current = Date.now();
    const type = new URLSearchParams(window.location.search).get("type");
    if (type && typeRef.current && projectTypes.some((t) => t.value === type)) {
      typeRef.current.value = type;
    }
  }, []);

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className={styles.sent}>
        <p className="label">Inquiry sent</p>
        <p className={styles.sentTitle}>Thank you.</p>
        <p className="muted">{state.message}</p>
      </div>
    );
  }

  const v = state.values ?? {};
  const err = state.errors ?? {};
  const describe = (f: Field, hint?: boolean) =>
    [err[f] ? `${f}-error` : null, hint ? `${f}-hint` : null].filter(Boolean).join(" ") || undefined;

  return (
    <form
      action={action}
      className={styles.form}
      noValidate
      onSubmit={() => {
        // React resets the form after each action, so stamp the timing field at submit.
        if (startedRef.current) startedRef.current.value = String(mountedAt.current);
      }}
    >
      {state.status !== "idle" && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className={styles.notice}
          data-tone={state.status === "invalid" ? "error" : "warn"}
        >
          {state.message}
        </div>
      )}

      <fieldset className={styles.group}>
        <legend className="label">About you</legend>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              defaultValue={v.name}
              aria-invalid={!!err.name}
              aria-describedby={describe("name")}
            />
            <FieldError field="name" errors={err} />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">Work email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              defaultValue={v.email}
              aria-invalid={!!err.email}
              aria-describedby={describe("email")}
            />
            <FieldError field="email" errors={err} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="company">
              Company or agency <span className={styles.optional}>optional</span>
            </label>
            <input id="company" name="company" autoComplete="organization" defaultValue={v.company} />
          </div>
          <div className={styles.field}>
            <label htmlFor="country">
              Country <span className={styles.optional}>optional</span>
            </label>
            <input id="country" name="country" autoComplete="country-name" defaultValue={v.country} />
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className="label">The project</legend>
        <div className={styles.field}>
          <label htmlFor="projectType">Project type</label>
          <select
            id="projectType"
            name="projectType"
            ref={typeRef}
            required
            defaultValue={v.projectType ?? ""}
            aria-invalid={!!err.projectType}
            aria-describedby={describe("projectType")}
          >
            <option value="" disabled>
              Choose one
            </option>
            {projectTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <FieldError field="projectType" errors={err} />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="budget">
              Budget range <span className={styles.optional}>optional</span>
            </label>
            <select id="budget" name="budget" defaultValue={v.budget ?? ""}>
              <option value="">Prefer not to say</option>
              {budgets.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="timeline">
              Timeline <span className={styles.optional}>optional</span>
            </label>
            <select id="timeline" name="timeline" defaultValue={v.timeline ?? ""}>
              <option value="">Not decided</option>
              {timelines.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="deliverables">
            Deliverables <span className={styles.optional}>optional</span>
          </label>
          <input
            id="deliverables"
            name="deliverables"
            defaultValue={v.deliverables}
            aria-describedby="deliverables-hint"
          />
          <p id="deliverables-hint" className={styles.hint}>
            For example: one 30 s film, plus 15 s and 6 s cut-downs in 9:16 and 4:5.
          </p>
        </div>
        <div className={styles.field}>
          <label htmlFor="description">Tell us about it</label>
          <textarea
            id="description"
            name="description"
            rows={6}
            required
            defaultValue={v.description}
            aria-invalid={!!err.description}
            aria-describedby={describe("description", true)}
          />
          <p id="description-hint" className={styles.hint}>
            What it&rsquo;s for, who will see it, and anything you already have.
          </p>
          <FieldError field="description" errors={err} />
        </div>
        <div className={styles.field}>
          <label htmlFor="references">
            Reference links <span className={styles.optional}>optional</span>
          </label>
          <textarea id="references" name="references" rows={3} defaultValue={v.references} />
        </div>
      </fieldset>

      {/* Spam protection: humans never see or fill this field. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" ref={startedRef} />

      <div className={styles.submitRow}>
        <button type="submit" className="btn btn-primary" disabled={pending} aria-disabled={pending}>
          {pending ? "Sending…" : "Send inquiry"}
          {!pending && (
            <span className="arrow" aria-hidden="true">
              →
            </span>
          )}
        </button>
        <p className={styles.hint}>Only name, email, project type and a short description are required.</p>
      </div>
    </form>
  );
}
