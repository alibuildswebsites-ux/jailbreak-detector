"use client";

import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import styles from "./analytics.module.css";

const MODELS = [
  { model: "Logistic Regression", accuracy: 97.71, precision: 97.72, recall: 97.81, f1: 97.71, cvF1: 95.53, gap: 0.71, selected: true },
  { model: "Random Forest", accuracy: 97.71, precision: 97.66, recall: 97.71, f1: 97.78, cvF1: 95.33, gap: 2.11, selected: false },
  { model: "Naive Bayes", accuracy: 96.18, precision: 96.14, recall: 96.18, f1: 96.38, cvF1: 94.47, gap: 1.46, selected: false },
];

const CLASS_BALANCE = [
  { name: "Benign", value: 516 },
  { name: "Jailbreak", value: 515 },
];

const LENGTHS = [
  { metric: "Median words", benign: 36, jailbreak: 259 },
  { metric: "Mean words", benign: 85.7, jailbreak: 329.6 },
  { metric: "Median chars", benign: 220, jailbreak: 1523 },
];

const KEYWORDS = [
  { keyword: "dan", jailbreak: 34.2, benign: 5.8 },
  { keyword: "ignore", jailbreak: 17.9, benign: 0.4 },
  { keyword: "unfiltered", jailbreak: 17.3, benign: 0 },
  { keyword: "no restrictions", jailbreak: 5.0, benign: 0 },
  { keyword: "previous instructions", jailbreak: 2.9, benign: 0 },
  { keyword: "roleplay", jailbreak: 6.0, benign: 5.6 },
];

const CV = [
  { model: "Logistic Regression", mean: 95.53, std: 1.99 },
  { model: "Random Forest", mean: 95.33, std: 1.97 },
  { model: "Naive Bayes", mean: 94.47, std: 1.26 },
];

const CONFUSIONS = [
  { model: "Logistic Regression", tag: "Selected", note: "5 missed jailbreaks · 1 false alarm", matrix: [[122, 1], [5, 134]] },
  { model: "Random Forest", tag: "Alternative", note: "6 missed jailbreaks · 0 false alarms", matrix: [[123, 0], [6, 133]] },
  { model: "Naive Bayes", tag: "Baseline", note: "6 missed jailbreaks · 4 false alarms", matrix: [[119, 4], [6, 133]] },
];

const EVIDENCE = [
  ["Problem identification", "Implemented", "Binary text classification: benign vs jailbreak prompts."],
  ["Data preparation", "Implemented", "Cleaning, encoding, feature engineering and applicability decisions are documented."],
  ["Training / testing", "Implemented", "1,031 cleaned training rows and 262 held-out test rows."],
  ["Validation", "Implemented", "Stratified 5-fold CV on training data; test set is not used in CV."],
  ["Supervised learning", "Implemented", "Labels are available, so supervised classification is appropriate."],
  ["Classification metrics", "Implemented", "Accuracy, precision, recall, F1 and confusion matrices are reported."],
  ["Bias assessment", "Implemented", "Sampling, selection, measurement, labeling, historical, exclusion, evaluation and model bias are audited."],
  ["Ethics / compliance", "Implemented", "Privacy, provenance, representativeness, transparency and safe-use considerations are documented."],
  ["Unsupervised learning", "Not applicable", "The project has labelled binary targets; unsupervised learning is outside scope."],
  ["Regression metrics", "Not applicable", "The primary target is classification, not continuous regression."],
];

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return <div className={styles.sectionLabel}><span>{n}</span>{children}</div>;
}

function MetricCard({ value, label, detail, accent = "" }: { value: string; label: string; detail: string; accent?: string }) {
  return <div className={`${styles.metricCard} ${accent ? styles[accent] : ""}`}><strong>{value}</strong><span>{label}</span><small>{detail}</small></div>;
}

