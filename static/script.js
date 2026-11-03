(() => {
  "use strict";

  /* ───────── Helpers & elements ───────── */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const clamp = (n, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const form = $("#loan-form");
  const submitBtn = $("#submit-btn");
  const formError = $("#form-error");
  const card = $("#result-card");
  const badge = $("#badge");
  const arc = $("#gauge-arc");
  const marker = $("#threshold-marker");
  const thLine = $("#th-line");
  const thDot = $("#th-dot");
  const probEl = $("#prob-value");
  const verdict = $("#verdict");
  const statTh = $("#stat-threshold");
  const statMargin = $("#stat-margin");
  const statClass = $("#stat-decision");
  const pill = $("#status-pill");
  const pillText = $("#status-text");
  const lpiValue = $("#lpi-value");
  const lpiBar = $("#lpi-bar");
  const lpiHidden = form.elements["loan_percent_income"];

  const ARC_LEN = Math.PI * 100; // semicircle, radius 100
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  arc.style.strokeDasharray = ARC_LEN;
  arc.style.strokeDashoffset = ARC_LEN;

  /* ───────── Example presets ───────── */
  const PRESETS = {
    low: {
      person_age: 36, person_income: 92000, person_home_ownership: "MORTGAGE",
      person_emp_length: 9, loan_intent: "EDUCATION", loan_grade: "A",
      loan_amnt: 9000, loan_int_rate: 7.5,
      cb_person_default_on_file: "N", cb_person_cred_hist_length: 12,
    },
    high: {
      person_age: 22, person_income: 28000, person_home_ownership: "RENT",
      person_emp_length: 0.5, loan_intent: "VENTURE", loan_grade: "E",
      loan_amnt: 15000, loan_int_rate: 17.5,
      cb_person_default_on_file: "Y", cb_person_cred_hist_length: 2,
    },
  };

  function fillForm(values) {
    Object.entries(values).forEach(([name, val]) => {
      const el = form.elements[name];
      if (el) el.value = val; // works for inputs, selects and radio groups
    });
    $$(".field.invalid").forEach((f) => f.classList.remove("invalid"));
    hideError();
    updateLoanShare();
  }

  $$(".chip-btn[data-preset]").forEach((btn) =>
    btn.addEventListener("click", () => fillForm(PRESETS[btn.dataset.preset]))
  );

  $("#reset-btn").addEventListener("click", () => {
    form.reset();
    $$(".field.invalid").forEach((f) => f.classList.remove("invalid"));
    hideError();
    updateLoanShare();
    resetResult();
    setPill("ready", "Model ready");
  });

  /* ───────── Loan-percent-income (auto) ───────── */
  function updateLoanShare() {
    const amount = parseFloat(form.elements["loan_amnt"].value);
    const income = parseFloat(form.elements["person_income"].value);
    if (amount > 0 && income > 0) {
      const ratio = Math.round((amount / income) * 100) / 100;
      lpiHidden.value = ratio;
      lpiValue.textContent = `${Math.round(ratio * 100)}%`;
      lpiBar.style.width = `${clamp(ratio) * 100}%`;
    } else {
      lpiHidden.value = "";
      lpiValue.textContent = "—";
      lpiBar.style.width = "0%";
    }
  }

  form.addEventListener("input", (e) => {
    if (e.target.name === "loan_amnt" || e.target.name === "person_income") updateLoanShare();
    const field = e.target.closest(".field");
    if (field) field.classList.remove("invalid");
  });
  form.addEventListener("change", (e) => {
    const field = e.target.closest(".field");
    if (field) field.classList.remove("invalid");
  });

  /* ───────── Validation ───────── */
  function validate() {
    let first = null;
    const mark = (field) => {
      if (!field) return;
      field.classList.remove("invalid");
      void field.offsetWidth; // restart the shake animation
      field.classList.add("invalid");
      first = first || field;
    };

    $$(".field.invalid").forEach((f) => f.classList.remove("invalid"));

    $$("input[type=number], select", form).forEach((el) => {
      if (!el.checkValidity()) mark(el.closest(".field"));
    });
    ["person_home_ownership", "loan_grade", "cb_person_default_on_file"].forEach((name) => {
      if (!form.elements[name].value) mark($(`input[name="${name}"]`, form).closest(".field"));
    });
    if (!lpiHidden.value) mark(lpiHidden.closest(".field"));

    if (first) {
      first.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      const focusable = $("input:not([type=hidden]), select", first);
      if (focusable) focusable.focus({ preventScroll: true });
    }
    return !first;
  }

  /* ───────── Build payload ───────── */
  function collect() {
    const v = (n) => form.elements[n].value;
    return {
      person_age: parseInt(v("person_age"), 10),
      person_income: parseFloat(v("person_income")),
      person_home_ownership: v("person_home_ownership"),
      person_emp_length: parseFloat(v("person_emp_length")),
      loan_intent: v("loan_intent"),
      loan_grade: v("loan_grade"),
      loan_amnt: parseFloat(v("loan_amnt")),
      loan_int_rate: parseFloat(v("loan_int_rate")),
      loan_percent_income: parseFloat(v("loan_percent_income")),
      cb_person_default_on_file: v("cb_person_default_on_file"),
      cb_person_cred_hist_length: parseInt(v("cb_person_cred_hist_length"), 10),
    };
  }

  /* ───────── API ───────── */
  async function predict(payload) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 45000);
    try {
      const res = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        let msg = `Request failed (${res.status}).`;
        try {
          const body = await res.json();
          if (Array.isArray(body.detail)) {
            msg = body.detail.map((d) => `${(d.loc || []).slice(-1)[0]}: ${d.msg}`).join(" · ");
          } else if (typeof body.detail === "string") {
            msg = body.detail;
          }
        } catch (_) { /* non-JSON error body */ }
        throw new Error(msg);
      }
      return await res.json();
    } catch (err) {
      if (err.name === "AbortError") throw new Error("The server took too long to respond. Please try again.");
      if (err instanceof TypeError) throw new Error("Could not reach the server. Check your connection and try again.");
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  /* ───────── UI state ───────── */
  function setPill(state, text) {
    pill.dataset.state = state;
    pillText.textContent = text;
  }
  function showError(msg) { formError.textContent = msg; formError.hidden = false; }
  function hideError() { formError.hidden = true; formError.textContent = ""; }

  function setLoading(on) {
    submitBtn.classList.toggle("loading", on);
    submitBtn.disabled = on;
    $(".submit-label", submitBtn).textContent = on ? "Analyzing…" : "Assess risk";
    if (on) {
      card.dataset.state = "loading";
      badge.textContent = "Analyzing";
      setPill("busy", "Analyzing…");
    }
  }

  function setGauge(p) {
    arc.style.strokeDashoffset = ARC_LEN * (1 - clamp(p));
  }

  function placeMarker(th) {
    const ang = Math.PI * (1 - clamp(th));
    const cx = 120, cy = 120;
    const pt = (r) => [cx + r * Math.cos(ang), cy - r * Math.sin(ang)];
    const [x1, y1] = pt(87);
    const [x2, y2] = pt(113);
    thLine.setAttribute("x1", x1); thLine.setAttribute("y1", y1);
    thLine.setAttribute("x2", x2); thLine.setAttribute("y2", y2);
    thDot.setAttribute("cx", x2); thDot.setAttribute("cy", y2);
    marker.classList.add("show");
  }

  function countUp(el, target, duration = 1200) {
    if (reduceMotion) { el.textContent = target.toFixed(1); return; }
    const start = performance.now();
    const from = parseFloat(el.textContent) || 0;
    const tick = (now) => {
      const t = clamp((now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (from + (target - from) * eased).toFixed(1);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function resetResult() {
    card.dataset.state = "idle";
    badge.textContent = "Awaiting input";
    arc.style.strokeDashoffset = ARC_LEN;
    marker.classList.remove("show");
    probEl.textContent = "—";
    verdict.textContent = "Complete the application and run the assessment to see the result.";
    statTh.textContent = statMargin.textContent = statClass.textContent = "—";
  }

  function renderResult(data) {
    const p = clamp(Number(data.default_probability));
    const th = clamp(Number(data.threshold));
    const high = Number(data.default_prediction) === 1;
    const pct = p * 100;
    const thPct = th * 100;

    card.dataset.state = high ? "high" : "low";
    badge.textContent = high ? "High risk" : "Low risk";

    verdict.textContent = high
      ? `Estimated default probability is ${pct.toFixed(1)}%, above the ${thPct.toFixed(1)}% threshold. This application is flagged as high risk.`
      : `Estimated default probability is ${pct.toFixed(1)}%, below the ${thPct.toFixed(1)}% threshold. This application looks low risk.`;

    statTh.textContent = `${thPct.toFixed(1)}%`;
    statMargin.textContent = `${Math.abs(pct - thPct).toFixed(1)} pts ${p >= th ? "over" : "under"}`;
    statClass.textContent = data.Result || (high ? "High Risk" : "Low Risk");

    setGauge(p);
    placeMarker(th);
    countUp(probEl, pct);

    if (window.matchMedia("(max-width: 960px)").matches) {
      card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  function renderError(err) {
    card.dataset.state = "error";
    badge.textContent = "Error";
    verdict.textContent = "We couldn't complete the assessment. Please try again.";
    showError(err.message || "Something went wrong.");
    setPill("error", "Connection issue");
  }

  /* ───────── Submit ───────── */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    if (!validate()) {
      showError("Please complete the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      // Small minimum delay so the loading state reads as intentional.
      const [data] = await Promise.all([predict(collect()), sleep(650)]);
      renderResult(data);
      setPill("ready", "Model ready");
    } catch (err) {
      renderError(err);
    } finally {
      setLoading(false);
    }
  });

  /* ───────── Card spotlight follows the cursor ───────── */
  $$(".spotlight").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
})();
