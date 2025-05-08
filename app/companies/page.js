// Simple static page with no promises or async code
export default function CompaniesPage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#333" }}>Pharmaceutical Companies</h1>

      <div style={{ marginTop: "20px" }}>
        <div style={{ padding: "15px", border: "1px solid #eee", marginBottom: "10px" }}>
          <h2>Pfizer</h2>
          <p>A leading global pharmaceutical company focused on developing medicines and vaccines.</p>
        </div>

        <div style={{ padding: "15px", border: "1px solid #eee", marginBottom: "10px" }}>
          <h2>Johnson & Johnson</h2>
          <p>
            A multinational corporation that develops medical devices, pharmaceuticals, and consumer packaged goods.
          </p>
        </div>

        <div style={{ padding: "15px", border: "1px solid #eee" }}>
          <h2>Merck</h2>
          <p>A global healthcare company focused on prescription medicines, vaccines, and animal health products.</p>
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
