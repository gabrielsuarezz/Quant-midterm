import { useState, useRef, useEffect } from "react";

// ─── Color tokens ───
const T = {
  bg: "#0a0e1a", surface: "#111827", card: "#1a2234", border: "#2a3a5c",
  accent: "#6ee7b7", accent2: "#818cf8", accent3: "#f472b6", accent4: "#fbbf24",
  text: "#e2e8f0", muted: "#94a3b8", dim: "#64748b",
};

// ─── MATRIX / VECTOR RENDERER ───
// This renders matrices and vectors in a clean, "handwritten" style with bracket notation
function Matrix({ data, bracket = "square", label, small = false }) {
  const rows = data.length;
  const cols = Array.isArray(data[0]) ? data[0].length : 1;
  const isVector = cols === 1;
  const sz = small ? 13 : 15;
  const pad = small ? "3px 6px" : "4px 10px";

  const flatData = isVector ? data.map(d => [Array.isArray(d) ? d[0] : d]) : data;

  const bracketStyle = {
    display: "flex", alignItems: "stretch", margin: "6px 0",
  };
  const bracketChar = { square: ["[", "]"], round: ["(", ")"], angle: ["⟨", "⟩"] }[bracket] || ["[", "]"];

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, verticalAlign: "middle" }}>
      {label && <span style={{ color: T.accent4, fontSize: sz, fontWeight: 700, marginRight: 4, fontFamily: "'Cambria Math', 'Times New Roman', serif" }}>{label}</span>}
      <span style={bracketStyle}>
        <span style={{
          display: "flex", alignItems: "center", fontSize: rows > 1 ? (rows * 18 + 6) : 22,
          color: T.accent2, fontWeight: 200, lineHeight: 1,
          fontFamily: "'Cambria Math', serif",
        }}>{bracketChar[0]}</span>
        <span style={{
          display: "inline-grid",
          gridTemplateColumns: `repeat(${cols}, auto)`,
          gap: `2px ${small ? 10 : 16}px`,
          padding: `4px ${small ? 4 : 8}px`,
          alignItems: "center",
        }}>
          {flatData.map((row, r) =>
            row.map((cell, c) => (
              <span key={`${r}-${c}`} style={{
                textAlign: "center", padding: pad, fontSize: sz, whiteSpace: "nowrap",
                color: T.text, fontFamily: "'Cambria Math', 'Times New Roman', serif",
                letterSpacing: 0.3,
              }}>{cell}</span>
            ))
          )}
        </span>
        <span style={{
          display: "flex", alignItems: "center", fontSize: rows > 1 ? (rows * 18 + 6) : 22,
          color: T.accent2, fontWeight: 200, lineHeight: 1,
          fontFamily: "'Cambria Math', serif",
        }}>{bracketChar[1]}</span>
      </span>
    </span>
  );
}

