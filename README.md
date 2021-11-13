# onethread-be

## OneThread

This is the repository for the server program for **OneThread**, a personal CRM by **Team Spider55**.

Users are able to:

- Register with email confirmation,  login and logout.
- View all contacts, filter by name or sort by name, date added, role, and organisation.
- Add, edit, delete contact details.
- Add, edit, and delete timestamped notes related to a contact.
- View all events, filter by a time range.
- Invite event participants with email (only the ones that exist in contacts).
- Guarantee event participant's email is valid (through filter and invitation-accept enforcement).
- Have a list of expired pending invitation (participant) filter and remove automatically.

## Running the program

To run the program, at the root directory:

```_
npm install
npm start
```

## Key dependencies

- Node, NPM
- Express
- Nodemailer
- Passport JWT
- Mongoose, MongoDB
- Cors
- Cookie-Parser
- Mocha, Chai, Axios

## Testing and deployment

To run automated integration tests with Mocha for the web interface:

```_
npm run test
```

The OneThread server is hosted on Heroku:

https://spider55-api.herokuapp.com

Continuous testing and deployment is set up for this repository.
