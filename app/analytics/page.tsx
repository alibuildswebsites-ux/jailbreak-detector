"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import styles from "./analytics.module.css";

/* ===== Real data from the pipeline (ds1/output/results/metrics.csv + EDA) ===== */

const MODEL_COMPARISON = [
  {
    model: "Logistic\nRegression",
    accuracy: 97.7,
    precision: 97.7,
    recall: 97.8,
    f1: 97.7,
  },
  {
    model: "Random\nForest",
    accuracy: 97.7,
    precision: 97.7,
    recall: 97.8,
    f1: 97.7,
  },
  {
    model: "Naive\nBayes",
    accuracy: 96.2,
    precision: 96.1,
    recall: 96.2,
    f1: 96.2,
  },
];

const JAILBREAK_METRICS = [
  {
    model: "Logistic\nRegression",
    precision: 99.3,
    recall: 96.4,
    f1: 97.8,
  },
  {
    model: "Random\nForest",
    precision: 100.0,
    recall: 95.7,
    f1: 97.8,
  },
  {
    model: "Naive\nBayes",
    precision: 97.1,
    recall: 95.7,
    f1: 96.4,
  },
];

// rows = actual, cols = predicted [benign, jailbreak], values = count
const CONFUSIONS = [
  {
    model: "Logistic Regression",
    verdict: "🏆 selected model",
    note: "134/139 jailbreaks caught · 1 benign flagged",
    matrix: [
      [122, 1],
      [5, 134],
    ],
  },
  {
    model: "Random Forest",
    verdict: "perfect precision",
    note: "133/139 caught · 6 missed · 0 false alarms",
    matrix: [
      [123, 0],
      [6, 133],
    ],
  },
  {
    model: "Naive Bayes",
    verdict: "simplest baseline",
    note: "133/139 caught · 4 benign flagged",
    matrix: [
      [119, 4],
      [6, 133],
    ],
  },
];

// from output/eda/keywords.csv — % of each class hitting the keyword
const KEYWORDS = [
  { keyword: "dan", jailbreak: 34.2, benign: 5.8 },
  { keyword: "ignore", jailbreak: 17.9, benign: 0.4 },
  { keyword: "unfiltered", jailbreak: 17.3, benign: 0.0 },
  { keyword: "no restrictions", jailbreak: 5.0, benign: 0.0 },
  { keyword: "previous instructions", jailbreak: 2.9, benign: 0.0 },
  { keyword: "roleplay", jailbreak: 6.0, benign: 5.6 },
];

const LENGTHS = [
  { metric: "median words", benign: 36, jailbreak: 259 },
  { metric: "mean words", benign: 85.7, jailbreak: 329.6 },
  { metric: "median chars", benign: 220, jailbreak: 1523 },
];

const CLASS_BALANCE = [
  { name: "benign", value: 516 },
  { name: "jailbreak", value: 515 },
];

const PIE_COLORS = ["#34d399", "#ef4444"];

const STATS = [
  { label: "Prompts analyzed", value: "1,306", sub: "1,044 train · 262 test" },
  { label: "Best accuracy", value: "97.7%", sub: "LR & Random Forest" },
  { label: "Jailbreak recall", value: "96.4%", sub: "safety-critical metric" },
  { label: "Train time", value: "4.4s", sub: "156 MB RAM, no GPU" },
];

