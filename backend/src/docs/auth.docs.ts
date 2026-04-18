/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Create a new user account
 *     description: Creates a new user and returns an access token. Also sets an httpOnly `refreshToken` cookie for session refresh.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthSignupRequest'
 *           example:
 *             firstName: Jordan
 *             lastName: Lee
 *             email: jordan@example.com
 *             password: P@ssw0rd!
 *     responses:
 *       201:
 *         description: User created successfully (refresh token cookie set)
 *         headers:
 *           Set-Cookie:
 *             description: httpOnly refresh token cookie
 *             schema:
 *               type: string
 *             example: refreshToken=eyJhbGciOi...; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: User created successfully
 *               data:
 *                 user:
 *                   _id: 661f2b0e2e9b3b7b0f61a9c1
 *                   firstName: Jordan
 *                   lastName: Lee
 *                   email: jordan@example.com
 *                   createdAt: 2026-04-15T18:42:00.000Z
 *                   updatedAt: 2026-04-15T18:42:00.000Z
 *                 accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9._example
 *       400:
 *         description: Validation error (field-specific messages)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Validation failed
 *               error:
 *                 - message: First name is required
 *                 - message: Password must be at least 6 characters
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Email already in use
 *       429:
 *         description: Too many requests (rate limited)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Too many requests
 *       500:
 *         description: Server error creating the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Error creating user
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user and issue tokens
 *     description: Validates credentials and returns an access token. Also sets an httpOnly `refreshToken` cookie for session refresh.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *           example:
 *             email: jordan@example.com
 *             password: P@ssw0rd!
 *     responses:
 *       200:
 *         description: Login successful (refresh token cookie set)
 *         headers:
 *           Set-Cookie:
 *             description: httpOnly refresh token cookie
 *             schema:
 *               type: string
 *             example: refreshToken=eyJhbGciOi...; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: Login successful
 *               data:
 *                 user:
 *                   _id: 661f2b0e2e9b3b7b0f61a9c1
 *                   firstName: Jordan
 *                   lastName: Lee
 *                   email: jordan@example.com
 *                   createdAt: 2026-04-15T18:42:00.000Z
 *                   updatedAt: 2026-04-15T18:42:00.000Z
 *                 accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9._example
 *       400:
 *         description: Validation error (field-specific messages)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Validation failed
 *               error:
 *                 - message: Invalid email address
 *       401:
 *         description: Unauthorized (invalid email or password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Invalid email or password
 *       429:
 *         description: Too many requests (rate limited)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Too many requests
 *       500:
 *         description: Server error logging in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Error logging in
 */

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current session
 *     description: Deletes the stored refresh token (if present) and clears the httpOnly `refreshToken` cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully (cookie cleared)
 *         headers:
 *           Set-Cookie:
 *             description: Clears refresh token cookie
 *             schema:
 *               type: string
 *             example: refreshToken=; Path=/; HttpOnly; Max-Age=0
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: Logged out successfully
 *       429:
 *         description: Too many requests (rate limited)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Too many requests
 *       500:
 *         description: Server error logging out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Error logging out
 */

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     description: Rotates the refresh token (cookie) and returns a new access token. Requires an httpOnly `refreshToken` cookie.
 *     tags: [Auth]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: "httpOnly refresh token cookie. Sent automatically by the browser when `credentials: true` is enabled."
 *     responses:
 *       200:
 *         description: Token refreshed successfully (refresh token rotated and cookie updated)
 *         headers:
 *           Set-Cookie:
 *             description: New httpOnly refresh token cookie
 *             schema:
 *               type: string
 *             example: "refreshToken=eyJhbGciOi...; Path=/; HttpOnly"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
 *             example:
 *               success: true
 *               message: Token refreshed successfully
 *               data:
 *                 accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9._example
 *       401:
 *         description: Unauthorized (missing/invalid/expired refresh token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingCookie:
 *                 summary: Missing refresh token cookie
 *                 value:
 *                   success: false
 *                   message: Refresh token not provided
 *               invalidToken:
 *                 summary: Invalid refresh token
 *                 value:
 *                   success: false
 *                   message: Invalid refresh token
 *               expiredToken:
 *                 summary: Expired refresh token
 *                 value:
 *                   success: false
 *                   message: Refresh token expired
 *       429:
 *         description: Too many requests (rate limited)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Too many requests
 *       500:
 *         description: Server error refreshing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Error refreshing token
 */
