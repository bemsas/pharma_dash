# Pipeline API

## Get Company Pipeline

Returns pipeline data for a specific company.

**URL**: `/pipeline/companies/:companyId`

**Method**: `GET`

**Auth required**: Yes

**URL Parameters**:
- `companyId` (string, required): Company ID

**Query Parameters**:
- `status` (string, optional): Filter by status (e.g., "phase1", "phase2", "phase3", "approved")
- `category` (string, optional): Filter by category (e.g., "oncology", "cardiology")

**Response**:

\`\`\`json
{
  "companyId": "comp_123456789",
  "companyName": "Pfizer Inc.",
  "ticker": "PFE",
  "pipelineProducts": [
    {
      "id": "prod_123456789",
      "name": "PF-07321332",
      "description": "Oral antiviral treatment for COVID-19",
      "category": "infectious-diseases",
      "status": "approved",
      "phase": "marketed",
      "indication": "COVID-19",
      "mechanism": "SARS-CoV-2 main protease inhibitor",
      "startDate": "2020-03-15T00:00:00Z",
      "estimatedCompletionDate": null,
      "completionDate": "2021-12-22T00:00:00Z",
      "marketPotential": {
        "peakSales": 22000000000,
        "probability": 100
      },
      "partners": [
        {
          "id": "comp_987654321",
          "name": "BioNTech SE",
          "role": "development partner"
        }
      ],
      "milestones": [
        {
          "date": "2021-11-05T00:00:00Z",
          "description": "Positive Phase 2/3 results announced",
          "type": "clinical"
        },
        {
          "date": "2021-12-22T00:00:00Z",
          "description": "FDA Emergency Use Authorization",
          "type": "regulatory"
        }
      ]
    },
    // More products...
  ],
  "summary": {
    "totalProducts": 95,
    "byPhase": {
      "discovery": 35,
      "preclinical": 25,
      "phase1": 15,
      "phase2": 10,
      "phase3": 8,
      "filed": 2,
      "approved": 0,
      "marketed": 0
    },
    "byCategory": {
      "oncology": 30,
      "infectious-diseases": 20,
      "cardiology": 15,
      "neurology": 10,
      "immunology": 10,
      "other": 10
    }
  }
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Company not found

## Get Pipeline Product

Returns detailed information about a specific pipeline product.

**URL**: `/pipeline/products/:id`

**Method**: `GET`

**Auth required**: Yes

**URL Parameters**:
- `id` (string, required): Pipeline product ID

**Response**:

\`\`\`json
{
  "id": "prod_123456789",
  "name": "PF-07321332",
  "description": "Oral antiviral treatment for COVID-19",
  "category": "infectious-diseases",
  "status": "approved",
  "phase": "marketed",
  "indication": "COVID-19",
  "mechanism": "SARS-CoV-2 main protease inhibitor",
  "startDate": "2020-03-15T00:00:00Z",
  "estimatedCompletionDate": null,
  "completionDate": "2021-12-22T00:00:00Z",
  "company": {
    "id": "comp_123456789",
    "name": "Pfizer Inc.",
    "ticker": "PFE"
  },
  "marketPotential": {
    "peakSales": 22000000000,
    "probability": 100
  },
  "partners": [
    {
      "id": "comp_987654321",
      "name": "BioNTech SE",
      "role": "development partner"
    }
  ],
  "milestones": [
    {
      "date": "2020-03-15T00:00:00Z",
      "description": "Development initiated",
      "type": "development"
    },
    {
      "date": "2021-03-23T00:00:00Z",
      "description": "Phase 1 clinical trial initiated",
      "type": "clinical"
    },
    {
      "date": "2021-07-28T00:00:00Z",
      "description": "Phase 2/3 clinical trial initiated",
      "type": "clinical"
    },
    {
      "date": "2021-11-05T00:00:00Z",
      "description": "Positive Phase 2/3 results announced",
      "type": "clinical"
    },
    {
      "date": "2021-12-22T00:00:00Z",
      "description": "FDA Emergency Use Authorization",
      "type": "regulatory"
    }
  ],
  "clinicalTrials": [
    {
      "id": "NCT04756531",
      "title": "Study of PF-07321332 in Healthy Adults",
      "phase": "Phase 1",
      "status": "Completed",
      "startDate": "2021-03-23T00:00:00Z",
      "completionDate": "2021-05-15T00:00:00Z",
      "participants": 60,
      "locations": ["United States", "Belgium"]
    },
    {
      "id": "NCT04960202",
      "title": "Study of PF-07321332 in Symptomatic Adult Participants With COVID-19 Infection",
      "phase": "Phase 2/3",
      "status": "Completed",
      "startDate": "2021-07-28T00:00:00Z",
      "completionDate": "2021-10-25T00:00:00Z",
      "participants": 2246,
      "locations": ["United States", "United Kingdom", "Brazil", "South Africa"]
    }
  ],
  "publications": [
    {
      "title": "Nirmatrelvir, an orally active Mpro inhibitor, is a potent inhibitor of SARS-CoV-2 variants of concern",
      "journal": "Science",
      "date": "2022-01-20T00:00:00Z",
      "url": "https://www.science.org/doi/10.1126/science.abq1945"
    }
  ],
  "patents": [
    {
      "number": "US11358923B2",
      "title": "Nitrile-containing protease inhibitors",
      "filingDate": "2021-02-26T00:00:00Z",
      "issueDate": "2022-06-14T00:00:00Z",
      "expirationDate": "2041-02-26T00:00:00Z"
    }
  ]
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Pipeline product not found

## Get Pipeline by Category

Returns pipeline products by category across companies.

**URL**: `/pipeline/categories/:category`

**Method**: `GET`

**Auth required**: Yes

**URL Parameters**:
- `category` (string, required): Product category (e.g., "oncology", "cardiology")

**Query Parameters**:
- `status` (string, optional): Filter by status
- `phase` (string, optional): Filter by phase

**Response**:

\`\`\`json
{
  "category": "oncology",
  "totalProducts": 250,
  "byPhase": {
    "discovery": 80,
    "preclinical": 60,
    "phase1": 45,
    "phase2": 35,
    "phase3": 20,
    "filed": 5,
    "approved": 3,
    "marketed": 2
  },
  "byCompany": [
    {
      "id": "comp_123456789",
      "name": "Pfizer Inc.",
      "ticker": "PFE",
      "productCount": 30
    },
    {
      "id": "comp_987654321",
      "name": "Merck & Co.",
      "ticker": "MRK",
      "productCount": 25
    }
    // More companies...
  ],
  "products": [
    {
      "id": "prod_234567890",
      "name": "PF-06873600",
      "description": "CDK2 inhibitor for breast cancer",
      "company": {
        "id": "comp_123456789",
        "name": "Pfizer Inc.",
        "ticker": "PFE"
      },
      "status": "phase3",
      "phase": "phase3",
      "indication": "Breast cancer",
      "mechanism": "CDK2 inhibitor"
    },
    // More products...
  ]
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token
- `404 Not Found`: Category not found

## Add Pipeline Product

Adds a new pipeline product.

**URL**: `/pipeline/products`

**Method**: `POST`

**Auth required**: Yes (Admin or Data Provider)

**Request Body**:

\`\`\`json
{
  "name": "MK-7110",
  "description": "CD24Fc for treatment of severe COVID-19",
  "category": "infectious-diseases",
  "status": "phase3",
  "phase": "phase3",
  "indication": "COVID-19",
  "mechanism": "Regulates immune response",
  "startDate": "2020-09-01T00:00:00Z",
  "estimatedCompletionDate": "2023-06-30T00:00:00Z",
  "companyId": "comp_987654321",
  "marketPotential": {
    "peakSales": 1500000000,
    "probability": 65
  },
  "partners": [
    {
      "id": "comp_345678901",
      "role": "licensing partner"
    }
  ],
  "milestones": [
    {
      "date": "2020-09-01T00:00:00Z",
      "description": "Phase 3 clinical trial initiated",
      "type": "clinical"
    }
  ]
}
\`\`\`

**Response**:

\`\`\`json
{
  "id": "prod_345678901",
  "name": "MK-7110",
  "description": "CD24Fc for treatment of severe COVID-19",
  "category": "infectious-diseases",
  "status": "phase3",
  "phase": "phase3",
  "indication": "COVID-19",
  "mechanism": "Regulates immune response",
  "startDate": "2020-09-01T00:00:00Z",
  "estimatedCompletionDate": "2023-06-30T00:00:00Z",
  "company": {
    "id": "comp_987654321",
    "name": "Merck & Co.",
    "ticker": "MRK"
  },
  "marketPotential": {
    "peakSales": 1500000000,
    "probability": 65
  },
  "partners": [
    {
      "id": "comp_345678901",
      "name": "OncoImmune",
      "role": "licensing partner"
    }
  ],
  "milestones": [
    {
      "date": "2020-09-01T00:00:00Z",
      "description": "Phase 3 clinical trial initiated",
      "type": "clinical"
    }
  ],
  "createdAt": "2023-05-01T12:00:00Z"
}
\`\`\`

**Status Codes**:
- `201 Created`: Pipeline product added successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Company not found

## Update Pipeline Product

Updates an existing pipeline product.

**URL**: `/pipeline/products/:id`

**Method**: `PUT`

**Auth required**: Yes (Admin or Data Provider)

**URL Parameters**:
- `id` (string, required): Pipeline product ID

**Request Body**:

\`\`\`json
{
  "status": "phase3-completed",
  "phase": "filed",
  "milestones": [
    {
      "date": "2020-09-01T00:00:00Z",
      "description": "Phase 3 clinical trial initiated",
      "type": "clinical"
    },
    {
      "date": "2023-04-15T00:00:00Z",
      "description": "Phase 3 clinical trial completed",
      "type": "clinical"
    },
    {
      "date": "2023-05-01T00:00:00Z",
      "description": "NDA submitted to FDA",
      "type": "regulatory"
    }
  ]
}
\`\`\`

**Response**:

\`\`\`json
{
  "id": "prod_345678901",
  "name": "MK-7110",
  "description": "CD24Fc for treatment of severe COVID-19",
  "category": "infectious-diseases",
  "status": "phase3-completed",
  "phase": "filed",
  "indication": "COVID-19",
  "mechanism": "Regulates immune response",
  "startDate": "2020-09-01T00:00:00Z",
  "estimatedCompletionDate": "2023-06-30T00:00:00Z",
  "company": {
    "id": "comp_987654321",
    "name": "Merck & Co.",
    "ticker": "MRK"
  },
  "marketPotential": {
    "peakSales": 1500000000,
    "probability": 65
  },
  "partners": [
    {
      "id": "comp_345678901",
      "name": "OncoImmune",
      "role": "licensing partner"
    }
  ],
  "milestones": [
    {
      "date": "2020-09-01T00:00:00Z",
      "description": "Phase 3 clinical trial initiated",
      "type": "clinical"
    },
    {
      "date": "2023-04-15T00:00:00Z",
      "description": "Phase 3 clinical trial completed",
      "type": "clinical"
    },
    {
      "date": "2023-05-01T00:00:00Z",
      "description": "NDA submitted to FDA",
      "type": "regulatory"
    }
  ],
  "updatedAt": "2023-05-01T14:30:00Z"
}
\`\`\`

**Status Codes**:
- `200 OK`: Pipeline product updated successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Pipeline product not found

## Delete Pipeline Product

Deletes a pipeline product.

**URL**: `/pipeline/products/:id`

**Method**: `DELETE`

**Auth required**: Yes (Admin only)

**URL Parameters**:
- `id` (string, required): Pipeline product ID

**Response**:

\`\`\`json
{
  "message": "Pipeline product deleted successfully"
}
\`\`\`

**Status Codes**:
- `200 OK`: Pipeline product deleted successfully
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Pipeline product not found
