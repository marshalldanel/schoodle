# Schoodle

Will be a Doodle clone but is currently a work in progress.

## Getting Started

1. Download the repository
2. Install the dependencies with `npm install`

### Database

- Run `psql -U <username> -d <database name>` in command line
- Within PSQL's CLI:
  - Run `CREATE ROLE <role name> WITH LOGIN password '<password>'`
  - Run `CREATE DATABASE schoodle OWNER <role name>`
- Exit PSQL's CLI
- Run `psql <database name> < db/schema.sql`
