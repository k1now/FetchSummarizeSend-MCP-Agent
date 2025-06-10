const toolSchemas = {
    fetchNews: {
        name: 'fetchNews',
        description: 'Fetches news articles matching a specific topic.',
        input_schema: {
          type: 'object',
          properties: {
            query: { type: 'string' }
          },
          required: ['query']
        }
      },
  summarizeNews: {
    name: 'summarizeNews',
    description: 'Summarizes a list of news articles into a short digest. Supports optional control over tone and length.',
    input_schema: {
      type: 'object',
      properties: {
        articles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: {
                type: 'string'
              },
              description: {
                type: 'string'
              },
              publishedAt: {
                type: 'string'
              }
            }
          }
        },
        style: {
          type: 'string',
        },
      },
      required: ['articles']
    }
  },
  fetchUsersByInterest: {
    name: 'fetchUsersByInterest',
    description: 'Fetches users from Supabase based on interest category. Valid interest categories include: sports, technology, artificial_intelligence.',
    input_schema: {
      type: 'object',
      properties: {
        interest: {
          type: 'string'
        }
      },
      required: ['interest']
    }
  },
  sendEmail: {
    name: "sendEmail",
    description: "Sends an email with the specified subject and message to one or more recipients.",
    input_schema: {
      type: "object",
      properties: {
        to: {
          type: "array",
          items: {
            type: "string",
            format: "email"
          },
          description: "List of recipient email addresses"
        },
        subject: {
          type: "string",
          description: "Email subject"
        },
        text: {
          type: "string",
          description: "Plain text email content"
        }
      },
      required: [
        "to",
        "subject",
        "text"
      ]
    }
  }
};

module.exports = toolSchemas; 