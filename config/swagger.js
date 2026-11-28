
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
	definition: {
		openapi: '3.0.3',

		info: {
			title: 'Nautilux API',
			version: '1.0.0',
			description: `
                Nautilux is an API for monitoring software vulnerabilities
                and notifying users when registered technologies are affected.

                The API integrates with OSV.dev to retrieve vulnerability data.
            `,
			contact: {
				name: 'Nautilux'
			}
		},

		servers: [
			{
				url: `http://localhost:${process.env.PORT || 3000}`,
				description: 'Local development server'
			}
		],

		tags: [
			{
				name: 'Status',
				description: 'API and external service health checks'
			},
			{
				name: 'Authentication',
				description: 'User registration and authentication'
			},
			{
				name: 'Users',
				description: 'User account management'
			},
			{
				name: 'Technologies',
				description: 'Registered technology management'
			},
			{
				name: 'Vulnerabilities',
				description: 'Software vulnerability information'
			}
		],

		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'Enter your JWT access token.'
				}
			},

			schemas: {
				User: {
					type: 'object',
					properties: {
						_id: {
							type: 'string',
							example: '674a1234567890abcdef1234'
						},
						nickname: {
							type: 'string',
							example: 'gustavo'
						},
						email: {
							type: 'string',
							format: 'email',
							example: 'user@example.com'
						},
						technologies: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/Technology'
							}
						}
					}
				},

				UserCreate: {
					type: 'object',
					required: ['nickname', 'email', 'password'],
					properties: {
						nickname: {
							type: 'string',
							example: 'gustavo'
						},
						email: {
							type: 'string',
							format: 'email',
							example: 'user@example.com'
						},
						password: {
							type: 'string',
							format: 'password',
							example: 'StrongPassword123!'
						}
					}
				},

				UserLogin: {
					type: 'object',
					required: ['email', 'password'],
					properties: {
						email: {
							type: 'string',
							format: 'email',
							example: 'user@example.com'
						},
						password: {
							type: 'string',
							format: 'password',
							example: 'StrongPassword123!'
						}
					}
				},

				AuthResponse: {
					type: 'object',
					properties: {
						success: {
							type: 'boolean',
							example: true
						},
						token: {
							type: 'string',
							example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
						}
					}
				},

				Technology: {
					type: 'object',
					properties: {
						_id: {
							type: 'string',
							example: '674a1234567890abcdef1234'
						},
						name: {
							type: 'string',
							example: 'express'
						},
						ecosystem: {
							type: 'string',
							example: 'npm'
						},
						version: {
							type: 'string',
							example: '5.1.0'
						}
					}
				},

				TechnologyCreate: {
					type: 'object',
					required: ['name', 'ecosystem', 'version'],
					properties: {
						name: {
							type: 'string',
							example: 'express'
						},
						ecosystem: {
							type: 'string',
							example: 'npm'
						},
						version: {
							type: 'string',
							example: '5.1.0'
						}
					}
				},

				VulnerabilityPackage: {
					type: 'object',
					properties: {
						name: {
							type: 'string',
							example: 'express'
						},
						ecosystem: {
							type: 'string',
							example: 'npm'
						},
						purl: {
							type: 'string',
							nullable: true,
							example: 'pkg:npm/express'
						}
					}
				},

				VulnerabilityEvent: {
					type: 'object',
					properties: {
						introduced: {
							type: 'string',
							example: '1.0.0'
						},
						fixed: {
							type: 'string',
							example: '2.0.0'
						},
						last_affected: {
							type: 'string',
							example: '1.9.9'
						},
						limit: {
							type: 'string',
							example: '3.0.0'
						}
					}
				},

				VulnerabilityRange: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							example: 'SEMVER'
						},
						events: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/VulnerabilityEvent'
							}
						}
					}
				},

				AffectedPackage: {
					type: 'object',
					properties: {
						package: {
							$ref: '#/components/schemas/VulnerabilityPackage'
						},
						ranges: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/VulnerabilityRange'
							}
						},
						versions: {
							type: 'array',
							items: {
								type: 'string',
								example: '1.2.3'
							}
						}
					}
				},

				Vulnerability: {
					type: 'object',
					properties: {
						_id: {
							type: 'string',
							example: '674a1234567890abcdef1234'
						},
						osvId: {
							type: 'string',
							example: 'GHSA-1234-abcd-5678'
						},
						summary: {
							type: 'string',
							example: 'Example security vulnerability'
						},
						details: {
							type: 'string',
							example: 'Detailed vulnerability description.'
						},
						aliases: {
							type: 'array',
							items: {
								type: 'string'
							},
							example: ['CVE-2026-12345']
						},
						published: {
							type: 'string',
							format: 'date-time'
						},
						modified: {
							type: 'string',
							format: 'date-time'
						},
						affected: {
							type: 'array',
							items: {
								$ref: '#/components/schemas/AffectedPackage'
							}
						},
						references: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									type: {
										type: 'string',
										example: 'WEB'
									},
									url: {
										type: 'string',
										format: 'uri'
									}
								}
							}
						},
						severity: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									type: {
										type: 'string',
										example: 'CVSS_V3'
									},
									score: {
										type: 'string',
										example: '7.5'
									}
								}
							}
						}
					}
				},

				Notification: {
					type: 'object',
					properties: {
						_id: {
							type: 'string',
							example: '674a1234567890abcdef1234'
						},
						user: {
							type: 'string',
							example: '674a1234567890abcdef1234'
						},
						vulnerability: {
							type: 'string',
							example: 'GHSA-1234-abcd-5678'
						},
						technology: {
							type: 'string',
							example: 'express'
						},
						version: {
							type: 'string',
							example: '5.1.0'
						}
					}
				},

				SuccessResponse: {
					type: 'object',
					properties: {
						success: {
							type: 'boolean',
							example: true
						},
						message: {
							type: 'string',
							example: 'Operation completed successfully.'
						}
					}
				},

				NautiluxStatus: {
					type: 'object',
					properties: {
						success: {
							type: 'boolean',
							example: true
						},
						message: {
							type: 'string',
							example: 'Nautilux is on!'
						}
					}
				},

				ExternalServiceStatus: {
					type: 'object',
					properties: {
						success: {
							type: 'boolean',
							example: true
						},
						service: {
							type: 'object',
							description: 'External service status information'
						}
					}
				},

				ErrorResponse: {
					type: 'object',
					properties: {
						success: {
							type: 'boolean',
							example: false
						},
						error: {
							type: 'string',
							example: 'An error occurred.'
						},
						message: {
							type: 'string',
							example: 'An error occurred.'
						}
					}
				}
			},

			responses: {
				Unauthorized: {
					description: 'Authentication token is missing or invalid.',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorResponse'
							}
						}
					}
				},

				NotFound: {
					description: 'Requested resource was not found.',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorResponse'
							}
						}
					}
				},

				ValidationError: {
					description: 'Invalid request data.',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorResponse'
							}
						}
					}
				},

				InternalServerError: {
					description: 'Internal server error.',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorResponse'
							}
						}
					}
				}
			}
		}
	},

	apis: [
		path.resolve(__dirname, '../routes/**/*.js').replace(/\\/g, '/')
	]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