/* ===== tiny heatmap cell ===== */
function ConfusionMatrix({ model, verdict, note, matrix }: any) {
  const [tn, fp] = matrix[0];
  const [fn, tp] = matrix[1];
  const max = Math.max(tn, fp, fn, tp);
  const cell = (v: number) => ({
    background:
      v === 0
        ? "rgba(255,255,255,0.03)"
        : `rgba(255,255,255,${0.06 + 0.3 * (v / max)})`,
    color: v === 0 ? "rgba(180,188,208,0.4)" : "#ffffff",
  });

  return (
    <div className={styles.cmCard}>
      <div className={styles.cmHeader}>
        <div>
          <div className={styles.cmTitle}>{model}</div>
          <div className={styles.cmVerdict}>{verdict}</div>
        </div>
        <span className={styles.cmNote}>{note}</span>
      </div>
      <div className={styles.cmGrid}>
        <div className={styles.cmCorner} />
        <div className={styles.cmColLabel}>pred benign</div>
        <div className={styles.cmColLabel}>pred jailbreak</div>
        <div className={styles.cmRowLabel}>actual benign</div>
        <div className={styles.cmCell} style={cell(tn)}>
          {tn}
        </div>
        <div className={styles.cmCell} style={cell(fp)}>
          {fp}
        </div>
        <div className={styles.cmRowLabelDanger}>actual jailbreak</div>
        <div className={`${styles.cmCell} ${styles.cmCellMiss}`} style={cell(fn)}>
          {fn}
        </div>
        <div className={`${styles.cmCell} ${styles.cmCellHit}`} style={cell(tp)}>
          {tp}
        </div>
      </div>
      <div className={styles.cmLegend}>
        <span className={styles.legendHit}>■</span> caught jailbreaks (TP){" "}
        <span className={styles.legendMiss}>■</span> missed (FN — safety risk)
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← back to detector
        </Link>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Model Analytics</h1>
          <p className={styles.subtitle}>
            TF-IDF + classic ML on 1,306 real jailbreak prompts — live numbers
            from the training pipeline
          </p>
        </div>
      </header>

      {/* stat cards */}
      <section className={styles.statsRow}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statSub}>{s.sub}</div>
          </div>
        ))}
      </section>

      {/* class balance + length */}
      <section className={styles.grid2}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Class balance (train)</h2>
          <p className={styles.chartSub}>
            perfectly balanced — no resampling needed
          </p>
          <div className={styles.pieWrap}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={CLASS_BALANCE}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {CLASS_BALANCE.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.pieLegend}>
            <span><i className={styles.dotGreen} /> benign 516 (50.0%)</span>
            <span><i className={styles.dotRed} /> jailbreak 515 (50.0%)</span>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Prompt length: benign vs jailbreak</h2>
          <p className={styles.chartSub}>
            jailbreak prompts are ~7× longer — the strongest EDA signal
          </p>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={LENGTHS} layout="vertical" margin={{ left: 30, right: 20 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#B4BCD0", fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="metric"
                  width={95}
                  tick={{ fill: "#B4BCD0", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(v: any) => Number(v).toLocaleString()}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#B4BCD0" }} />
                <Bar dataKey="benign" name="benign" fill="#34d399" radius={[0, 4, 4, 0]} />
                <Bar dataKey="jailbreak" name="jailbreak" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* model comparison */}
      <section className={styles.grid2}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Overall metrics by model</h2>
          <p className={styles.chartSub}>
            accuracy · macro precision · recall · F1 (%)
          </p>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MODEL_COMPARISON} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="model" tick={{ fill: "#B4BCD0", fontSize: 11 }} interval={0} />
                <YAxis domain={[90, 100]} tick={{ fill: "#B4BCD0", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#B4BCD0" }} />
                <Bar dataKey="accuracy" name="accuracy" fill="#ffffff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="precision" name="precision" fill="#B4BCD0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recall" name="recall" fill="#818CF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="f1" name="F1" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Jailbreak-class metrics (safety)</h2>
          <p className={styles.chartSub}>
            precision · recall · F1 on the jailbreak class only
          </p>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={JAILBREAK_METRICS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="model" tick={{ fill: "#B4BCD0", fontSize: 11 }} interval={0} />
                <YAxis domain={[90, 102]} tick={{ fill: "#B4BCD0", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#B4BCD0" }} />
                <Bar dataKey="precision" name="precision" fill="#B4BCD0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recall" name="recall" fill="#818CF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="f1" name="F1" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* keyword signals */}
      <section className={styles.chartCardFull}>
        <h2 className={styles.chartTitle}>Keyword signals</h2>
        <p className={styles.chartSub}>
          % of prompts in each class containing the keyword — jailbreak-specific
          phrases like <em>“no restrictions”</em> / <em>“previous instructions”</em>{" "}
          appear only in jailbreaks
        </p>
        <div className={styles.chartBody}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={KEYWORDS} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="keyword" tick={{ fill: "#B4BCD0", fontSize: 11 }} interval={0} />
              <YAxis tick={{ fill: "#B4BCD0", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  fontSize: 13,
                }}
                itemStyle={{ color: "#fff" }}
                formatter={(v: any) => `${v}%`}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#B4BCD0" }} />
              <Bar dataKey="jailbreak" name="% of jailbreaks" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benign" name="% of benign" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* confusion matrices */}
      <section className={styles.cmSection}>
        <h2 className={styles.chartTitle}>Confusion matrices (test set, 262 prompts)</h2>
        <p className={styles.chartSub}>
          rows = actual class · cols = predicted — the model is tuned to catch
          jailbreaks (recall-first), so misses are the rare failure
        </p>
        <div className={styles.cmRow}>
          {CONFUSIONS.map((c) => (
            <ConfusionMatrix key={c.model} {...c} />
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        Full pipeline, code and findings:{" "}
        <code className={styles.code}>~/Desktop/ds1/REPORT.md</code>
      </footer>
    </div>
  );
}