/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check API health status
 *     description: Returns a simple JSON payload indicating the API is running. Useful for monitoring, uptime checks, and container orchestration health probes.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running and healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: false
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: API is running
 *               required: [status, message]
 *             example:
 *               status: ok
 *               message: API is running
 */