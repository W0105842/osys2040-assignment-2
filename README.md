# osys2040-assignment-2

## To run server locally

First we gather parameters.

  In Heroku:

  Navigate to App -> Resources
  Click "Heroku Postgres" to get to the Heroku Postgresql service page.

  From Heroku Postgresql service page
  Navigate to Settings -> View Credentials... to see URI (aka connection string, aka DATABASE_URL)

Then we run the command line:

Bash:
  $ DATABASE_URL=postgres://blahblah npm run watch

The first part "DATABASE_URL=postgres://blahblah" sets the DATABASE_URL environment variable for the process started with "npm run watch".

Windows CMD:
  set DATABASE_URL=postgres://blahblah npm run watch

Paper on web app setup: https://12factor.net/
   -- it will make you better --
