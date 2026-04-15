import path from "node:path";
import swaggerJSDoc from "swagger-jsdoc";
import type { SwaggerDefinition } from "swagger-jsdoc";
import "dotenv/config";

const definition: SwaggerDefinition = {
	openapi: "3.0.3",
	info: {
		title: "Memoir Notes API",
		version: "1.0.0",
		description:
			"Production-ready API documentation for Memoir Notes (Node.js, Express, TypeScript).",
		contact: {
			name: "Peace Jinadu-Paul",
			email: "pjinadu02@gmail.com",
			url: "https://peacejp.dev",
		},
	},
	servers: [
		{
			url:
				process.env.NODE_ENV === "production"
					? process.env.SERVER_URL
					: "http://localhost:5001",
			description:
				process.env.NODE_ENV === "production" ? "Production" : "Development",
		},
	],
	tags: [
		{ name: "Health", description: "Service health and diagnostics" },
		{
			name: "Auth",
			description:
				"User authentication, login, registration, and token management",
		},
		{ name: "Users", description: "Authenticated user profile endpoints" },
		{ name: "Notes", description: "Notes CRUD for the authenticated user" },
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
				description:
					"Provide the access token as: `Authorization: Bearer <accessToken>`.",
			},
		},
		schemas: {
			ErrorDetail: {
				type: "object",
				additionalProperties: false,
				properties: {
					message: { type: "string", example: "Title is required" },
				},
				required: ["message"],
			},
			ErrorResponse: {
				type: "object",
				additionalProperties: false,
				properties: {
					success: { type: "boolean", example: false },
					message: { type: "string", example: "Unauthorized" },
					error: {
						oneOf: [
							{ type: "string", example: "Invalid token" },
							{ $ref: "#/components/schemas/ErrorDetailList" },
							{ type: "object", nullable: true },
						],
					},
				},
				required: ["success", "message"],
			},
			ErrorDetailList: {
				type: "array",
				items: { $ref: "#/components/schemas/ErrorDetail" },
				example: [{ message: "Password must be at least 6 characters" }],
			},
			SuccessResponse: {
				type: "object",
				additionalProperties: false,
				properties: {
					success: { type: "boolean", example: true },
					message: { type: "string", example: "Operation successful" },
					data: { nullable: true },
				},
				required: ["success", "message"],
			},
			User: {
				type: "object",
				additionalProperties: false,
				properties: {
					_id: { type: "string", example: "661f2b0e2e9b3b7b0f61a9c1" },
					firstName: { type: "string", example: "Jordan" },
					lastName: { type: "string", example: "Lee" },
					email: {
						type: "string",
						format: "email",
						example: "jordan@example.com",
					},
					createdAt: { type: "string", format: "date-time" },
					updatedAt: { type: "string", format: "date-time" },
				},
				required: ["_id", "firstName", "lastName", "email"],
			},
			Note: {
				type: "object",
				additionalProperties: false,
				properties: {
					_id: { type: "string", example: "662005a2f1a9a3b3f1d2c3d4" },
					user: { type: "string", example: "661f2b0e2e9b3b7b0f61a9c1" },
					title: { type: "string", example: "Trip to Lisbon" },
					content: {
						type: "string",
						example:
							"Remember to write about the day at Belém and the pastel shop.",
					},
					tag: { type: "string", example: "travel", nullable: true },
					pinned: { type: "boolean", example: false },
					createdAt: { type: "string", format: "date-time" },
					updatedAt: { type: "string", format: "date-time" },
				},
				required: ["_id", "user", "title", "content", "pinned"],
			},
			AuthSignupRequest: {
				type: "object",
				additionalProperties: false,
				properties: {
					firstName: { type: "string", example: "Jordan" },
					lastName: { type: "string", example: "Lee" },
					email: {
						type: "string",
						format: "email",
						example: "jordan@example.com",
					},
					password: { type: "string", example: "P@ssw0rd!" },
				},
				required: ["firstName", "lastName", "email", "password"],
			},
			AuthLoginRequest: {
				type: "object",
				additionalProperties: false,
				properties: {
					email: {
						type: "string",
						format: "email",
						example: "jordan@example.com",
					},
					password: { type: "string", example: "P@ssw0rd!" },
				},
				required: ["email", "password"],
			},
			AuthResponseData: {
				type: "object",
				additionalProperties: false,
				properties: {
					user: { $ref: "#/components/schemas/User" },
					accessToken: {
						type: "string",
						example:
							"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MWYyYjBlMmU5YjNiN2IwZjYxYTljMSIsImVtYWlsIjoiam9yZGFuQGV4YW1wbGUuY29tIiwiaWF0IjoxNzEzMjc3MTg0LCJleHAiOjE3MTMyNzgwODR9._example",
					},
				},
				required: ["user", "accessToken"],
			},
			AuthResponse: {
				allOf: [
					{ $ref: "#/components/schemas/SuccessResponse" },
					{
						type: "object",
						properties: {
							data: { $ref: "#/components/schemas/AuthResponseData" },
						},
						required: ["data"],
					},
				],
			},
			RefreshResponseData: {
				type: "object",
				additionalProperties: false,
				properties: {
					accessToken: {
						type: "string",
						example:
							"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MWYyYjBlMmU5YjNiN2IwZjYxYTljMSIsImVtYWlsIjoiam9yZGFuQGV4YW1wbGUuY29tIiwiaWF0IjoxNzEzMjc3MTg0LCJleHAiOjE3MTMyNzgwODR9._example",
					},
				},
				required: ["accessToken"],
			},
			RefreshResponse: {
				allOf: [
					{ $ref: "#/components/schemas/SuccessResponse" },
					{
						type: "object",
						properties: {
							data: { $ref: "#/components/schemas/RefreshResponseData" },
						},
						required: ["data"],
					},
				],
			},
			UserResponse: {
				allOf: [
					{ $ref: "#/components/schemas/SuccessResponse" },
					{
						type: "object",
						properties: {
							data: { $ref: "#/components/schemas/User" },
						},
						required: ["data"],
					},
				],
			},
			NotesListResponse: {
				allOf: [
					{ $ref: "#/components/schemas/SuccessResponse" },
					{
						type: "object",
						properties: {
							data: {
								type: "array",
								items: { $ref: "#/components/schemas/Note" },
							},
						},
						required: ["data"],
					},
				],
			},
			NoteResponse: {
				allOf: [
					{ $ref: "#/components/schemas/SuccessResponse" },
					{
						type: "object",
						properties: {
							data: { $ref: "#/components/schemas/Note" },
						},
						required: ["data"],
					},
				],
			},
			CreateNoteRequest: {
				type: "object",
				additionalProperties: false,
				properties: {
					title: { type: "string", example: "Trip to Lisbon" },
					content: {
						type: "string",
						example:
							"Remember to write about the day at Belém and the pastel shop.",
					},
					tag: { type: "string", example: "travel" },
					pinned: { type: "boolean", example: false },
				},
				required: ["title", "content"],
			},
			UpdateNoteRequest: {
				type: "object",
				additionalProperties: false,
				properties: {
					title: { type: "string", example: "Trip to Lisbon (day 2)" },
					content: { type: "string", example: "Add the Alfama walk details." },
					tag: { type: "string", example: "travel" },
					pinned: { type: "boolean", example: true },
				},
			},
		},
	},
};

const apis = [path.resolve(process.cwd(), "src/docs/**/*.ts")];

export const swaggerSpec = swaggerJSDoc({
	definition,
	apis,
});

export const swaggerUiOptions = {
	explorer: true,
	customSiteTitle: "Memoir Notes API Docs",
	customCss: `
	.swagger-ui .topbar .download-url-wrapper { display: none }
	.swagger-ui .topbar .topbar-wrapper { justify-content: space-between }
	`,
	swaggerOptions: {
		persistAuthorization: true,
	},
} as const;
