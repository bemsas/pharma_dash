# API Versioning Strategy

This document outlines the versioning strategy for the Pharma Dashboard API.

## Overview

The Pharma Dashboard API uses URL path versioning to ensure backward compatibility while allowing for future enhancements. This approach provides a clear and explicit way for clients to specify which version of the API they want to use.

## Versioning Scheme

The API uses a simple major version number in the URL path:

\`\`\`
https://api.pharmadashboard.com/v1/companies
\`\`\`

The current version is `v1`.

## Version Lifecycle

Each API version goes through the following lifecycle:

1. **Preview**: Early access for selected partners
2. **General Availability**: Available for all users
3. **Deprecated**: Still available but marked for removal
4. **Sunset**: No longer available

## Version Support Policy

- Each API version is supported for at least 12 months after a new version is released
- Deprecated versions will continue to function but will not receive new features
- Users will be notified at least 6 months before a version is sunset

## Version Compatibility

When a new version is released, the following changes may be made:

### Breaking Changes (New Version Required)

- Removing endpoints
- Removing fields from responses
- Changing field types
- Changing authentication methods
- Changing error response formats

### Non-Breaking Changes (Same Version)

- Adding new endpoints
- Adding new fields to responses
- Adding new query parameters
- Adding new error codes
- Performance improvements

## Version Migration

When migrating to a new version, users should:

1. Review the migration guide for the new version
2. Update API client code to use the new version
3. Test the application with the new version
4. Deploy the updated application

## Version Headers

In addition to URL path versioning, the API also supports version headers:

\`\`\`
Accept-Version: v1
\`\`\`

This allows clients to specify a version while maintaining the same URL structure.

## Version Discovery

The API provides a version discovery endpoint:

\`\`\`
GET /versions
\`\`\`

This endpoint returns information about available API versions:

\`\`\`json
{
  "versions": [
    {
      "version": "v1",
      "status": "current",
      "releaseDate": "2023-01-01",
      "sunsetDate": null
    }
  ],
  "current": "v1",
  "latest": "v1"
}
\`\`\`

## Version Documentation

Each version has its own documentation:

- v1: https://api.pharmadashboard.com/docs/v1

## Version Changelog

The API maintains a changelog for each version:

- v1: https://api.pharmadashboard.com/docs/v1/changelog

## Version Deprecation

When a version is deprecated:

1. The version status is changed to "deprecated"
2. A deprecation notice is added to the documentation
3. A deprecation header is added to responses:

\`\`\`
Deprecation: true
Sunset: Sat, 31 Dec 2023 23:59:59 GMT
Link: <https://api.pharmadashboard.com/v2/companies>; rel="successor-version"
\`\`\`

## Version Sunset

When a version is sunset:

1. The version is no longer accessible
2. Requests to the version return a 410 Gone response:

\`\`\`json
{
  "error": {
    "code": "VERSION_SUNSET",
    "message": "This API version has been sunset. Please use v2.",
    "documentation": "https://api.pharmadashboard.com/docs/v2"
  }
}
