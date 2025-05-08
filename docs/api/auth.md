# Authentication API

## Register a new user

Creates a new user account.

**URL**: `/auth/register`

**Method**: `POST`

**Auth required**: No

**Request Body**:

\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "subscribeToNews": true
}
\`\`\`

**Response**:

\`\`\`json
{
  "userId": "usr_123456789",
  "email": "user@example.com",
  "fullName": "John Doe",
  "isVerified": false,
  "message": "Verification email sent"
}
\`\`\`

**Status Codes**:
- `201 Created`: User successfully registered
- `400 Bad Request`: Invalid request parameters
- `409 Conflict`: Email already in use

## Verify Email

Verifies a user's email address using a verification token.

**URL**: `/auth/verify-email`

**Method**: `POST`

**Auth required**: No

**Request Body**:

\`\`\`json
{
  "token": "verification_token_123456789"
}
\`\`\`

**Response**:

\`\`\`json
{
  "userId": "usr_123456789",
  "isVerified": true,
  "message": "Email verified successfully"
}
\`\`\`

**Status Codes**:
- `200 OK`: Email verified successfully
- `400 Bad Request`: Invalid token
- `404 Not Found`: Token not found
- `410 Gone`: Token expired

## Login

Authenticates a user and returns a JWT token.

**URL**: `/auth/login`

**Method**: `POST`

**Auth required**: No

**Request Body**:

\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response**:

\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "usr_123456789",
    "email": "user@example.com",
    "fullName": "John Doe",
    "isVerified": true
  }
}
\`\`\`

**Status Codes**:
- `200 OK`: Login successful
- `400 Bad Request`: Invalid credentials
- `403 Forbidden`: Account not verified

## Logout

Invalidates the current JWT token.

**URL**: `/auth/logout`

**Method**: `POST`

**Auth required**: Yes

**Response**:

\`\`\`json
{
  "message": "Logged out successfully"
}
\`\`\`

**Status Codes**:
- `200 OK`: Logout successful
- `401 Unauthorized`: Invalid token

## Request Password Reset

Sends a password reset email to the user.

**URL**: `/auth/request-password-reset`

**Method**: `POST`

**Auth required**: No

**Request Body**:

\`\`\`json
{
  "email": "user@example.com"
}
\`\`\`

**Response**:

\`\`\`json
{
  "message": "Password reset email sent"
}
\`\`\`

**Status Codes**:
- `200 OK`: Email sent
- `404 Not Found`: Email not found

## Reset Password

Resets a user's password using a reset token.

**URL**: `/auth/reset-password`

**Method**: `POST`

**Auth required**: No

**Request Body**:

\`\`\`json
{
  "token": "reset_token_123456789",
  "password": "newSecurePassword123"
}
\`\`\`

**Response**:

\`\`\`json
{
  "message": "Password reset successfully"
}
\`\`\`

**Status Codes**:
- `200 OK`: Password reset successful
- `400 Bad Request`: Invalid token
- `404 Not Found`: Token not found
- `410 Gone`: Token expired