function ConfusionMatrix({ item }: { item: typeof CONFUSIONS[number] }) {
  const [[tn, fp], [fn, tp]] = item.matrix;
  return (
    <article className={styles.cmCard}>
      <div className={styles.cmTop}><div><h3>{item.model}</h3><span>{item.tag}</span></div><p>{item.note}</p></div>
      <div className={styles.matrix}>
        <div /> <b>Pred. benign</b> <b>Pred. jailbreak</b>
        <b>Actual benign</b><strong>{tn}</strong><strong>{fp}</strong>
        <b className={styles.dangerText}>Actual jailbreak</b><strong className={styles.miss}>{fn}</strong><strong className={styles.hit}>{tp}</strong>
      </div>
      <div className={styles.matrixLegend}><span>TP = caught jailbreak</span><span>FN = missed jailbreak</span></div>
    </article>
  );
}

export default function AnalyticsPage() {
  return (
    <div className={styles.shell}>
      <aside className={styles.nav}>
        <Link href="/" className={styles.brand}><span>◆</span><div><strong>Jailbreak Detector</strong><small>Project report</small></div></Link>
        <div className={styles.navGroup}>
          <a href="#overview" className={styles.navActive}>01 Overview</a>
          <a href="#preparation">02 Preparation</a>
          <a href="#descriptive">03 Descriptive</a>
          <a href="#eda">04 Exploratory</a>
          <a href="#inferential">05 Inferential</a>
          <a href="#ml">06 Machine Learning</a>
          <a href="#interpretability">07 Interpretability</a>
          <a href="#ethics">08 Bias & Ethics</a>
          <a href="#instructor">09 Instructor View</a>
          <a href="#tester">10 Live Tester</a>
        </div>
        <div className={styles.navFoot}><span className={styles.liveDot} /> Pipeline evidence<br /><small>Updated from project outputs</small></div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <Link href="/" className={styles.back}>← Detector</Link>
          <div><span className={styles.eyebrow}>DATA SCIENCE PROJECT · FINAL REPORT</span><h1>Jailbreak Detection Analysis</h1></div>
          <span className={styles.scope}>Binary classification</span>
        </header>

        <div className={styles.content}>
          <section id="overview" className={styles.hero}>
            <SectionLabel n="01">Overview</SectionLabel>
            <div className={styles.heroGrid}>
              <div><h2>Can a text classifier reliably distinguish <em>jailbreak</em> prompts from benign prompts?</h2><p>This interactive report presents the complete analysis pipeline—from preparation and exploratory analysis through inferential statistics, model validation, interpretability, and responsible-use considerations.</p></div>
              <div className={styles.heroDecision}><span>Final model</span><strong>TF-IDF + Logistic Regression</strong><small>Selected for strong held-out performance, recall-first evaluation, and the smallest train–test jailbreak F1 gap among the compared models.</small></div>
            </div>
            <div className={styles.metricGrid}>
              <MetricCard value="97.71%" label="Test accuracy" detail="262 held-out prompts" />
              <MetricCard value="97.81%" label="Jailbreak F1" detail="Precision 99.26% · recall 96.40%" accent="accent" />
              <MetricCard value="1,293" label="Cleaned prompts" detail="1,031 train · 262 test" />
              <MetricCard value="95.53%" label="Mean CV macro F1" detail="Stratified 5-fold · training only" />
            </div>
          </section>

          <section id="preparation" className={styles.section}>
            <SectionLabel n="02">Dataset & Preparation</SectionLabel>
            <div className={styles.split}><div className={styles.card}><h2>What the model sees</h2><p>The dataset is labelled binary text: <b>benign</b> versus <b>jailbreak</b>. The modelling pipeline converts prompt text to TF-IDF unigram/bigram features and then applies the classifier.</p><div className={styles.factList}><div><b>Raw dataset</b><span>1,306 prompts</span></div><div><b>Rows removed during cleaning</b><span>13 train · 0 test</span></div><div><b>Training set</b><span>1,031 prompts</span></div><div><b>Held-out test set</b><span>262 prompts</span></div></div></div><div className={styles.card}><h2>Feature rationale</h2><p>Text is the meaningful predictive signal for this task. Length, token-level patterns, and lexical signals were examined during preparation and EDA; the final classifier uses TF-IDF text features rather than unrelated attributes.</p><div className={styles.pillRow}><span>Tokenization</span><span>TF-IDF</span><span>Unigrams + bigrams</span><span>Label encoding</span></div></div></div>
          </section>

          <section id="descriptive" className={styles.section}>
            <SectionLabel n="03">Descriptive Statistics</SectionLabel>
            <div className={styles.split}><div className={styles.chartCard}><h2>Training class balance</h2><p>516 benign and 515 jailbreak prompts—effectively balanced, so no class-resampling step was required.</p><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={CLASS_BALANCE} dataKey="value" nameKey="name" innerRadius={65} outerRadius={90} paddingAngle={3}>{CLASS_BALANCE.map((x, i) => <Cell key={x.name} fill={i === 0 ? "#34d399" : "#ef4444"} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className={styles.legend}><span>● Benign 516 (50.05%)</span><span>● Jailbreak 515 (49.95%)</span></div></div><div className={styles.chartCard}><h2>Prompt length by class</h2><p>Jailbreak prompts are substantially longer in the observed data, making length a strong descriptive signal—but not a standalone detector.</p><ResponsiveContainer width="100%" height={250}><BarChart data={LENGTHS} layout="vertical" margin={{ left: 30, right: 20 }}><CartesianGrid stroke="rgba(255,255,255,.06)" horizontal={false}/><XAxis type="number" tick={{ fill: "#B4BCD0", fontSize: 11 }}/><YAxis type="category" dataKey="metric" width={95} tick={{ fill: "#B4BCD0", fontSize: 10 }}/><Tooltip/><Legend/><Bar dataKey="benign" fill="#34d399"/><Bar dataKey="jailbreak" fill="#ef4444"/></BarChart></ResponsiveContainer></div></div>
          </section>

          <section id="eda" className={styles.section}><SectionLabel n="04">Exploratory Analysis</SectionLabel><div className={styles.chartCard}><div className={styles.cardHead}><div><h2>Lexical signals by class</h2><p>Share of prompts containing each observed keyword. These are exploratory signals, not a replacement for the trained classifier.</p></div><span className={styles.signalNote}>Dataset-specific</span></div><ResponsiveContainer width="100%" height={310}><BarChart data={KEYWORDS} margin={{ left: 0, right: 20, bottom: 10 }}><CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false}/><XAxis dataKey="keyword" tick={{ fill: "#B4BCD0", fontSize: 11 }}/><YAxis tick={{ fill: "#B4BCD0", fontSize: 11 }} unit="%"/><Tooltip formatter={(v) => `${v}%`}/><Legend/><Bar dataKey="jailbreak" name="% jailbreak" fill="#ef4444"/><Bar dataKey="benign" name="% benign" fill="#34d399"/></BarChart></ResponsiveContainer></div></section>

          <section id="inferential" className={styles.section}><SectionLabel n="05">Inferential Statistics</SectionLabel><div className={styles.split}><div className={styles.card}><h2>What inference adds</h2><p>The inferential stage moves beyond describing the sample. The project includes confidence intervals, hypothesis tests, chi-square analysis, correlation significance, bootstrap estimates, and regression analyses where they are applicable to the available variables.</p><div className={styles.callout}><b>Important distinction</b><span>Inferential artifacts support statistical interpretation of the dataset; they do not replace held-out model evaluation.</span></div></div><div className={styles.card}><h2>Evidence trail</h2><div className={styles.factList}><div><b>Confidence intervals</b><span>Generated</span></div><div><b>Hypothesis tests</b><span>Generated</span></div><div><b>Chi-square analysis</b><span>Generated</span></div><div><b>Bootstrap analysis</b><span>Generated</span></div><div><b>Regression diagnostics</b><span>Generated where applicable</span></div></div></div></div></section>

          <section id="ml" className={styles.section}><SectionLabel n="06">Machine Learning</SectionLabel><div className={styles.chartCard}><div className={styles.cardHead}><div><h2>Model comparison</h2><p>Held-out test performance is shown alongside training-only cross-validation evidence.</p></div><span className={styles.badge}>Recall-first evaluation</span></div><ResponsiveContainer width="100%" height={320}><BarChart data={MODELS} margin={{ left: -10, right: 10 }}><CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false}/><XAxis dataKey="model" tick={{ fill: "#B4BCD0", fontSize: 11 }}/><YAxis domain={[90,100]} tick={{ fill: "#B4BCD0", fontSize: 11 }}/><Tooltip/><Legend/><Bar dataKey="accuracy" name="Accuracy" fill="#fff"/><Bar dataKey="recall" name="Recall" fill="#818CF8"/><Bar dataKey="f1" name="F1" fill="#34d399"/></BarChart></ResponsiveContainer><div className={styles.modelTable}><div className={styles.tableRow + " " + styles.tableHead}><span>Model</span><span>Test acc.</span><span>Jailbreak F1</span><span>CV macro F1</span><span>Train→test F1 gap</span></div>{MODELS.map(m => <div key={m.model} className={`${styles.tableRow} ${m.selected ? styles.selectedRow : ""}`}><span><b>{m.model}</b>{m.selected && <i> selected</i>}</span><span>{m.accuracy.toFixed(2)}%</span><span>{m.f1.toFixed(2)}%</span><span>{m.cvF1.toFixed(2)}%</span><span>{m.gap.toFixed(2)}pp</span></div>)}</div></div></section>

          <section id="interpretability" className={styles.section}><SectionLabel n="07">Interpretability & Error Analysis</SectionLabel><div className={styles.cmGrid}>{CONFUSIONS.map(item => <ConfusionMatrix key={item.model} item={item}/>)}</div><div className={styles.insightStrip}><b>Selection logic</b><span>Logistic Regression and Random Forest both reach 97.71% test accuracy. Logistic Regression is retained because its jailbreak recall is 96.40% and its jailbreak F1 gap from train to test is only 0.71 percentage points, while remaining competitive in stratified CV.</span></div></section>

          <section id="ethics" className={styles.section}><SectionLabel n="08">Bias, Ethics & Limitations</SectionLabel><div className={styles.three}><div className={styles.card}><span className={styles.cardKicker}>BIAS AUDIT</span><h2>What was checked</h2><p>Sampling, selection, measurement, labeling, historical, exclusion, evaluation, algorithmic/model, confirmation, and observer bias are explicitly considered.</p></div><div className={styles.card}><span className={styles.cardKicker}>DATA LIMIT</span><h2>No demographic fairness claim</h2><p>The dataset does not provide demographic group fields, so demographic subgroup fairness cannot be established from this project.</p></div><div className={styles.card}><span className={styles.cardKicker}>SAFE USE</span><h2>Research detector, not a guarantee</h2><p>Novel jailbreak styles may evade the classifier. Predictions should be treated as model outputs, not a security certification.</p></div></div></section>

          <section id="instructor" className={styles.section}><SectionLabel n="09">Instructor View</SectionLabel><div className={styles.instructorCard}><div className={styles.instructorHead}><div><h2>Lecture coverage & evidence</h2><p>A compact audit trail showing where each relevant machine-learning requirement is implemented or intentionally excluded.</p></div><span>10 checks</span></div>{EVIDENCE.map(([req, status, why]) => <div className={styles.evidenceRow} key={req}><div><b>{req}</b><small>{why}</small></div><span className={status === "Implemented" ? styles.ok : styles.na}>{status}</span></div>)}</div></section>

          <section id="tester" className={styles.section}><SectionLabel n="10">Live Model Tester</SectionLabel><div className={styles.tester}><div><h2>Test the implemented detector</h2><p>Return to the live prompt interface to submit a prompt to the project's prediction endpoint and inspect its classification.</p></div><Link href="/" className={styles.primaryBtn}>Open detector →</Link></div></section>

          <footer className={styles.footer}><span>Jailbreak Detection · Data Science Project</span><span>Evidence source: project pipeline outputs and REPORT.md</span></footer>
        </div>
      </main>
    </div>
  );
}
