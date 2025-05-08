// Simple static page with no promises or async code
export default function NewsPage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#333" }}>Pharmaceutical News</h1>

      <div style={{ marginTop: "20px" }}>
        <div style={{ padding: "15px", border: "1px solid #eee", marginBottom: "15px" }}>
          <h2>Pfizer Announces Breakthrough in Cancer Treatment Research</h2>
          <p style={{ color: "#666" }}>May 1, 2025 • MedicalNews Today</p>
          <p>
            Pharmaceutical giant Pfizer has announced promising results from a Phase 3 clinical trial for its new
            oncology drug targeting rare forms of lung cancer.
          </p>
        </div>

        <div style={{ padding: "15px", border: "1px solid #eee", marginBottom: "15px" }}>
          <h2>Johnson & Johnson Faces New Litigation Over Product Safety</h2>
          <p style={{ color: "#666" }}>April 28, 2025 • Wall Street Journal</p>
          <p>
            Johnson & Johnson is facing a new round of lawsuits related to product safety concerns, potentially
            impacting the company's financial outlook for the coming year.
          </p>
        </div>

        <div style={{ padding: "15px", border: "1px solid #eee" }}>
          <h2>Merck Expands Manufacturing Capacity in Asia</h2>
          <p style={{ color: "#666" }}>April 25, 2025 • Pharma Manufacturing</p>
          <p>
            Merck has announced a significant investment to expand its manufacturing capabilities in Singapore, aiming
            to meet growing demand in Asian markets.
          </p>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <a href="/" style={{ color: "#0066cc", textDecoration: "none" }}>
          Back to Dashboard
        </a>
      </div>
    </div>
  )
}
