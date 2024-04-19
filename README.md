<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

 <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


# Description

This application serves as a phone book (contacts) similar to the contacts book on your personal phone.
It is built using the Nest framework, a progressive Node.js framework for building efficient and scalable server-side applications.

## Data Storage

The application uses Redis cache and MySQL database to store all contact data.

## Health Endpoint

Additionally, the application provides a /health endpoint to ensure that the database is up and running.

## Service API

The service API includes the following endpoints:

### Important note:

All the endpoints that retrieve contacts have optional pagination, ordering, and skipping.

* Pagination: By default, retrieves contacts with a maximum of 10 per page. However, the client can specify the number of contacts per page and skip certain contacts if needed.
* Ordering: Contacts can be ordered by ID, first name, or last name in ascending or descending order.
* Skipping: The client can skip a specified number of contacts based on the order of contacts.
* Pagination Usage: Pagination is optional. If pagination parameters are not provided, the endpoint will return all contacts without pagination.

These options are available for the following methods:

1. Find All Contacts: Retrieve all contacts.
2. Search Contact: Search for contacts based on letters from first or last name.
3. Find All Favorite Contacts: Retrieve all contacts marked as favorites.
4. Find All Blocked Contacts: Retrieve all contacts that are blocked.

### Search Contact: 
Search for contacts based on specified criteria.

### Add Contact:
Add a new contact to the phone book.

### Edit Contact: 
Update an existing contact's details.

### Delete Contact: 
Remove a contact from the phone book.

### Find All Contacts: 
Retrieve all contacts.

request example - 
```
GET /contacts?pagination=true HTTP/1.1

{
  "order": {
    "key": "lastName"
  }
}
```
by default the order type will be ascending, will not skip any contacts and will return 10 contacts per page.


### Count All Contacts: 
Count the total number of contacts.

### Find All Favorite Contacts: 
Retrieve all contacts marked as favorites.

### Find All Blocked Contacts: 
Retrieve all contacts that are blocked.

### Find Contact by ID:
Retrieve a contact by its unique identifier.

## Prerequisites

Before running the server application, ensure that you have the following prerequisites installed on your system:

1. Node.js version 18.16.1
2. npm (Node Package Manager)
3. Docker

## Installation

To install the necessary dependencies for the server application, follow these steps:

1. Open a terminal or command prompt.
2. Navigate to the root directory of the server application.
3. Run the following command to install dependencies using npm:

```bash
$ npm install
```

## Running the app

Once you have installed the dependencies, you can run the server application inside a Docker container. Follow these steps:

1. Make sure Docker is running on your system.
2. Open a terminal or command prompt.
3. Navigate to the root directory of the server application.
4. Run the following command to start the application using Docker Compose:

```bash
$ docker compose up
```

## Test

```bash
# unit tests
$ npm run test
```

## Accessing the Application

Once the application is running, it will be accessible at the following URL:

```
http://localhost:3000
```

The server application listens on port 3000 by default.

## Stopping the Application

To stop the server application, you can use the following command:

```bash 
$ docker compose down
```

This will stop and remove the Docker containers associated with the server application.



## Support
If you encounter any issues or have any questions, please contact zachti@mta.ac.il for assistance.
