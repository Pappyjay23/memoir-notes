/**
 * @openapi
 * /api/user:
 *   get:
 *     summary: Retrieve the authenticated user profile
 *     description: Returns the current user's profile derived from the access token. Requires a valid JWT access token.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             example:
 *               success: true
 *               message: Current user fetched successfully
 *               data:
 *                 _id: 661f2b0e2e9b3b7b0f61a9c1
 *                 firstName: Jordan
 *                 lastName: Lee
 *                 email: jordan@example.com
 *                 createdAt: 2026-04-15T18:42:00.000Z
 *                 updatedAt: 2026-04-15T18:42:00.000Z
 *       401:
 *         description: Unauthorized (missing/invalid/expired access token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: Missing Authorization header
 *                 value:
 *                   success: false
 *                   message: No token provided
 *               expiredToken:
 *                 summary: Expired access token
 *                 value:
 *                   success: false
 *                   message: Token expired
 *               invalidToken:
 *                 summary: Invalid access token
 *                 value:
 *                   success: false
 *                   message: Invalid token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: User not found
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
 *         description: Server error fetching current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Error fetching current user
 */