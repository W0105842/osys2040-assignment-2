# osys2040-assignment-2

## To run server locally

With local Postgresql:

Bash:
  $ npm run watch-heroku

With Heroku Postgresql:

First we gather parameters.

  In Heroku:

  Navigate to App -> Resources
  Click "Heroku Postgres" to get to the Heroku Postgresql service page.

  From Heroku Postgresql service page
  Navigate to Settings -> View Credentials... to see URI (aka connection string, aka DATABASE_URL)

Then we run the command line:

Bash:
  $ DATABASE_URL=postgres://blahblah npm run watch-heroku

The first part "DATABASE_URL=postgres://blahblah" sets the DATABASE_URL environment variable for the process started with "npm run watch-heroku".

Windows CMD:
  set DATABASE_URL=postgres://blahblah npm run watch-heroku

Paper on web app setup: https://12factor.net/
   -- it will make you better --
