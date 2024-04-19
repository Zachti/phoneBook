<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Description

This application serves as a phone book (contacts) similar to the contacts book on your personal phone.
It is built using the Nest framework, a progressive Node.js framework for building efficient and scalable server-side applications.

## Data Storage

The application uses Redis cache and MySQL database to store all contact data.

## Health Endpoint

Additionally, the application provides a /health endpoint to ensure that the database is up and running.

## Service API

The service API includes the following endpoints:

### Get Contacts:

Retrieves contacts with optional pagination, ordering, and filtering.

* Pagination: By default, retrieves contacts with a maximum of 10 per page. However, the client can specify the number of contacts per page and skip certain contacts if needed.
* Ordering: Contacts can be ordered by ID, first name, or last name in ascending or descending order.
* Filtering: The client can filter contacts based on specified criteria.
* Pagination Usage: Pagination is optional. If pagination parameters are not provided, the endpoint will return all contacts without pagination.

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
