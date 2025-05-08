# User Management API

## Get User Profile

Returns the profile of the authenticated user.

**URL**: `/users/me`

**Method**: `GET`

**Auth required**: Yes

**Response**:

\`\`\`json
{
  "id": "usr_123456789",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "analyst",
  "isVerified": true,
  "preferences": {
    "theme": "light",
    "dashboardLayout": "default",
    "emailNotifications": true,
    "defaultCompany": "comp_123456789"
  },
  "createdAt": "2023-01-15T10:30:00Z",
  "lastLoginAt": "2023-05-01T09:45:00Z"
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token

## Update User Profile

Updates the profile of the authenticated user.

**URL**: `/users/me`

**Method**: `PUT`

**Auth required**: Yes

**Request Body**:

\`\`\`json
{
  "fullName": "John Smith",
  "preferences": {
    "theme": "dark",
    "emailNotifications": false
  }
}
\`\`\`

**Response**:

\`\`\`json
{
  "id": "usr_123456789",
  "email": "user@example.com",
  "fullName": "John Smith",
  "role": "analyst",
  "isVerified": true,
  "preferences": {
    "theme": "dark",
    "dashboardLayout": "default",
    "emailNotifications": false,
    "defaultCompany": "comp_123456789"
  },
  "updatedAt": "2023-05-01T15:20:00Z"
}
\`\`\`

**Status Codes**:
- `200 OK`: Profile updated successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid token

## Change Password

Changes the password of the authenticated user.

**URL**: `/users/me/password`

**Method**: `PUT`

**Auth required**: Yes

**Request Body**:

\`\`\`json
{
  "currentPassword": "currentSecurePassword123",
  "newPassword": "newSecurePassword456"
}
\`\`\`

**Response**:

\`\`\`json
{
  "message": "Password changed successfully"
}
\`\`\`

**Status Codes**:
- `200 OK`: Password changed successfully
- `400 Bad Request`: Invalid request parameters or password does not meet requirements
- `401 Unauthorized`: Invalid token or current password is incorrect

## Get User by ID (Admin only)

Returns the profile of a specific user.

**URL**: `/users/:id`

**Method**: `GET`

**Auth required**: Yes (Admin only)

**URL Parameters**:
- `id` (string, required): User ID

**Response**:

\`\`\`json
{
  "id": "usr_987654321",
  "email": "analyst@example.com",
  "fullName": "Jane Smith",
  "role": "analyst",
  "isVerified": true,
  "preferences": {
    "theme": "light",
    "dashboardLayout": "custom",
    "emailNotifications": true,
    "defaultCompany": "comp_987654321"
  },
  "createdAt": "2023-02-10T14:20:00Z",
  "lastLoginAt": "2023-05-01T11:30:00Z"
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: User not found

## Get All Users (Admin only)

Returns a paginated list of all users.

**URL**: `/users`

**Method**: `GET`

**Auth required**: Yes (Admin only)

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Number of results per page (default: 20)
- `sort` (string, optional): Field to sort by (default: "createdAt")
- `order` (string, optional): Sort order ("asc" or "desc", default: "desc")
- `search` (string, optional): Search term for email or full name
- `role` (string, optional): Filter by role
- `isVerified` (boolean, optional): Filter by verification status

**Response**:

\`\`\`json
{
  "data": [
    {
      "id": "usr_123456789",
      "email": "user@example.com",
      "fullName": "John Smith",
      "role": "analyst",
      "isVerified": true,
      "createdAt": "2023-01-15T10:30:00Z",
      "lastLoginAt": "2023-05-01T09:45:00Z"
    },
    {
      "id": "usr_987654321",
      "email": "analyst@example.com",
      "fullName": "Jane Smith",
      "role": "analyst",
      "isVerified": true,
      "createdAt": "2023-02-10T14:20:00Z",
      "lastLoginAt": "2023-05-01T11:30:00Z"
    }
    // More users...
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
\`\`\`

**Status Codes**:
- `200 OK`: Request successful
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions

## Create User (Admin only)

Creates a new user.

**URL**: `/users`

**Method**: `POST`

**Auth required**: Yes (Admin only)

**Request Body**:

\`\`\`json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "fullName": "New User",
  "role": "analyst",
  "isVerified": true,
  "preferences": {
    "theme": "light",
    "emailNotifications": true
  }
}
\`\`\`

**Response**:

\`\`\`json
{
  "id": "usr_567890123",
  "email": "newuser@example.com",
  "fullName": "New User",
  "role": "analyst",
  "isVerified": true,
  "preferences": {
    "theme": "light",
    "dashboardLayout": "default",
    "emailNotifications": true,
    "defaultCompany": null
  },
  "createdAt": "2023-05-01T16:00:00Z"
}
\`\`\`

**Status Codes**:
- `201 Created`: User created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `409 Conflict`: Email already in use

## Update User (Admin only)

Updates a user's profile.

**URL**: `/users/:id`

**Method**: `PUT`

**Auth required**: Yes (Admin only)

**URL Parameters**:
- `id` (string, required): User ID

**Request Body**:

\`\`\`json
{
  "fullName": "Updated User",
  "role": "admin",
  "isVerified": true
}
\`\`\`

**Response**:

\`\`\`json
{
  "id": "usr_567890123",
  "email": "newuser@example.com",
  "fullName": "Updated User",
  "role": "admin",
  "isVerified": true,
  "preferences": {
    "theme": "light",
    "dashboardLayout": "default",
    "emailNotifications": true,
    "defaultCompany": null
  },
  "updatedAt": "2023-05-01T16:30:00Z"
}
\`\`\`

**Status Codes**:
- `200 OK`: User updated successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: User not found

## Delete User (Admin only)

Deletes a user.

**URL**: `/users/:id`

**Method**: `DELETE`

**Auth required**: Yes (Admin only)

**URL Parameters**:
- `id` (string, required): User ID

**Response**:

\`\`\`json
{
  "message": "User deleted successfully"
}
\`\`\`

**Status Codes**:
- `200 OK`: User deleted successfully
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: User not found
\`\`\`

Now, let's create the database schema:
