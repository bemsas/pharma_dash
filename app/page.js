// Simple static component with no promises or async code
export default function Home() {
  // Using only synchronous code, no promises
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#333" }}>Pharma Evaluation Dashboard</h1>

      <div style={{ marginTop: "20px" }}>
        <h2>Key Issues</h2>
        <ul>
          <li>Patent Cliff for Key Products</li>
          <li>Pipeline Development</li>
          <li>Pricing Pressure</li>
          <li>Manufacturing Capacity</li>
          <li>International Market Expansion</li>
        </ul>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Investor Data</h2>
        <div>
          <div>Current Price: $67.42</div>
          <div>YTD Return: +2.4%</div>
          <div>Market Cap: $384B</div>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>News Articles</h2>
        <div style={{ marginBottom: "15px" }}>
          <h3>Pfizer Announces Breakthrough in Cancer Treatment Research</h3>
          <p>May 1, 2025 • MedicalNews Today</p>
          <p>
            Pharmaceutical giant Pfizer has announced promising results from a Phase 3 clinical trial for its new
            oncology drug targeting rare forms of lung cancer.
          </p>
        </div>
        <div>
          <h3>Johnson & Johnson Faces New Litigation Over Product Safety</h3>
          <p>April 28, 2025 • Wall Street Journal</p>
          <p>
            Johnson & Johnson is facing a new round of lawsuits related to product safety concerns, potentially
            impacting the company's financial outlook for the coming year.
          </p>
        </div>
      </div>
    </div>
  )
}
