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

This application serves as a comprehensive digital phone book, providing users with a centralized platform to manage their contacts. 
Seamlessly integrated with the Nest framework, a robust Node.js framework renowned for its scalability and efficiency, this application offers an array of features to enhance contact management.

Users can effortlessly add, edit, search, and delete contacts, ensuring that their contact information is always up-to-date. 
Additionally, the application supports advanced functionalities such as marking contacts as favorites or blocking specific contacts.

Utilizing a combination of Redis cache and MySQL database, the application ensures fast and reliable access to contact information. 
The Redis cache optimizes performance by storing frequently accessed data, while the MySQL database securely stores and manages the complete set of contact details.

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

* Request example - 
```
GET /contacts/search HTTP/1.1
{
  "firstName": "J"
}
```

This request searches for contacts where the first name contains the letter "J" in a case-sensitive manner. 
Since pagination is not specified, the response will include a list of all contacts matching this filter.
By default, the skip parameter is set to 0, so all matching contacts will be returned. 
The contacts will be ordered by ID in ascending order. The response will also include the count of the returned contacts.

### Add Contact:
Add a new contact to the phone book.

* Request example - 
```
POST /contacts HTTP/1.1
{
 "firstName": "Zak",
 "phoneNumber": "0509998888"
}
```

This request adds a new contact to the phone book with the first name "Zak" and the phone number "0509998888".

The fields lastName, isFavorite, and isBlocked have default values. 
Therefore, the lastName will be an empty string, isFavorite will be false, and isBlocked will be false.
The rest of the fields, if not obtained from the client, will be set to null.

The firstName and phoneNumber fields are required. Without them, the request will fail.

It's important to note that the phoneNumber field must be a string and not a number.
Additionally, it must start with "0" or "+". If it starts with "0", the length must be 10 characters, otherwise, it must be 13 characters.

If the phone number already exists in the phone book, the request will fail.

Furthermore, both the first name and last name strings can contain only letters and spaces.

### Edit Contact: 
Update an existing contact's details.

* Request example - 
```
Patch /contacts/update?id=1 HTTP/1.1
{
"email": "zachti@mta.ac.il",
"note": "Hi Zak! Don't forge to eat your Mafrum!"
}
```
This request updates the contact with the ID of 1.
If no contact with this ID exists, an error will be thrown.
The request updates the email address to "zachti@mta.ac.il" and adds a note to the contact.
After the update, if the contact data is in the cache, it will be erased.

### Delete Contact: 
Remove a contact from the phone book.

* Request example - 
```
DELETE /contacts/delete?id=1 HTTP/1.1
```
This request deletes the contact with the ID of 1 from the phone book.
If no contact with this ID exists, an error will be thrown.
After the deletion, if the contact data is in the cache, it will be erased.

### Find All Contacts: 
Retrieve all contacts.

* Request example - 
```
GET /contacts/all?pagination=true HTTP/1.1

{
  "order": {
    "key": "lastName"
  }
}
```
by default the order type will be ascending, will not skip any contacts and will return 10 contacts per page.
Additionally, the response will contain the total count of contacts returned and the total number of pages they have been divided into.

### Count All Contacts: 
Count and retrieve the total number of contacts.

* Request example - 
``` 
GET /contacts/size HTTP/1.1
```

### Find All Favorite Contacts: 
Retrieve all contacts marked as favorites.

* Request example - 
```
GET /contacts/favorites HTTP/1.1
{
"skip" : 10,
order: {
  "key": "Id",
  "type": "desc"
}
```
This request retrieves all contacts that are marked as favorites in the phone book. 
Pagination is disabled, so the response will include a list of all favorite contacts, skipping the first 10 contacts. 
The contacts are ordered by ID in descending order, meaning the response will exclude the last 10 contacts (with the highest IDs), and the list will start from the latest IDs.
Additionally, the response will contain the total count of contacts returned.

### Find All Blocked Contacts: 
Retrieve all contacts that are blocked.

* Request example - 
```
GET /contacts/block?pagination=true HTTP/1.1
```
This request retrieves all contacts that are marked as blocked in the phone book. 
Pagination is enabled, so the response will include 10 contacts per page without skipping any contacts.
Additionally, the response will contain the total count of contacts returned and the total number of pages they have been divided into.

### Find Contact by ID:
Retrieve a contact by its unique identifier.

* Request example - 
```
GET /contacts/1 HTTP/1.1
```
This request fetches a contact with the ID of 1 from the phone book.
If no contact with this ID exists, an error will be thrown.
It will first check the cache to see if the data is available. 
If not, it will search in the database and then store the data in the cache.

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
