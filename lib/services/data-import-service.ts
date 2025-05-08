import { redis } from "@/lib/redis"
import { parseExpression } from "cron-parser"

// Interface for import job
interface ImportJob {
  scheduleId: string
  type: "companies" | "financials" | "news" | "pipeline"
  source: string
  config: Record<string, any>
}

// Process scheduled imports
export async function processScheduledImports() {
  try {
    // Get all active schedules
    const scheduleKeys = await redis.keys("schedule:*")
    const schedules = []

    for (const key of scheduleKeys) {
      const schedule = await redis.get(key)
      if (schedule && schedule.status === "active") {
        schedules.push(schedule)
      }
    }

    const now = new Date()
    const jobsToRun: ImportJob[] = []

    // Check which schedules need to run
    for (const schedule of schedules) {
      const nextRunDate = new Date(schedule.nextRun)

      if (nextRunDate <= now) {
        // Add to jobs to run
        jobsToRun.push({
          scheduleId: schedule.scheduleId,
          type: schedule.type,
          source: schedule.source,
          config: schedule.config,
        })

        // Calculate next run time
        const interval = parseExpression(schedule.schedule)
        const nextRun = interval.next().toDate().toISOString()

        // Update next run time
        await redis.set(`schedule:${schedule.scheduleId}`, {
          ...schedule,
          nextRun,
          lastRun: now.toISOString(),
        })
      }
    }

    // Run the jobs
    for (const job of jobsToRun) {
      await runImportJob(job)
    }

    return jobsToRun.length
  } catch (error) {
    console.error("Error processing scheduled imports:", error)
    return 0
  }
}

// Run an import job
async function runImportJob(job: ImportJob) {
  try {
    console.log(`Running import job: ${job.type} from ${job.source}`)

    const startTime = Date.now()

    // In a real application, this would fetch data from external sources
    // For demo purposes, we'll simulate data import

    let data: any[] = []

    switch (job.type) {
      case "companies":
        data = generateMockCompanyData()
        break
      case "financials":
        data = generateMockFinancialData()
        break
      case "news":
        data = generateMockNewsData()
        break
      case "pipeline":
        data = generateMockPipelineData()
        break
    }

    // Add a small delay to simulate processing time
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 1000))

    // Process the data (in a real app, this would store in database)
    console.log(`Imported ${data.length} ${job.type} records`)

    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000 // Duration in seconds

    // Log the import
    await redis.set(`import:log:${Date.now()}`, {
      scheduleId: job.scheduleId,
      type: job.type,
      source: job.source,
      recordCount: data.length,
      timestamp: new Date().toISOString(),
      success: true,
      duration,
    })

    return true
  } catch (error) {
    console.error(`Error running import job: ${job.type}`, error)

    // Log the error
    await redis.set(`import:log:${Date.now()}`, {
      scheduleId: job.scheduleId,
      type: job.type,
      source: job.source,
      timestamp: new Date().toISOString(),
      success: false,
      error: error.message,
    })

    return false
  }
}

// Generate mock data for testing
function generateMockCompanyData() {
  return [
    { name: "Pfizer", ticker: "PFE", country: "USA" },
    { name: "Novartis", ticker: "NVS", country: "Switzerland" },
    { name: "Roche", ticker: "RHHBY", country: "Switzerland" },
    { name: "Merck", ticker: "MRK", country: "USA" },
    { name: "AstraZeneca", ticker: "AZN", country: "UK" },
  ]
}

function generateMockFinancialData() {
  return [
    { ticker: "PFE", revenue: 81.3, netIncome: 21.7, year: 2023, quarter: "Q4" },
    { ticker: "NVS", revenue: 52.5, netIncome: 12.6, year: 2023, quarter: "Q4" },
    { ticker: "RHHBY", revenue: 63.8, netIncome: 14.8, year: 2023, quarter: "Q4" },
    { ticker: "MRK", revenue: 59.1, netIncome: 15.2, year: 2023, quarter: "Q4" },
    { ticker: "AZN", revenue: 45.8, netIncome: 8.9, year: 2023, quarter: "Q4" },
  ]
}

function generateMockNewsData() {
  return [
    {
      title: "Pfizer Announces Breakthrough in Cancer Treatment",
      source: "MedicalNews Today",
      date: new Date().toISOString(),
      companies: ["PFE"],
    },
    {
      title: "Novartis Reports Strong Q1 Results",
      source: "Financial Times",
      date: new Date().toISOString(),
      companies: ["NVS"],
    },
    {
      title: "Pharmaceutical Industry Faces New Regulations",
      source: "Wall Street Journal",
      date: new Date().toISOString(),
      companies: ["PFE", "NVS", "RHHBY", "MRK", "AZN"],
    },
  ]
}

function generateMockPipelineData() {
  return [
    {
      companyTicker: "PFE",
      drugName: "PF-07321332",
      indication: "COVID-19",
      phase: "Phase 3",
      status: "Ongoing",
    },
    {
      companyTicker: "NVS",
      drugName: "LNP023",
      indication: "Paroxysmal Nocturnal Hemoglobinuria",
      phase: "Phase 2",
      status: "Recruiting",
    },
    {
      companyTicker: "AZN",
      drugName: "AZD1222",
      indication: "COVID-19",
      phase: "Approved",
      status: "Marketing",
    },
  ]
}