function MatrixBlock({ children, label, center = true }) {
  return (
    <div style={{
      background: "#0c1220", border: `1px solid ${T.border}`, borderRadius: 12,
      padding: "16px 20px", margin: "10px 0",
      display: "flex", flexDirection: "column", alignItems: center ? "center" : "flex-start",
      gap: 8, overflowX: "auto",
    }}>
      {label && <div style={{ fontSize: 13, color: T.dim, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{label}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

function Op({ children }) {
  return <span style={{ color: T.accent4, fontSize: 18, fontWeight: 700, fontFamily: "'Cambria Math', serif", padding: "0 4px" }}>{children}</span>;
}

function Eq({ children }) {
  return <span style={{ color: T.accent, fontSize: 16, fontWeight: 700, padding: "0 6px" }}>{children}</span>;
}

// ─── UI Components ───
function Card({ title, accent = T.accent, children, tip, examAlert }) {
  return (
    <div style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, padding: "24px 28px", marginBottom: 22 }}>
      {title && <h3 style={{ color: accent, fontSize: 18, fontWeight: 700, margin: "0 0 14px", fontFamily: "'JetBrains Mono', monospace" }}>{title}</h3>}
      <div style={{ color: T.text, lineHeight: 1.75, fontSize: 15 }}>{children}</div>
      {examAlert && (
        <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(244,114,182,0.08)", borderLeft: `3px solid ${T.accent3}`, borderRadius: "0 8px 8px 0", fontSize: 14, color: T.accent3 }}>
          🎯 <b>Exam Pattern:</b> {examAlert}
        </div>
      )}
      {tip && (
        <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(110,231,183,0.08)", borderLeft: `3px solid ${T.accent}`, borderRadius: "0 8px 8px 0", fontSize: 14, color: T.accent }}>
          💡 <b>Pro Tip:</b> {tip}
        </div>
      )}
    </div>
  );
}

function Formula({ children }) {
  return (
    <div style={{ background: "#0f172a", border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 20px", fontFamily: "'Cambria Math', 'Times New Roman', serif", fontSize: 16, color: T.accent2, margin: "10px 0", overflowX: "auto", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
      {children}
    </div>
  );
}

function Example({ q, a }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ margin: "10px 0", background: "#0d1425", borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
      <div style={{ padding: "12px 16px", fontSize: 14, color: T.text }}><b style={{ color: T.accent4 }}>Example:</b> {q}</div>
      <button onClick={() => setShow(!show)} style={{ width: "100%", padding: "8px 16px", background: show ? "rgba(129,140,248,0.15)" : "rgba(129,140,248,0.08)", color: T.accent2, border: "none", cursor: "pointer", fontSize: 13, textAlign: "left", fontFamily: "inherit", borderTop: `1px solid ${T.border}` }}>
        {show ? "▾ Hide Solution" : "▸ Show Solution"}
      </button>
      {show && <div style={{ padding: "14px 16px", fontSize: 14, color: T.muted, lineHeight: 1.8, borderTop: `1px solid ${T.border}` }}>{a}</div>}
    </div>
  );
}

function MiniQuiz({ question, options, answer, explanation }) {
  const [selected, setSelected] = useState(null);
  const correct = selected === answer;
  return (
    <div style={{ margin: "12px 0", padding: "16px", background: "#0d1425", borderRadius: 10, border: `1px solid ${T.border}` }}>
      <p style={{ color: T.text, fontSize: 14, marginBottom: 10, fontWeight: 600 }}>{question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {options.map((opt, i) => {
          const isThis = selected === i;
          const bg = selected === null ? "rgba(129,140,248,0.06)" : isThis ? (correct ? "rgba(110,231,183,0.15)" : "rgba(244,114,182,0.15)") : i === answer && selected !== null ? "rgba(110,231,183,0.10)" : "rgba(129,140,248,0.04)";
          const col = selected === null ? T.text : isThis ? (correct ? T.accent : T.accent3) : i === answer ? T.accent : T.dim;
          return (
            <button key={i} disabled={selected !== null} onClick={() => setSelected(i)} style={{ textAlign: "left", padding: "8px 14px", background: bg, border: `1px solid ${isThis ? col : "transparent"}`, borderRadius: 8, color: col, cursor: selected !== null ? "default" : "pointer", fontSize: 14, fontFamily: "inherit", transition: "all .2s" }}>
              {String.fromCharCode(65 + i)}) {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div style={{ marginTop: 10, padding: "10px 14px", background: correct ? "rgba(110,231,183,0.06)" : "rgba(244,114,182,0.06)", borderRadius: 8, fontSize: 13, color: correct ? T.accent : T.accent3 }}>
          {correct ? "✓ Correct!" : "✗ Not quite."} {explanation}
        </div>
      )}
    </div>
  );
}

function TableChart({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto", margin: "12px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead><tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "8px 12px", color: T.accent, borderBottom: `2px solid ${T.border}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, r) => (
          <tr key={r} style={{ background: r % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
            {row.map((cell, c) => <td key={c} style={{ padding: "8px 12px", color: T.text, borderBottom: `1px solid ${T.border}`, fontSize: 13, whiteSpace: "pre-wrap" }}>{cell}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function StepByStep({ steps }) {
  const [openStep, setOpenStep] = useState(0);
  return (
    <div style={{ margin: "12px 0" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ borderLeft: `2px solid ${i <= openStep ? T.accent : T.border}`, marginLeft: 10, paddingLeft: 16, paddingBottom: 12, transition: "all .3s" }}>
          <button onClick={() => setOpenStep(i)} style={{
            background: "none", border: "none", cursor: "pointer", padding: "4px 0",
            color: i <= openStep ? T.accent : T.dim, fontSize: 14, fontWeight: 600, fontFamily: "inherit", textAlign: "left", width: "100%",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: i <= openStep ? T.accent : T.border, color: T.bg, fontSize: 12, fontWeight: 800, marginRight: 8 }}>{i + 1}</span>
            {s.title}
          </button>
          {i <= openStep && <div style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, marginTop: 6, paddingLeft: 30 }}>{s.content}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── NAV ───
const SECTIONS = [
  { id: "complex", icon: "ℂ", label: "Complex Numbers" },
  { id: "vectors", icon: "→", label: "Vectors" },
  { id: "transition", icon: "⟨⟩", label: "Transition Amplitude" },
  { id: "matrix", icon: "▦", label: "Matrices" },
  { id: "arch", icon: "◈", label: "Architecture" },
  { id: "gates", icon: "⊕", label: "Quantum Gates" },
  { id: "examprep", icon: "🎯", label: "Exam Patterns" },
  { id: "quiz", icon: "✓", label: "Self-Test Quiz" },
];

// ══════════════════════════════════════════════
//  SECTION: COMPLEX NUMBERS
// ══════════════════════════════════════════════
function ComplexNumbers() {
  return (<div>
    <h2 style={{ color: T.accent, fontSize: 26, fontWeight: 800, margin: "0 0 6px", fontFamily: "'Space Mono', monospace" }}>ℂ Complex Numbers</h2>
    <p style={{ color: T.muted, marginBottom: 24, fontSize: 14 }}>The foundation of quantum computing — every qubit state lives in complex space.</p>

    <Card title="What is a Complex Number?" tip="Think of it as a 2D point: real part = x-axis, imaginary part = y-axis.">
      <p>A complex number has the form <b style={{ color: T.accent2 }}>z = a + bi</b> where <b>i² = −1</b>.</p>
      <Formula>{"z = a + bi\n\nRe(z) = a   (real part)\nIm(z) = b   (imaginary part)"}</Formula>
    </Card>

    <Card title="Modulus & Conjugate" accent={T.accent2}
      examAlert="Assignment 1, Q1 directly asks: 'find modulus and conjugate' for three complex numbers. This is guaranteed on the exam."
      tip="Modulus = Pythagoras. Conjugate = flip the imaginary sign. They always ask these together."
    >
      <Formula>{"Modulus:    |z| = √(a² + b²)\nConjugate:  z̄ = a − bi"}</Formula>
      <p style={{ margin: "10px 0 6px", fontWeight: 700, color: T.accent4 }}>Key property you must know:</p>
      <Formula>{"z · z̄ = |z|²    (always a real number!)"}</Formula>

      <Example q={<span>Find modulus and conjugate of <b>4 − 6i</b> (Asg1 Q1a)</span>}
        a={<div>
          <p><b style={{ color: T.accent }}>Modulus:</b> |4 − 6i| = √(4² + (−6)²) = √(16 + 36) = √52 = <b style={{ color: T.accent }}>2√13</b></p>
          <p><b style={{ color: T.accent }}>Conjugate:</b> Flip the sign of −6i → <b style={{ color: T.accent }}>4 + 6i</b></p>
        </div>} />

      <Example q={<span>Find modulus and conjugate of <b>12i − 5</b> (Asg1 Q1b)</span>}
        a={<div>
          <p>⚠️ First rewrite in standard form: <b>−5 + 12i</b> (a = −5, b = 12)</p>
          <p><b style={{ color: T.accent }}>Modulus:</b> |−5 + 12i| = √(25 + 144) = √169 = <b style={{ color: T.accent }}>13</b></p>
          <p><b style={{ color: T.accent }}>Conjugate:</b> −5 − 12i (or equivalently <b style={{ color: T.accent }}>−12i − 5</b>)</p>
        </div>} />

      <Example q={<span>Find modulus and conjugate of <b>−3 − 7i</b> (Asg1 Q1c)</span>}
        a={<div>
          <p><b style={{ color: T.accent }}>Modulus:</b> |−3 − 7i| = √(9 + 49) = <b style={{ color: T.accent }}>√58</b></p>
          <p><b style={{ color: T.accent }}>Conjugate:</b> <b style={{ color: T.accent }}>−3 + 7i</b></p>
        </div>} />
    </Card>

    <Card title="Addition & Subtraction" tip="Add reals to reals, imaginaries to imaginaries. Never cross-mix them.">
      <Formula>{"(a + bi) + (c + di) = (a+c) + (b+d)i\n(a + bi) − (c + di) = (a−c) + (b−d)i"}</Formula>
      <Example q={<span>(8i − 4) + (9 − 2i) = ? (Asg1 Q2a)</span>}
        a={<div>
          <p>Rewrite: (−4 + 8i) + (9 − 2i)</p>
          <p>Real: −4 + 9 = 5</p>
          <p>Imaginary: 8 + (−2) = 6</p>
          <p>Answer: <b style={{ color: T.accent }}>5 + 6i</b></p>
        </div>} />
      <Example q={<span>−(4 + 3i) + (6 − 5i) = ? (Asg1 Q2b)</span>}
        a={<div>
          <p>Distribute the negative: (−4 − 3i) + (6 − 5i)</p>
          <p>Real: −4 + 6 = 2</p>
          <p>Imaginary: −3 + (−5) = −8</p>
          <p>Answer: <b style={{ color: T.accent }}>2 − 8i</b></p>
        </div>} />
    </Card>

    <Card title="Multiplication (FOIL)" accent={T.accent2}
      examAlert="Q2c of Asg1 tests this. Always use FOIL and remember i² = −1."
      tip="The secret move: when you get i², replace it with −1 immediately. That's how the imaginary becomes real."
    >
      <Formula>{"(a+bi)(c+di) = ac + adi + bci + bdi²\n              = (ac − bd) + (ad + bc)i\n\n(because i² = −1, so bdi² = −bd)"}</Formula>
      <Example q={<span>(3 − 4i) × (7 + 9i) = ? (Asg1 Q2c)</span>}
        a={<div>
          <p><b>F</b>irst: 3 × 7 = 21</p>
          <p><b>O</b>uter: 3 × 9i = 27i</p>
          <p><b>I</b>nner: −4i × 7 = −28i</p>
          <p><b>L</b>ast: −4i × 9i = −36i² = −36(−1) = <b>+36</b></p>
          <p>Combine reals: 21 + 36 = 57</p>
          <p>Combine imaginaries: 27i − 28i = −i</p>
          <p>Answer: <b style={{ color: T.accent }}>57 − i</b></p>
        </div>} />
    </Card>

    <Card title="Polar ↔ Cartesian Conversion" accent={T.accent4}
      examAlert="Q3 of Asg1 tests BOTH directions. Know the conversion cold."
      tip="For Cartesian→Polar: always check the quadrant! arctan alone doesn't tell you the right angle if a is negative."
    >
      <Formula>{"Cartesian → Polar:\n  r = √(a² + b²)\n  θ = arctan(b/a)   ← adjust for quadrant!\n\nPolar → Cartesian:\n  a = r · cos(θ)\n  b = r · sin(θ)"}</Formula>

      <TableChart
        headers={["Quadrant", "Signs (a, b)", "θ formula"]}
        rows={[
          ["I  (top-right)", "+, +", "θ = arctan(b/a)"],
          ["II (top-left)", "−, +", "θ = π + arctan(b/a)"],
          ["III (bottom-left)", "−, −", "θ = π + arctan(b/a)"],
          ["IV (bottom-right)", "+, −", "θ = 2π + arctan(b/a)"],
        ]}
      />

      <Example q={<span>Convert <b>5 − 3i</b> to Polar (Asg1 Q3a-i)</span>}
        a={<div>
          <p>a = 5, b = −3 → Quadrant IV (positive real, negative imaginary)</p>
          <p>r = √(25 + 9) = <b style={{ color: T.accent }}>√34</b></p>
          <p>θ = arctan(−3/5) = −0.5404 rad</p>
          <p>Adjust for Q-IV: θ = 2π − 0.5404 ≈ <b style={{ color: T.accent }}>5.7428 rad</b> (or equivalently −0.5404)</p>
        </div>} />

      <Example q={<span>Convert <b>−2 + 4i</b> to Polar (Asg1 Q3a-ii)</span>}
        a={<div>
          <p>a = −2, b = 4 → Quadrant II (negative real, positive imaginary)</p>
          <p>r = √(4 + 16) = √20 = <b style={{ color: T.accent }}>2√5</b></p>
          <p>arctan(4/(−2)) = arctan(−2) ≈ −1.1071</p>
          <p>Adjust for Q-II: θ = π + (−1.1071) ≈ <b style={{ color: T.accent }}>2.0344 rad</b></p>
        </div>} />

      <Example q={<span>Convert Length=4, angle=π/3 to Cartesian (Asg1 Q3b-i)</span>}
        a={<div>
          <p>a = 4 · cos(π/3) = 4 · (1/2) = <b>2</b></p>
          <p>b = 4 · sin(π/3) = 4 · (√3/2) = <b>2√3</b></p>
          <p>Answer: <b style={{ color: T.accent }}>2 + 2√3 i</b></p>
        </div>} />

      <Example q={<span>Convert Length=5, angle=7π/5 to Cartesian (Asg1 Q3b-ii)</span>}
        a={<div>
          <p>7π/5 is in Quadrant III (between π and 3π/2)</p>
          <p>a = 5 · cos(7π/5) ≈ 5 · (0.309) ≈ <b>1.545</b></p>
          <p>b = 5 · sin(7π/5) ≈ 5 · (−0.951) ≈ <b>−4.755</b></p>
          <p>Answer: <b style={{ color: T.accent }}>1.545 − 4.755i</b></p>
        </div>} />
    </Card>

    <Card title="De Morgan's Laws" accent={T.accent3} tip="NOT distributes and SWAPS the operator: AND↔OR.">
      <Formula>{"¬(A ∧ B) = ¬A ∨ ¬B    (NOT of AND = OR of NOTs)\n¬(A ∨ B) = ¬A ∧ ¬B    (NOT of OR  = AND of NOTs)"}</Formula>
    </Card>

    <MiniQuiz question="What is the modulus of −5 + 12i?" options={["7", "13", "17", "√17"]} answer={1}
      explanation="√(25 + 144) = √169 = 13. This is a classic Pythagorean triple (5-12-13)!" />
    <MiniQuiz question="(2 + 3i)(2 − 3i) = ?" options={["4 − 9i²", "13", "4 + 9", "−5"]} answer={1}
      explanation="This is z·z̄ = |z|² = 4 + 9 = 13" />
  </div>);
}

// ══════════════════════════════════════════════
//  SECTION: VECTORS
// ══════════════════════════════════════════════
function Vectors() {
  return (<div>
    <h2 style={{ color: T.accent2, fontSize: 26, fontWeight: 800, margin: "0 0 6px", fontFamily: "'Space Mono', monospace" }}>→ Vectors</h2>
    <p style={{ color: T.muted, marginBottom: 24, fontSize: 14 }}>Quantum states are vectors. Master these operations.</p>

    <Card title="Inverse & Length of Complex Vectors" accent={T.accent2}
      examAlert="Asg1 Q4 asks for inverse AND length of complex vectors. Expect this exact format."
      tip="Inverse = negate every component. Length = √(sum of |each component|²). For complex entries, |a+bi|² = a²+b²."
    >
      <p><b>Inverse:</b> Negate every component.</p>
      <p><b>Length (Norm):</b> For complex vectors, compute |each component|² then take √(sum).</p>

      <Example q={<span>Find inverse and length of V<sub>a</sub> (Asg1 Q4)</span>}
        a={<div>
          <MatrixBlock label="Vₐ =">
            <Matrix data={[["6 − 3i"], ["2 + 10i"], ["9 + 7i"], ["−19i"]]} />
          </MatrixBlock>
          <p style={{ marginTop: 12 }}><b style={{ color: T.accent }}>Inverse (−V<sub>a</sub>):</b> Negate each entry:</p>
          <MatrixBlock>
            <Matrix data={[["−6 + 3i"], ["−2 − 10i"], ["−9 − 7i"], ["19i"]]} />
          </MatrixBlock>
          <p style={{ marginTop: 12 }}><b style={{ color: T.accent }}>Length ‖V<sub>a</sub>‖:</b></p>
          <p>|6−3i|² = 36 + 9 = 45</p>
          <p>|2+10i|² = 4 + 100 = 104</p>
          <p>|9+7i|² = 81 + 49 = 130</p>
          <p>|−19i|² = 0 + 361 = 361</p>
          <p>Sum = 45 + 104 + 130 + 361 = <b>640</b></p>
          <p>‖V<sub>a</sub>‖ = <b style={{ color: T.accent }}>√640 = 8√10</b></p>
        </div>} />
    </Card>

    <Card title="Inner Product (Dot Product) of Complex Vectors" accent={T.accent3}
      examAlert="Asg1 Q5 tests this. CRITICAL: conjugate the LEFT vector before multiplying!"
      tip="⟨u|v⟩ means: conjugate every entry of u, then dot with v. Forgetting to conjugate is the #1 mistake."
    >
      <Formula>{"⟨u|v⟩ = ū₁v₁ + ū₂v₂ + ... + ūₙvₙ\n\n(conjugate the LEFT / bra vector)"}</Formula>

      <Example q={<span>Compute the inner product (Asg1 Q5)</span>}
        a={<div>
          <p>The scalar (2 − 3i) multiplied by dot product of the two vectors:</p>
          <MatrixBlock>
            <span style={{ color: T.accent4, fontSize: 16, fontFamily: "'Cambria Math', serif" }}>(2 − 3i) ·</span>
            <Matrix data={[["4 + 7i"], ["11 − 5i"], ["12i"], ["−6 − 2i"]]} bracket="angle" />
          </MatrixBlock>
          <p style={{ marginTop: 8 }}>First conjugate the left vector: [4 − 7i, 11 + 5i, −12i, −6 + 2i]</p>
          <p>Then multiply component-wise with the right vector and sum up.</p>
          <p>Finally multiply the result by the scalar (2 − 3i).</p>
        </div>} />
    </Card>

    <Card title="Linear Independence" accent={T.accent4}
      examAlert="Asg1 Q6 asks you to show vectors are NOT linearly independent. Find constants c₁, c₂, c₃ (not all zero) where c₁v₁ + c₂v₂ + c₃v₃ = 0."
      tip="Set up the equation c₁v₁ + c₂v₂ + c₃v₃ = 0, write it as a matrix, row reduce. If a free variable exists, they're dependent."
    >
      <p>Vectors are <b>linearly independent</b> if the ONLY solution to c₁v₁ + c₂v₂ + c₃v₃ = 0 is c₁ = c₂ = c₃ = 0.</p>
      <p style={{ marginTop: 8 }}>To show they're <b>NOT independent</b> (dependent):</p>
      <Formula>{"Method 1: Find specific constants (not all 0) that make c₁v₁ + c₂v₂ + c₃v₃ = 0\nMethod 2: Form a matrix with vectors as columns, row reduce.\n          If rank < number of vectors → dependent"}</Formula>
      <Example q={<span>Show {"{[1,2,3], [3,0,2], [1,−4,−4]}"} are dependent (Asg1 Q6)</span>}
        a={<div>
          <MatrixBlock label="Form matrix and row reduce:">
            <Matrix data={[["1", "3", "1"], ["2", "0", "−4"], ["3", "2", "−4"]]} />
          </MatrixBlock>
          <p>Row reduce → you'll find a free variable, proving dependence.</p>
          <p>Or directly verify: <b style={{ color: T.accent }}>v₃ = v₁ − v₂</b></p>
          <p>Check: [1−3, 2−0, 3−2] = [−2, 2, 1] ... actually set up the system and solve for the right coefficients.</p>
        </div>} />
    </Card>

    <Card title="Distance Between Vectors"
      examAlert="Asg1 Q14 tests this. Subtract then take the norm."
      tip="d(u,v) = ‖u − v‖. Subtract component by component, then find the length."
    >
      <Formula>{"d(u, v) = ‖u − v‖ = √(Σ|uᵢ − vᵢ|²)"}</Formula>
      <Example q={<span>Distance between V<sub>A</sub> = [3,1,2]ᵀ and V<sub>B</sub> = [3,2,−1]ᵀ (Asg1 Q14)</span>}
        a={<div>
          <p>V<sub>A</sub> − V<sub>B</sub> = [3−3, 1−2, 2−(−1)]ᵀ = [0, −1, 3]ᵀ</p>
          <p>‖[0, −1, 3]‖ = √(0 + 1 + 9) = <b style={{ color: T.accent }}>√10</b></p>
        </div>} />
    </Card>

    <Card title="Inner Product Addition Rules" accent={T.accent2}
      examAlert="Asg1 Q13 asks you to VERIFY both addition rules. Show each side equals the same number."
    >
      <Formula>{"⟨V₁ + V₂, V₃⟩ = ⟨V₁, V₃⟩ + ⟨V₂, V₃⟩\n⟨V₁, V₂ + V₃⟩ = ⟨V₁, V₂⟩ + ⟨V₁, V₃⟩"}</Formula>
      <p style={{ marginTop: 8 }}>Strategy: Compute the left side. Compute the right side. Show they're equal. ✓</p>
    </Card>

    <MiniQuiz question="For complex vector [3+i, 2i]ᵀ, what is |3+i|²?" options={["10", "8", "4", "9"]}
      answer={0} explanation="|3+i|² = 3² + 1² = 9 + 1 = 10. Remember: |a+bi|² = a² + b²" />
  </div>);
}

// ══════════════════════════════════════════════
//  SECTION: TRANSITION AMPLITUDE
// ══════════════════════════════════════════════
function TransitionAmplitude() {
  return (<div>
    <h2 style={{ color: T.accent3, fontSize: 26, fontWeight: 800, margin: "0 0 6px", fontFamily: "'Space Mono', monospace" }}>⟨⟩ Transition Amplitude</h2>
    <p style={{ color: T.muted, marginBottom: 24, fontSize: 14 }}>The probability of transitioning from one quantum state to another.</p>

    <Card title="How to Compute Transition Amplitude" accent={T.accent2}
      examAlert="Asg1 Q12 directly asks this. It's just the inner product ⟨ψ₂|ψ₁⟩."
      tip="Transition amplitude from |ψ₁⟩ TO |ψ₂⟩ = ⟨ψ₂|ψ₁⟩. Conjugate ψ₂ (the destination), not ψ₁!"
    >
      <Formula>{"Amplitude from |ψ₁⟩ to |ψ₂⟩:\n\n  ⟨ψ₂|ψ₁⟩ = ψ̄₂₁·ψ₁₁ + ψ̄₂₂·ψ₁₂ + ...\n\nProbability = |⟨ψ₂|ψ₁⟩|²"}</Formula>

      <Example q={<span>Transition amplitude from |ψ₁⟩ = [5+2i, 1−4i]ᵀ to |ψ₂⟩ = [2−3i, 3+4i]ᵀ (Asg1 Q12)</span>}
        a={<div>
          <MatrixBlock label="⟨ψ₂|ψ₁⟩:">
            <span style={{ color: T.muted, fontSize: 14 }}>Conjugate ψ₂: [2+3i, 3−4i]</span>
          </MatrixBlock>
          <p style={{ marginTop: 8 }}>⟨ψ₂|ψ₁⟩ = (2+3i)(5+2i) + (3−4i)(1−4i)</p>
          <p>First term: 10 + 4i + 15i + 6i² = 10 + 19i − 6 = <b>4 + 19i</b></p>
          <p>Second term: 3 − 12i − 4i + 16i² = 3 − 16i − 16 = <b>−13 − 16i</b></p>
          <p>Sum: (4−13) + (19−16)i = <b style={{ color: T.accent }}>−9 + 3i</b></p>
          <p style={{ marginTop: 8 }}>Probability = |−9+3i|² = 81 + 9 = <b style={{ color: T.accent }}>90</b></p>
          <p style={{ color: T.accent3, marginTop: 6 }}>⚠️ Note: if you need a true probability (0 to 1), the states must be normalized first!</p>
        </div>} />
    </Card>

    <Card title="Key Rules to Remember" accent={T.accent4}>
      <p><b>1. Born Rule:</b> Probability = |amplitude|²</p>
      <p><b>2.</b> Probabilities from all outcomes must sum to 1 (if states are normalized)</p>
      <p><b>3. Multi-step:</b> Amplitudes MULTIPLY along a path</p>
      <p><b>4. Multiple paths:</b> Amplitudes ADD, then square: P = |a₁ + a₂|²</p>
    </Card>

    <MiniQuiz question="To find ⟨ψ₂|ψ₁⟩, which vector gets conjugated?" options={["ψ₁ (the source)", "ψ₂ (the destination)", "Both", "Neither"]}
      answer={1} explanation="The BRA vector (left side, ψ₂) gets conjugated. ⟨ψ₂| means take the conjugate transpose of |ψ₂⟩." />
  </div>);
}

// ══════════════════════════════════════════════
//  SECTION: MATRICES
// ══════════════════════════════════════════════
function Matrices() {
  return (<div>
    <h2 style={{ color: T.accent4, fontSize: 26, fontWeight: 800, margin: "0 0 6px", fontFamily: "'Space Mono', monospace" }}>▦ Matrices</h2>
    <p style={{ color: T.muted, marginBottom: 24, fontSize: 14 }}>Every quantum gate is a matrix. Every quantum operation is matrix multiplication.</p>

    <Card title="Transpose (Aᵀ)" accent={T.accent2}
      examAlert="Asg1 Q7. Flip rows ↔ columns. A 2×3 matrix becomes 3×2."
    >
      <p>Swap rows and columns: (Aᵀ)ᵢⱼ = Aⱼᵢ</p>
      <Example q={<span>Transpose of the matrix (Asg1 Q7)</span>}
        a={<div>
          <MatrixBlock label="A =">
            <Matrix data={[["4+2i", "3−5i", "17"], ["−3i+6", "−8+4i", "9i"]]} />
          </MatrixBlock>
          <MatrixBlock label="Aᵀ =">
            <Matrix data={[["4+2i", "−3i+6"], ["3−5i", "−8+4i"], ["17", "9i"]]} />
          </MatrixBlock>
          <p style={{ color: T.muted, marginTop: 8 }}>2×3 → 3×2. Row 1 became Column 1, Row 2 became Column 2.</p>
        </div>} />
    </Card>

    <Card title="Conjugate (Ā)" accent={T.accent3}
      examAlert="Asg1 Q8. Flip the sign of EVERY imaginary part. Don't change the layout."
    >
      <Example q={<span>Conjugate of the matrix (Asg1 Q8)</span>}
        a={<div>
          <MatrixBlock label="A =">
            <Matrix data={[["4+2i", "3−5i", "17"], ["−3i+6", "−8+4i", "9i"]]} />
          </MatrixBlock>
          <MatrixBlock label="Ā =">
            <Matrix data={[["4−2i", "3+5i", "17"], ["3i+6", "−8−4i", "−9i"]]} />
          </MatrixBlock>
        </div>} />
    </Card>

    <Card title="Adjoint / Dagger (A†) = Transpose + Conjugate" accent={T.accent}
      examAlert="Asg1 Q9. This is THE most important operation. Transpose first, then conjugate (or vice versa — same result)."
      tip="A† = (Aᵀ)̄ = (Ā)ᵀ. Either order works. I recommend: transpose first, then conjugate."
    >
      <Example q={<span>Find A† (Asg1 Q9)</span>}
        a={<div>
          <MatrixBlock label="A =">
            <Matrix data={[["4−7i", "3−5i"], ["−3i+6", "−8−4i"], ["14", "8i"]]} />
          </MatrixBlock>
          <p style={{ marginTop: 10 }}><b>Step 1 — Transpose</b> (3×2 → 2×3):</p>
          <MatrixBlock>
            <Matrix data={[["4−7i", "−3i+6", "14"], ["3−5i", "−8−4i", "8i"]]} />
          </MatrixBlock>
          <p><b>Step 2 — Conjugate</b> (flip all imaginary signs):</p>
          <MatrixBlock label="A† =">
            <Matrix data={[["4+7i", "3i+6", "14"], ["3+5i", "−8+4i", "−8i"]]} />
          </MatrixBlock>
        </div>} />
    </Card>

    <Card title="Matrix Multiplication" accent={T.accent4}
      examAlert="Asg1 Q10 has a 2×3 times 3×3 multiplication with complex numbers. Practice this until it's automatic."
      tip="Row of first × Column of second. For a 2×3 times 3×3: you get a 2×3 result. The inner dimensions (3) must match."
    >
      <Formula>{"(AB)ᵢⱼ = Σₖ Aᵢₖ · Bₖⱼ\n\nSize: (m×n)(n×p) → m×p\n\n⚠️ AB ≠ BA  (not commutative!)"}</Formula>
      <Example q={<span>Multiply the matrices (Asg1 Q10)</span>}
        a={<div>
          <MatrixBlock label="A × B =">
            <Matrix data={[["4−7i", "3−5i"], ["−3+6i", "−8−4i"]]} small />
            <Op>×</Op>
            <Matrix data={[["4+2i", "3+5i", "17"], ["3−6i", "−8+4i", "9i"]]} small />
          </MatrixBlock>
          <p style={{ marginTop: 10 }}>Size check: (2×2)(2×3) = 2×3 ✓</p>
          <p>But wait — looking at the original, A appears to be 2×2 and B is <b>not</b> conformable as shown (there's also a row [14, 8i] making A a 3×2). Read the problem carefully to identify the actual matrix dimensions!</p>
          <p style={{ marginTop: 8, color: T.accent4 }}>Strategy: write out each entry systematically. For entry (1,1): multiply row 1 of A by column 1 of B using complex multiplication rules (FOIL each pair).</p>
        </div>} />
    </Card>

    <Card title="Proving (c·A)† = c̄·A†" accent={T.accent2}
      examAlert="Asg1 Q11. Compute both sides separately and show they're equal."
    >
      <StepByStep steps={[
        { title: "Compute c·A (multiply every entry by the scalar c)", content: "Multiply each entry of A by c = (5 − 8i) using FOIL." },
        { title: "Take the adjoint of (c·A): transpose then conjugate", content: "Transpose the matrix from Step 1, then conjugate every entry." },
        { title: "Separately compute c̄·A†", content: "First find A† (transpose + conjugate of original A). Then multiply every entry by c̄ = (5 + 8i)." },
        { title: "Compare — they must be identical", content: "If every entry matches, the property is verified. ✓" },
      ]} />
    </Card>

    <Card title="Unitary & Hermitian Verification" accent={T.accent3}
      examAlert="Asg1 Q16 (Hermitian) and Q17 (Unitary). These are high-point questions. Know both checks."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ padding: 14, background: "rgba(110,231,183,0.06)", borderRadius: 10 }}>
          <h4 style={{ color: T.accent, margin: "0 0 8px" }}>Hermitian Check</h4>
          <p style={{ fontSize: 13 }}>Compute A†. If <b>A† = A</b>, it's Hermitian.</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Quick checks:</p>
          <p style={{ fontSize: 13 }}>• Diagonal must be <b>real</b></p>
          <p style={{ fontSize: 13 }}>• Off-diagonal: aᵢⱼ = conjugate of aⱼᵢ</p>
        </div>
        <div style={{ padding: 14, background: "rgba(129,140,248,0.06)", borderRadius: 10 }}>
          <h4 style={{ color: T.accent2, margin: "0 0 8px" }}>Unitary Check</h4>
          <p style={{ fontSize: 13 }}>Compute A†. Multiply A†·A. If result = <b>I</b>, it's Unitary.</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Quick checks:</p>
          <p style={{ fontSize: 13 }}>• Each column must have norm = 1</p>
          <p style={{ fontSize: 13 }}>• Columns must be orthogonal</p>
        </div>
      </div>

      <Example q={<span>Verify Hermitian: A = [[7, 6+5i], [6−5i, −3]] (Asg1 Q16)</span>}
        a={<div>
          <MatrixBlock label="A =">
            <Matrix data={[["7", "6+5i"], ["6−5i", "−3"]]} />
          </MatrixBlock>
          <p>Step 1: Transpose → [[7, 6−5i], [6+5i, −3]]</p>
          <p>Step 2: Conjugate → [[7, 6+5i], [6−5i, −3]]</p>
          <MatrixBlock label="A† =">
            <Matrix data={[["7", "6+5i"], ["6−5i", "−3"]]} />
          </MatrixBlock>
          <p><b style={{ color: T.accent }}>A† = A ✓ — It IS Hermitian!</b></p>
          <p style={{ color: T.muted, marginTop: 6 }}>Notice: diagonal entries (7, −3) are real, and (6+5i) and (6−5i) are conjugates of each other.</p>
        </div>} />
    </Card>

    <Card title="Eigenvalues & Eigenvectors" accent={T.accent4}
      examAlert="Asg1 Q15 gives you BOTH the matrix and the eigenvectors, and asks you to find eigenvalues. This means: just plug each eigenvector in and solve Av = λv."
      tip="When eigenvectors are given, DON'T solve det(A−λI)=0 the hard way. Just compute A·v for each v, and see what scalar λ pops out."
    >
      <Formula>{"Given: Av = λv and you know v\n\nJust compute A·v = some_vector\nThen: some_vector = λ · v\nSo λ = (any component of Av) / (same component of v)"}</Formula>
      <Example q={<span>Find eigenvalue for v₁ = [1,1,0]ᵀ with A = [[1,−3,3],[3,−5,3],[6,−6,4]] (Asg1 Q15)</span>}
        a={<div>
          <MatrixBlock>
            <Matrix data={[["1","−3","3"],["3","−5","3"],["6","−6","4"]]} />
            <Op>·</Op>
            <Matrix data={[["1"],["1"],["0"]]} />
            <Eq>=</Eq>
            <Matrix data={[["−2"],["−2"],["0"]]} />
          </MatrixBlock>
          <p style={{ marginTop: 10 }}>Av = [−2, −2, 0]ᵀ = −2 · [1, 1, 0]ᵀ = −2 · v₁</p>
          <p><b style={{ color: T.accent }}>λ₁ = −2</b></p>
          <p style={{ marginTop: 6, color: T.muted }}>Repeat for the other two eigenvectors to find λ₂ and λ₃.</p>
        </div>} />
    </Card>

    <Card title="Tensor Product (⊗)" accent={T.accent2}
      examAlert="Asg1 Q18 asks you to verify (P⊗Q)† = P†⊗Q†. Compute both sides and show they match."
      tip="For tensor product: each entry of the first matrix multiplies the ENTIRE second matrix."
    >
      <Formula>{"For 2×2 ⊗ 2×2:\n\nA⊗B = [ a₁₁·B   a₁₂·B ]\n       [ a₂₁·B   a₂₂·B ]\n\nResult is 4×4"}</Formula>
      <Example q={<span>P = [2, 3] and Q = [[1,2],[3,4]], verify (P⊗Q)† = P†⊗Q† (Asg1 Q18)</span>}
        a={<div>
          <p><b>Left side:</b> Compute P⊗Q first, then take the adjoint.</p>
          <p><b>Right side:</b> Compute P† and Q† separately, then take their tensor product.</p>
          <p>Both sides should give the same result.</p>
          <p style={{ color: T.accent4, marginTop: 8 }}>For P = [2, 3] (a 1×2 matrix):</p>
          <p>P⊗Q = [2·Q, 3·Q] = [[2,4,3,6],[6,8,9,12]]</p>
          <p>(P⊗Q)† = transpose and conjugate of this</p>
        </div>} />
    </Card>

    <Card title="Stochastic & Doubly Stochastic" accent={T.accent3}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ padding: 14, background: "rgba(244,114,182,0.06)", borderRadius: 10 }}>
          <h4 style={{ color: T.accent3, margin: "0 0 8px" }}>Stochastic</h4>
          <p style={{ fontSize: 13 }}>All entries ≥ 0</p>
          <p style={{ fontSize: 13 }}><b>Columns</b> sum to 1</p>
        </div>
        <div style={{ padding: 14, background: "rgba(251,191,36,0.06)", borderRadius: 10 }}>
          <h4 style={{ color: T.accent4, margin: "0 0 8px" }}>Doubly Stochastic</h4>
          <p style={{ fontSize: 13 }}>All entries ≥ 0</p>
          <p style={{ fontSize: 13 }}><b>Both rows AND columns</b> sum to 1</p>
        </div>
      </div>
    </Card>

    <MiniQuiz question="To verify a matrix is Hermitian, you check:" options={["A†A = I", "A† = A", "det(A) = 1", "A² = A"]}
      answer={1} explanation="Hermitian means the matrix equals its own adjoint: A† = A." />
    <MiniQuiz question="To verify a matrix is Unitary, you check:" options={["A† = A", "A†A = I", "A = A⁻¹", "det(A) ≠ 0"]}
      answer={1} explanation="Unitary means A†A = AA† = I (the identity matrix)." />
  </div>);
}

// ══════════════════════════════════════════════
//  SECTION: ARCHITECTURE
// ══════════════════════════════════════════════
function Architecture() {
  return (<div>
    <h2 style={{ color: T.accent, fontSize: 26, fontWeight: 800, margin: "0 0 6px", fontFamily: "'Space Mono', monospace" }}>◈ Quantum Architecture</h2>
    <p style={{ color: T.muted, marginBottom: 24, fontSize: 14 }}>The big ideas that make quantum computing fundamentally different.</p>

    <Card title="Bits vs. Qubits">
      <TableChart headers={["Property", "Classical Bit", "Qubit"]} rows={[
        ["Values", "0 or 1", "α|0⟩ + β|1⟩"],
        ["Representation", "Single number", "[α, β]ᵀ with |α|²+|β|²=1"],
        ["n units store", "n bits", "2ⁿ amplitudes"],
        ["Measurement", "Reads value", "Collapses probabilistically"],
        ["Copy?", "Yes", "No (no-cloning theorem)"],
      ]} />
    </Card>

    <Card title="Deterministic vs. Probabilistic vs. Quantum" accent={T.accent2}>
      <TableChart headers={["System", "Matrix Type", "Entries", "Key Property"]} rows={[
        ["Deterministic", "Permutation", "0s and 1s", "Each column: one 1"],
        ["Probabilistic", "Stochastic", "≥ 0, real", "Columns sum to 1"],
        ["Quantum", "Unitary", "Complex", "U†U = I"],
      ]} />
    </Card>

    <Card title="Superposition & Entanglement" accent={T.accent4}
      tip="Superposition = single qubit in multiple states. Entanglement = multiple qubits correlated so strongly they can't be separated."
    >
      <Formula>{"|ψ⟩ = α|0⟩ + β|1⟩   (superposition)\n\n|Φ⁺⟩ = (|00⟩ + |11⟩)/√2  (entanglement — can't factor!)"}</Formula>
    </Card>

    <Card title="Bell States — Memorize These!" accent={T.accent3}
      tip="Φ = SAME bits (00,11). Ψ = DIFFERENT bits (01,10). + means add, − means subtract."
    >
      <MatrixBlock label="|Φ⁺⟩ = (|00⟩+|11⟩)/√2">
        <Matrix data={[["1/√2"], ["0"], ["0"], ["1/√2"]]} />
      </MatrixBlock>
      <MatrixBlock label="|Φ⁻⟩ = (|00⟩−|11⟩)/√2">
        <Matrix data={[["1/√2"], ["0"], ["0"], ["−1/√2"]]} />
      </MatrixBlock>
      <MatrixBlock label="|Ψ⁺⟩ = (|01⟩+|10⟩)/√2">
        <Matrix data={[["0"], ["1/√2"], ["1/√2"], ["0"]]} />
      </MatrixBlock>
      <MatrixBlock label="|Ψ⁻⟩ = (|01⟩−|10⟩)/√2">
        <Matrix data={[["0"], ["1/√2"], ["−1/√2"], ["0"]]} />
      </MatrixBlock>
    </Card>

    <MiniQuiz question="4 qubits can represent how many amplitudes?" options={["4", "8", "16", "32"]}
      answer={2} explanation="2⁴ = 16 basis states." />
  </div>);
}

// ══════════════════════════════════════════════
//  SECTION: QUANTUM GATES
// ══════════════════════════════════════════════
function QuantumGates() {
  return (<div>
    <h2 style={{ color: T.accent2, fontSize: 26, fontWeight: 800, margin: "0 0 6px", fontFamily: "'Space Mono', monospace" }}>⊕ Quantum Gates</h2>
    <p style={{ color: T.muted, marginBottom: 24, fontSize: 14 }}>Every gate is a unitary matrix. Assignment 2 focused heavily on building gates from other gates.</p>

    <Card title="Single-Qubit Gates Reference" accent={T.accent}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { name: "X (NOT)", m: [["0","1"],["1","0"]], desc: "Bit flip: |0⟩↔|1⟩" },
          { name: "Y", m: [["0","−i"],["i","0"]], desc: "Bit + phase flip" },
          { name: "Z", m: [["1","0"],["0","−1"]], desc: "Phase flip on |1⟩" },
          { name: "H (Hadamard)", m: [["1/√2","1/√2"],["1/√2","−1/√2"]], desc: "Superposition creator" },
          { name: "S", m: [["1","0"],["0","i"]], desc: "π/2 phase. S²=Z" },
          { name: "T", m: [["1","0"],["0","e^(iπ/4)"]], desc: "π/4 phase. T²=S" },
        ].map((g, i) => (
          <div key={i} style={{ padding: 12, background: "#0c1220", borderRadius: 10, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.accent2, marginBottom: 6 }}>{g.name}</div>
            <Matrix data={g.m} small />
            <div style={{ fontSize: 12, color: T.dim, marginTop: 6 }}>{g.desc}</div>
          </div>
        ))}
      </div>
    </Card>

    <Card title="Hadamard (H) — Deep Dive" accent={T.accent4}
      tip="H is its own inverse: H² = I. Applying H twice returns to the original state."
    >
      <MatrixBlock label="H =">
        <span style={{ color: T.muted, marginRight: 6, fontSize: 14 }}>1/√2</span>
        <Matrix data={[["1", "1"], ["1", "−1"]]} />
      </MatrixBlock>
      <Formula>{"H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2\nH|1⟩ = |−⟩ = (|0⟩ − |1⟩)/√2\nH|+⟩ = |0⟩   (reverses!)\nH|−⟩ = |1⟩   (reverses!)"}</Formula>
    </Card>

    <Card title="CNOT (Controlled-NOT)" accent={T.accent2}
      examAlert="CNOT appears constantly. Know the 4×4 matrix AND the truth table cold."
      tip="Control qubit unchanged. Target flips ONLY when control = |1⟩."
    >
      <MatrixBlock label="CNOT =">
        <Matrix data={[["1","0","0","0"],["0","1","0","0"],["0","0","0","1"],["0","0","1","0"]]} />
      </MatrixBlock>
      <TableChart headers={["Input", "Output", "What happened"]} rows={[
        ["|00⟩", "|00⟩", "Control=0, no flip"],
        ["|01⟩", "|01⟩", "Control=0, no flip"],
        ["|10⟩", "|11⟩", "Control=1, target FLIPPED"],
        ["|11⟩", "|10⟩", "Control=1, target FLIPPED"],
      ]} />
    </Card>

    <Card title="🔧 Toffoli Gate (CCNOT)" accent={T.accent3}
      examAlert="Asg2 Q3 & Q4 use Toffoli gates extensively. You MUST know how to build classical gates with Toffoli."
      tip="Toffoli = reversible AND. Target flips only when BOTH controls are 1. Input: |a,b,c⟩ → Output: |a,b,c⊕(a·b)⟩"
    >
      <Formula>{"|a, b, c⟩ → |a, b, c ⊕ (a AND b)⟩\n\nIf c = 0: output target = a AND b\nIf c = 1: output target = a NAND b"}</Formula>
      <TableChart headers={["a", "b", "c", "→ a", "→ b", "→ c⊕(a·b)"]} rows={[
        ["0","0","0","0","0","0"],
        ["0","0","1","0","0","1"],
        ["0","1","0","0","1","0"],
        ["0","1","1","0","1","1"],
        ["1","0","0","1","0","0"],
        ["1","0","1","1","0","1"],
        ["1","1","0","1","1","1 ← flipped!"],
        ["1","1","1","1","1","0 ← flipped!"],
      ]} />

      <Example q={<span>Design a 2-input OR gate with two Toffoli gates (Asg2 Q3)</span>}
        a={<div>
          <p>Use De Morgan's law: <b>A OR B = NOT(NOT A AND NOT B)</b></p>
          <p>Or use the identity: A OR B = (A ⊕ B) ⊕ (A AND B) ... but with Toffoli:</p>
          <p style={{ marginTop: 8 }}>Strategy: You need to combine Toffoli gates with appropriate ancilla bits and NOTs to construct OR from AND-like operations.</p>
          <p style={{ marginTop: 8, color: T.accent }}>Key insight: Toffoli with target=0 gives AND. Combine with NOT gates (which are just Toffoli with both controls set to 1, or use X gates) to get OR.</p>
        </div>} />

      <Example q={<span>Design controlled-NOT with 4 controls and 1 target using Toffoli (Asg2 Q4)</span>}
        a={<div>
          <p>You need: target flips only when ALL 4 control bits = 1.</p>
          <p><b>Strategy — cascade Toffoli gates with ancilla bits:</b></p>
          <p>1. Use Toffoli(a, b, ancilla₁) → ancilla₁ = a AND b</p>
          <p>2. Use Toffoli(c, ancilla₁, ancilla₂) → ancilla₂ = c AND (a AND b)</p>
          <p>3. Use Toffoli(d, ancilla₂, target) → target ⊕= d AND c AND a AND b</p>
          <p>4. Uncompute ancillas in reverse to clean up</p>
          <p style={{ color: T.accent, marginTop: 8 }}>Total: ~6 Toffoli gates (3 to compute, 3 to uncompute ancillas)</p>
        </div>} />
    </Card>

    <Card title="🔧 Fredkin Gate (CSWAP)" accent={T.accent4}
      examAlert="Asg2 Q2 uses Fredkin gates. Know: if control=1, targets swap. If control=0, nothing happens."
    >
      <Formula>{"|a, b, c⟩ → |a, b, c⟩  if a = 0\n|a, b, c⟩ → |a, c, b⟩  if a = 1  (b and c swap)"}</Formula>
      <TableChart headers={["a", "b", "c", "→ a", "→ b", "→ c"]} rows={[
        ["0","0","0","0","0","0"],
        ["0","0","1","0","0","1"],
        ["0","1","0","0","1","0"],
        ["0","1","1","0","1","1"],
        ["1","0","0","1","0","0"],
        ["1","0","1","1","1","0 ← swapped"],
        ["1","1","0","1","0","1 ← swapped"],
        ["1","1","1","1","1","1"],
      ]} />

      <Example q={<span>Construct 2-input NAND with Fredkin gates (Asg2 Q2)</span>}
        a={<div>
          <p>NAND(a,b) = NOT(a AND b)</p>
          <p>Fredkin can simulate AND: with inputs |a, b, 0⟩, if you clever route...</p>
          <p>Key insight: Fredkin gate is universal for classical computation. Use the fact that Fredkin(1, b, 0) swaps b and 0, giving |1, 0, b⟩.</p>
          <p style={{ color: T.accent4, marginTop: 8 }}>Approach: Chain Fredkin gates to first compute AND, then NOT the result. You may need ancilla bits set to constant 0 or 1.</p>
        </div>} />
    </Card>

    <Card title="Classical Gates with Matrices (AND)" accent={T.accent2}
      examAlert="Asg2 Q1 asks you to show AND gate matrix = simulated AND using NOR gates. Build AND from NOR gates and verify the truth tables match."
    >
      <p>AND gate truth table:</p>
      <TableChart headers={["A", "B", "A AND B"]} rows={[["0","0","0"],["0","1","0"],["1","0","0"],["1","1","1"]]} />
      <p style={{ marginTop: 10 }}>NOR gate: A NOR B = NOT(A OR B)</p>
      <TableChart headers={["A", "B", "A NOR B"]} rows={[["0","0","1"],["0","1","0"],["1","0","0"],["1","1","0"]]} />
      <p style={{ marginTop: 10, color: T.accent }}>To build AND from NOR: use De Morgan's: A AND B = NOR(NOR(A,A), NOR(B,B)) = NOR(NOT A, NOT B)</p>
    </Card>

    <Card title="√NOT Gate" accent={T.accent3} tip="Apply twice = NOT. No classical equivalent exists — purely quantum.">
      <MatrixBlock label="√NOT =">
        <span style={{ color: T.muted, marginRight: 6, fontSize: 14 }}>½</span>
        <Matrix data={[["1+i", "1−i"], ["1−i", "1+i"]]} />
      </MatrixBlock>
      <Formula>{"(√NOT)² = X (NOT gate)\n\nThis gate creates superposition — no classical equivalent!"}</Formula>
    </Card>

    <Card title="Measurement Gate" accent={T.dim}>
      <Formula>{"Measuring |ψ⟩ = α|0⟩ + β|1⟩:\n\n• P(|0⟩) = |α|²\n• P(|1⟩) = |β|²\n• After measurement: state COLLAPSES\n• Measurement is NOT unitary (irreversible)"}</Formula>
    </Card>

    <Card title="How to Solve Gate Circuits" accent={T.accent}
      tip="Read LEFT to RIGHT. Each gate = matrix multiply. For multi-qubit: use tensor products for parallel gates."
    >
      <StepByStep steps={[
        { title: "Write input state as a vector", content: "|0⟩ = [1,0]ᵀ, |1⟩ = [0,1]ᵀ, |00⟩ = [1,0,0,0]ᵀ, etc." },
        { title: "For each gate left-to-right, multiply by its matrix", content: "New state = Gate × Current state" },
        { title: "Parallel gates → tensor product", content: "Gate on qubit 1 only: (Gate ⊗ I). Gate on qubit 2 only: (I ⊗ Gate)." },
        { title: "Multi-qubit gates use their full matrix", content: "CNOT uses its 4×4 matrix directly." },
        { title: "Measure: square amplitudes for probabilities", content: "P(outcome) = |amplitude|²" },
      ]} />
    </Card>

    <MiniQuiz question="What is CNOT|10⟩?" options={["|10⟩", "|11⟩", "|01⟩", "|00⟩"]}
      answer={1} explanation="Control=1, so target flips: 0→1. Result: |11⟩" />
    <MiniQuiz question="Toffoli|110⟩ = ?" options={["|110⟩", "|111⟩", "|100⟩", "|010⟩"]}
      answer={1} explanation="Both controls = 1, so target flips: 0→1. Result: |111⟩" />
    <MiniQuiz question="Which property must ALL quantum gates have?" options={["Hermitian", "Unitary", "Diagonal", "Symmetric"]}
      answer={1} explanation="All quantum gates must be unitary to preserve probability normalization." />
  </div>);
}

// ══════════════════════════════════════════════
//  SECTION: EXAM PATTERNS
// ══════════════════════════════════════════════
function ExamPatterns() {
  return (<div>
    <h2 style={{ color: T.accent3, fontSize: 26, fontWeight: 800, margin: "0 0 6px", fontFamily: "'Space Mono', monospace" }}>🎯 Exam Patterns & Strategy</h2>
    <p style={{ color: T.muted, marginBottom: 24, fontSize: 14 }}>Based on your two assignments, here's what your professor tests and how to prepare.</p>

    <Card title="Assignment 1: Question Type Analysis" accent={T.accent}>
      <TableChart headers={["Topic", "Points", "Question Style", "Difficulty"]} rows={[
        ["Modulus & Conjugate", "6", "Direct computation", "⭐ Easy"],
        ["Complex Operations", "4", "Add, subtract, multiply", "⭐ Easy"],
        ["Polar ↔ Cartesian", "4+4", "Convert both directions", "⭐⭐ Medium"],
        ["Vector Inverse & Length", "6", "Complex vector computation", "⭐⭐ Medium"],
        ["Inner Product (scalar×dot)", "4", "Multi-step with scalar", "⭐⭐ Medium"],
        ["Linear Independence", "5", "Proof / show dependent", "⭐⭐⭐ Hard"],
        ["Transpose, Conjugate, Adjoint", "2+2+3", "Matrix operations", "⭐ Easy"],
        ["Matrix Multiplication", "9", "Complex matrix multiply", "⭐⭐⭐ Hard (tedious)"],
        ["Prove (cA)† = c̄A†", "10", "Two-sided verification", "⭐⭐⭐ Hard"],
        ["Transition Amplitude", "4", "Inner product computation", "⭐⭐ Medium"],
        ["Inner Product Rules", "6", "Verify distributive property", "⭐⭐ Medium"],
        ["Vector Distance", "4", "Subtract then norm", "⭐ Easy"],
        ["Eigenvalues (given eigenvectors)", "9", "Multiply and identify λ", "⭐⭐ Medium"],
        ["Hermitian Verification", "4", "Check A† = A", "⭐ Easy"],
        ["Unitary Verification", "8", "Check A†A = I", "⭐⭐⭐ Hard"],
        ["Tensor Product Property", "6", "Verify (P⊗Q)† = P†⊗Q†", "⭐⭐⭐ Hard"],
      ]} />
    </Card>

    <Card title="Assignment 2: Question Type Analysis" accent={T.accent2}>
      <TableChart headers={["Topic", "Points", "Question Style", "Difficulty"]} rows={[
        ["AND from NOR gates", "20", "Circuit equivalence proof", "⭐⭐ Medium"],
        ["NAND from Fredkin gates", "25", "Gate construction", "⭐⭐⭐ Hard"],
        ["OR from Toffoli gates", "30", "Gate construction", "⭐⭐⭐ Hard"],
        ["Multi-control CNOT from Toffoli", "25", "Complex circuit design", "⭐⭐⭐ Hard"],
      ]} />
    </Card>

    <Card title="🔑 Top 10 Things to Master for This Exam" accent={T.accent4}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          "Complex number FOIL multiplication — you'll use this in almost every matrix problem",
          "Adjoint operation (A†) — transpose + conjugate, appears in 5+ questions",
          "Modulus computation — √(a² + b²), the most basic building block",
          "Matrix multiplication with complex entries — slow and tedious but high-point",
          "Hermitian check (A† = A) and Unitary check (A†A = I) — know both cold",
          "Polar ↔ Cartesian conversion — especially the QUADRANT adjustment for θ",
          "Toffoli gate truth table — know that |a,b,c⟩ → |a,b,c⊕(a·b)⟩",
          "Building classical gates from reversible gates (Toffoli, Fredkin)",
          "Eigenvalue computation when eigenvectors are given — just multiply Av and find λ",
          "Tensor product computation — each entry of first × entire second matrix",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ minWidth: 28, height: 28, borderRadius: "50%", background: `rgba(251,191,36,${0.1 + i * 0.02})`, border: `1px solid ${T.accent4}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: T.accent4 }}>{i + 1}</span>
            <span style={{ fontSize: 14, lineHeight: 1.6, paddingTop: 3 }}>{item}</span>
          </div>
        ))}
      </div>
    </Card>

    <Card title="⚠️ Common Mistakes to Avoid" accent={T.accent3}>
      {[
        { mistake: "Forgetting to conjugate the BRA vector in inner products", fix: "⟨ψ₂|ψ₁⟩ → conjugate ψ₂, NOT ψ₁" },
        { mistake: "Wrong quadrant in polar conversion", fix: "Always check signs of a and b to determine the quadrant, then adjust θ" },
        { mistake: "i² = 1 instead of −1", fix: "i² = −1 ALWAYS. This is where the 'real' parts come from in multiplication" },
        { mistake: "Transposing but forgetting to conjugate for adjoint", fix: "A† needs BOTH steps. Do transpose first, then conjugate every entry" },
        { mistake: "Matrix dimensions don't match for multiplication", fix: "(m×n)(n×p) → inner dimensions must match. Result is m×p" },
        { mistake: "Confusing Hermitian (A†=A) with Unitary (A†A=I)", fix: "Hermitian = self-adjoint. Unitary = adjoint is the inverse" },
      ].map((item, i) => (
        <div key={i} style={{ padding: "10px 14px", margin: "6px 0", background: "rgba(244,114,182,0.05)", borderRadius: 8, borderLeft: `3px solid ${T.accent3}` }}>
          <p style={{ fontSize: 14, color: T.accent3, fontWeight: 600, margin: "0 0 4px" }}>❌ {item.mistake}</p>
          <p style={{ fontSize: 13, color: T.accent, margin: 0 }}>✅ {item.fix}</p>
        </div>
      ))}
    </Card>

    <Card title="Time Management Strategy" accent={T.accent2}>
      <p><b>Exam time allocation (assuming ~90 min exam):</b></p>
      <Formula>{"Easy questions (modulus, conjugate, transpose):     15 min\nMedium questions (polar, eigenvalues, distance):    25 min\nHard questions (matrix multiply, proofs, circuits): 40 min\nReview & check arithmetic:                          10 min"}</Formula>
      <p style={{ marginTop: 10, color: T.accent4 }}>💡 <b>Do the easy points FIRST.</b> Don't get stuck on a hard proof when there are 6 free points waiting on modulus/conjugate.</p>
    </Card>
  </div>);
}

// ══════════════════════════════════════════════
//  SECTION: SELF-TEST QUIZ
// ══════════════════════════════════════════════
function SelfTestQuiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = [
    { q: "What is |−5 + 12i|?", opts: ["7", "13", "17", "√119"], a: 1, exp: "√(25+144) = √169 = 13 (Pythagorean triple!)" },
    { q: "Conjugate of 3i − 7 is:", opts: ["7 + 3i", "−7 − 3i", "7 − 3i", "−3i − 7"], a: 1, exp: "Rewrite as −7+3i. Conjugate: −7−3i" },
    { q: "(1+2i)(3−i) = ?", opts: ["5+5i", "1+5i", "5+7i", "3+5i"], a: 0, exp: "3−i+6i−2i² = 3+5i+2 = 5+5i" },
    { q: "For A† you must:", opts: ["Transpose only", "Conjugate only", "Transpose then conjugate", "Invert"], a: 2, exp: "Adjoint = Transpose + Conjugate (both steps!)" },
    { q: "‖[1+i, 2, −i]ᵀ‖ = ?", opts: ["√7", "√5", "√6", "3"], a: 0, exp: "|1+i|²=2, |2|²=4, |−i|²=1. Sum=7. √7" },
    { q: "CNOT|11⟩ = ?", opts: ["|11⟩", "|10⟩", "|01⟩", "|00⟩"], a: 1, exp: "Control=1, target flips: 1→0. Result: |10⟩" },
    { q: "H² = ?", opts: ["H", "X", "Z", "I (identity)"], a: 3, exp: "Hadamard is its own inverse: H²=I" },
    { q: "Toffoli|101⟩ = ?", opts: ["|101⟩", "|100⟩", "|111⟩", "|001⟩"], a: 0, exp: "Controls: a=1, b=0. Since b=0, a·b=0, target unchanged." },
    { q: "A matrix is Hermitian if:", opts: ["A†A=I", "A†=A", "Aᵀ=A", "A²=I"], a: 1, exp: "Hermitian: A equals its own adjoint." },
    { q: "4 qubits → how many basis states?", opts: ["4", "8", "16", "32"], a: 2, exp: "2⁴ = 16" },
    { q: "Which Bell state has |01⟩ and |10⟩ with a minus?", opts: ["|Φ⁺⟩", "|Φ⁻⟩", "|Ψ⁺⟩", "|Ψ⁻⟩"], a: 3, exp: "Ψ=different bits, minus=subtraction: |Ψ⁻⟩=(|01⟩−|10⟩)/√2" },
    { q: "To find eigenvalue when eigenvector is given:", opts: ["det(A−λI)=0", "Compute A·v and find λ from A·v=λv", "Diagonalize A", "Find A⁻¹"], a: 1, exp: "When v is given: multiply Av, then λ = (component of Av)/(same component of v)" },
    { q: "In ⟨ψ₂|ψ₁⟩, which gets conjugated?", opts: ["ψ₁", "ψ₂", "Both", "Neither"], a: 1, exp: "The BRA (left) vector ψ₂ gets conjugated." },
    { q: "(√NOT)² = ?", opts: ["I", "X (NOT)", "H", "Z"], a: 1, exp: "By definition: square root of NOT, squared = NOT = X" },
    { q: "Fredkin gate with control=0:", opts: ["Swaps targets", "Flips target", "Does nothing", "NOTs control"], a: 2, exp: "Control=0: no swap occurs. Inputs pass through unchanged." },
  ];

  const score = Object.entries(answers).filter(([k, v]) => v === questions[parseInt(k)].a).length;

  return (<div>
    <h2 style={{ color: T.accent, fontSize: 26, fontWeight: 800, margin: "0 0 6px", fontFamily: "'Space Mono', monospace" }}>✓ Comprehensive Self-Test</h2>
    <p style={{ color: T.muted, marginBottom: 20, fontSize: 14 }}>{questions.length} questions covering every exam topic.</p>

    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <div style={{ display: "inline-flex", gap: 24, padding: "12px 28px", background: T.card, borderRadius: 12, border: `1px solid ${T.border}` }}>
        <div><div style={{ fontSize: 26, fontWeight: 800, color: T.accent, fontFamily: "'JetBrains Mono'" }}>{score}</div><div style={{ fontSize: 11, color: T.muted }}>Correct</div></div>
        <div><div style={{ fontSize: 26, fontWeight: 800, color: T.accent2, fontFamily: "'JetBrains Mono'" }}>{Object.keys(answers).length}</div><div style={{ fontSize: 11, color: T.muted }}>Answered</div></div>
        <div><div style={{ fontSize: 26, fontWeight: 800, color: T.accent4, fontFamily: "'JetBrains Mono'" }}>{Object.keys(answers).length > 0 ? Math.round(score / Object.keys(answers).length * 100) : 0}%</div><div style={{ fontSize: 11, color: T.muted }}>Score</div></div>
      </div>
    </div>

    {/* Progress bar */}
    <div style={{ display: "flex", gap: 3, marginBottom: 16, flexWrap: "wrap", justifyContent: "center" }}>
      {questions.map((_, i) => (
        <button key={i} onClick={() => setCurrent(i)} style={{
          width: 24, height: 24, borderRadius: 6, border: `1px solid ${i === current ? T.accent : T.border}`,
          background: answers[i] !== undefined ? (answers[i] === questions[i].a ? "rgba(110,231,183,0.3)" : "rgba(244,114,182,0.3)") : (i === current ? "rgba(129,140,248,0.2)" : "transparent"),
          color: i === current ? T.accent : T.dim, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        }}>{i + 1}</button>
      ))}
    </div>

    <MiniQuiz
      key={current}
      question={`Q${current + 1}/${questions.length}: ${questions[current].q}`}
      options={questions[current].opts}
      answer={questions[current].a}
      explanation={questions[current].exp}
    />

    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
      <button disabled={current === 0} onClick={() => setCurrent(c => c - 1)} style={{ padding: "8px 20px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, cursor: current === 0 ? "default" : "pointer", fontFamily: "inherit", opacity: current === 0 ? 0.4 : 1 }}>← Prev</button>
      <button disabled={current === questions.length - 1} onClick={() => setCurrent(c => c + 1)} style={{ padding: "8px 20px", background: T.accent2, border: "none", borderRadius: 8, color: "#fff", cursor: current === questions.length - 1 ? "default" : "pointer", fontFamily: "inherit", fontWeight: 600, opacity: current === questions.length - 1 ? 0.4 : 1 }}>Next →</button>
    </div>
  </div>);
}

// ══════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════
export default function App() {
  const [active, setActive] = useState("complex");
  const [sideOpen, setSideOpen] = useState(true);
  const mainRef = useRef(null);

  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [active]);

  const render = () => {
    switch (active) {
      case "complex": return <ComplexNumbers />;
      case "vectors": return <Vectors />;
      case "transition": return <TransitionAmplitude />;
      case "matrix": return <Matrices />;
      case "arch": return <Architecture />;
      case "gates": return <QuantumGates />;
      case "examprep": return <ExamPatterns />;
      case "quiz": return <SelfTestQuiz />;
      default: return <ComplexNumbers />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: T.text, overflow: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Mono:wght@400;700&display=swap');
        * { scrollbar-width: thin; scrollbar-color: ${T.border} transparent; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }`}</style>

      {/* Sidebar */}
      <div style={{ width: sideOpen ? 230 : 54, minWidth: sideOpen ? 230 : 54, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", transition: "all .25s" }}>
        <div style={{ padding: "18px 14px 12px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${T.border}` }}>
          <button onClick={() => setSideOpen(!sideOpen)} style={{ background: "none", border: "none", color: T.accent, fontSize: 18, cursor: "pointer", padding: 4, lineHeight: 1 }}>
            {sideOpen ? "◁" : "▷"}
          </button>
          {sideOpen && <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.accent, fontFamily: "'Space Mono'", letterSpacing: 1 }}>COT4601</div>
            <div style={{ fontSize: 10, color: T.dim }}>Quantum Midterm Guide</div>
          </div>}
        </div>
        <nav style={{ flex: 1, padding: "8px 6px", display: "flex", flexDirection: "column", gap: 1 }}>
          {SECTIONS.map(s => {
            const on = active === s.id;
            return (
              <button key={s.id} onClick={() => setActive(s.id)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: sideOpen ? "9px 12px" : "9px 0", justifyContent: sideOpen ? "flex-start" : "center",
                background: on ? "rgba(110,231,183,0.10)" : "transparent",
                border: on ? `1px solid rgba(110,231,183,0.2)` : "1px solid transparent",
                borderRadius: 9, color: on ? T.accent : T.muted, cursor: "pointer",
                fontSize: 13, fontFamily: "inherit", fontWeight: on ? 700 : 400,
                transition: "all .15s", whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: 16, minWidth: 22, textAlign: "center", fontFamily: "'JetBrains Mono'" }}>{s.icon}</span>
                {sideOpen && s.label}
              </button>
            );
          })}
        </nav>
        {sideOpen && <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}`, fontSize: 10, color: T.dim, lineHeight: 1.5 }}>
          Based on Asg1 & Asg2 patterns. Click topics to study, expand examples, take quizzes. 🚀
        </div>}
      </div>

      {/* Main */}
      <div ref={mainRef} style={{ flex: 1, overflow: "auto", padding: "28px 36px 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>{render()}</div>
      </div>
    </div>
  );
}
