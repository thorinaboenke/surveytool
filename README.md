# Survey Tool MVP 🚀

Created as a coding challenge during a weekend following a job interview for a developer position.
https://survey-t.herokuapp.com

## Chose a task 🤔

1. Self Checkout App
2. Hot Deals Platform
3. Survey Tool ✅

and create a minimum viable product:

- Functionality
- Design
- Reliability
- Usability

## Roadmap for survey-t 🛣️

Framework: Next.js

Deciding on the core features, considering what is feasible in the given timeframe of 72h (minus other weekend activities, corona test and another job interview... )

- User signup/login
- Creating surveys with a title and an arbitrary amount of questions/rating categories
- Delete option for surveys and single questions
- Dashboard with all created surveys of a user
- display when the survey was created
- dynamic page for each survey with the number of participants and average scores
- dynamic page for filling out the survey (anonymously)
- rating options 1-5 for each question/category
- progress tracker, thank you message
- (nice to have) possibility for free text feedback

## Database schema, writing migrations 💻

PostgreSQL database with related tables for: Users, Session, Surveys, Question and Answers. Created in https://sqldbm.com
<img src="https://github.com/thorinaboenke/surveytool/blob/master/public/t-survey_database_schema.png" width="600" alt='database schema'>

## App structure

- create the necessary pages, components and api routes

## API routes

- create API endpoints for signup, login, saving/modifying surveys, questions and answers to the database
- write corresponding database queries, inserts etc.

## Pages 📄

- create form inputs

## Deploying 🛠️

Deploy via Heroku

## Styling 🎨

- no time for proper UX research, so i'll just go wild in whatever time is left. The world definitely needs more hotpink 👩🏻‍🎤, and https://www.sessions.edu/color-calculator/ makes a fitting colorscheme.
<img src="https://github.com/thorinaboenke/surveytool/blob/master/public/colorscheme.png" width="300" alt='colorscheme'>
- style for desktop and mobile view in parallel (here trying for solutions that work for both without having to write a lot of media queries)

## Tidying 🧹

- variable + function naming
- stray console.logs
- comments
- error handling
- give it someone to use and ask for feedback 

## Other features (for future rainy days) 🤓

- custom slugs to access surveys (instead of the ids)
- free text feedback
- end-to-end testing
- abstract some elements into reusable components
- possibility to leave feedback non-anonymously
- template invite email
- better result visualization

## Lessons learned 👩🏻‍🏫

- planning is as least as important as execution, especially in a limited timeframe
