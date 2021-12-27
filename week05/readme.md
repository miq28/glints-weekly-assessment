# 5th Week Backend Assessment
Assignment checklist
- [x] Create a function to find, update and delete data. See: [index,js](index.js)
- [x] Create an API to get all data provided

**Deadline**: Sunday, 7 November 2021, 12:00 WIB (12 siang)

## Instructions
- Run ```npm i``` to install dependecies
- Run ```npm start``` to start the server.

Server should be started on port 8000

## API
### GET
```GET /profile``` to retrieve all records in the database.

Respond:
```json
{
  "code": 200,
  "status": "Ok",
  "data": [
    {
      "id": 2,
      "firstName": "Arman",
      "lastName": "Maulana",
      "age": 50
    },
    {
      "id": 3,
      "firstName": "Raisa",
      "lastName": "Adriana",
      "age": 31
    },
    {
      "id": 4,
      "firstName": "Isyana",
      "lastName": "Sarasvati",
      "age": 28
    },
    {
      "id": 5,
      "firstName": "Nazril",
      "lastName": "Irham",
      "age": 40
    }
  ]
}

```

```GET /profile/:id``` to retrieve 1 record from the database.

Response:
```json
{
  "record": {
    "id": 2,
    "firstName": "Arman",
    "lastName": "Maulana",
    "age": 50
  },
  "msg": "Record with id 2 found!"
}
```

### PUT
```PUT /profile/:id``` to update 1 record in the database.

Request body:
```json
{
    "firstName": "Jhon",
    "lastName": "Maulana",
    "age": 50
}
```

Response:
```json
{
  "record": {
    "id": 2,
    "firstName": "Jhon",
    "lastName": "Maulana",
    "age": 50
  },
  "msg": "Record with id 2 was updated!"
}
```


### DELETE
```DELETE /profile/:id``` to delete 1 record in the database.

Response should be updated (all) records in the database