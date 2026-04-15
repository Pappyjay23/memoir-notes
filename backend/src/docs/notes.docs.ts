/**
 * @openapi
 * /api/notes:
 *   get:
 *     summary: Retrieve all notes for the authenticated user
 *     description: Returns all notes owned by the authenticated user. Requires a valid JWT access token.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotesListResponse'
 *             example:
 *               success: true
 *               message: Notes fetched successfully
 *               data:
 *                 - _id: 662005a2f1a9a3b3f1d2c3d4
 *                   user: 661f2b0e2e9b3b7b0f61a9c1
 *                   title: Trip to Lisbon
 *                   content: Remember to write about the day at Belém and the pastel shop.
 *                   tag: travel
 *                   pinned: false
 *                   createdAt: 2026-04-15T18:45:00.000Z
 *                   updatedAt: 2026-04-15T18:45:00.000Z
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
 *               invalidToken:
 *                 summary: Invalid access token
 *                 value:
 *                   success: false
 *                   message: Invalid token
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
 *         description: Server error fetching notes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Error fetching notes
 *   post:
 *     summary: Create a new note for the authenticated user
 *     description: Creates a note owned by the authenticated user. Requires a valid JWT access token.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer access token header.
 *         example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9._example
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNoteRequest'
 *           example:
 *             title: Trip to Lisbon
 *             content: Remember to write about the day at Belém and the pastel shop.
 *             tag: travel
 *             pinned: false
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteResponse'
 *             example:
 *               success: true
 *               message: Note created successfully
 *               data:
 *                 _id: 662005a2f1a9a3b3f1d2c3d4
 *                 user: 661f2b0e2e9b3b7b0f61a9c1
 *                 title: Trip to Lisbon
 *                 content: Remember to write about the day at Belém and the pastel shop.
 *                 tag: travel
 *                 pinned: false
 *                 createdAt: 2026-04-15T18:45:00.000Z
 *                 updatedAt: 2026-04-15T18:45:00.000Z
 *       400:
 *         description: Validation error (field-specific messages)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Note validation failed
 *               error:
 *                 - message: Title is required
 *       401:
 *         description: Unauthorized (missing/invalid/expired access token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
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
 *         description: Server error creating note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Error creating notes
 */

/**
 * @openapi
 * /api/notes/{id}:
 *   get:
 *     summary: Retrieve a single note by id
 *     description: Returns a single note owned by the authenticated user. Requires a valid JWT access token.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the note
 *         example: 662005a2f1a9a3b3f1d2c3d4
 *     responses:
 *       200:
 *         description: Note fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteResponse'
 *             example:
 *               success: true
 *               message: Note fetched successfully
 *               data:
 *                 _id: 662005a2f1a9a3b3f1d2c3d4
 *                 user: 661f2b0e2e9b3b7b0f61a9c1
 *                 title: Trip to Lisbon
 *                 content: Remember to write about the day at Belém and the pastel shop.
 *                 tag: travel
 *                 pinned: false
 *                 createdAt: 2026-04-15T18:45:00.000Z
 *                 updatedAt: 2026-04-15T18:45:00.000Z
 *       401:
 *         description: Unauthorized (missing/invalid/expired access token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Note not found
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
 *         description: Server error fetching the note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Error fetching notes
 *   patch:
 *     summary: Update an existing note
 *     description: Updates a note owned by the authenticated user. Supports partial updates. Requires a valid JWT access token.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the note
 *         example: 662005a2f1a9a3b3f1d2c3d4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNoteRequest'
 *           example:
 *             pinned: true
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteResponse'
 *             example:
 *               success: true
 *               message: Note updated successfully
 *               data:
 *                 _id: 662005a2f1a9a3b3f1d2c3d4
 *                 user: 661f2b0e2e9b3b7b0f61a9c1
 *                 title: Trip to Lisbon
 *                 content: Remember to write about the day at Belém and the pastel shop.
 *                 tag: travel
 *                 pinned: true
 *                 createdAt: 2026-04-15T18:45:00.000Z
 *                 updatedAt: 2026-04-15T18:47:00.000Z
 *       400:
 *         description: Validation error (field-specific messages)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Note validation failed
 *               error:
 *                 - message: Title is required
 *       401:
 *         description: Unauthorized (missing/invalid/expired access token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Note not found
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
 *         description: Server error updating the note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Error updating note
 *   delete:
 *     summary: Delete a note by id
 *     description: Deletes a note owned by the authenticated user. Requires a valid JWT access token.
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the note
 *         example: 662005a2f1a9a3b3f1d2c3d4
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteResponse'
 *             example:
 *               success: true
 *               message: Note deleted successfully
 *               data:
 *                 _id: 662005a2f1a9a3b3f1d2c3d4
 *                 user: 661f2b0e2e9b3b7b0f61a9c1
 *                 title: Trip to Lisbon
 *                 content: Remember to write about the day at Belém and the pastel shop.
 *                 tag: travel
 *                 pinned: false
 *                 createdAt: 2026-04-15T18:45:00.000Z
 *                 updatedAt: 2026-04-15T18:45:00.000Z
 *       401:
 *         description: Unauthorized (missing/invalid/expired access token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Unauthorized
 *       404:
 *         description: Note not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Note not found
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
 *         description: Server error deleting the note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Error deleting note
 */