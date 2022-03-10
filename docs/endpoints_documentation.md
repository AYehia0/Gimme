# Documentation

[EndPoints Documentation, how to ?](https://idratherbewriting.com/learnapidoc/docendpoints.html)

# User

## Authorization

If any route has ```AUTH``` flag, that means a token is required to be set in the Headers before sending the request.

```Authorization: Bearer {token}```

* **Error Response:**

  * **Code:** 401 Not Authorized <br />

    **Content:** 
    ```json
    {
        "status": false,
        "message": "Invalid Token LOL",
        "data": ""
    }
  * **Code:** 403 Forbidden <br />

    **Content:** 
    ```json
    {
        "status": false,
        "message": "Authorization header isn't set properly",
        "data": ""
    }
## Register a new user

Create a new user account.

* **URL**

  ```/user/register```

* **Method:**

  `POST`
  
*  **URL Params**

   None

* **Data Params**

    **Required:**

    ```javascript
    {
        "name" : Name=[String],
        "email" : Email=[String],
        "phone" : PhoneNumber=[String],
        "password" : Password=[String]
    }
  ```
* **Success Response:**

  * **Code:** 200 <br />

    **Content:** None

* **Error Response:**

  * **Code:** 400 Bad Request <br />

    **Content:** 
    ```json
    {
        "status": false,
        "message": "User validation failed: ... is required.",
        "data": ""
    }
* **Sample Call:**

  ```bash
    curl --location --request POST 'http://localhost:8080/api/user/register' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name" : "notadmin",
        "email" : "notadmin@email.com",
        "phone" : "01023438920",
        "password" : "HelloNotadmin123_"
    }'
  ```

## Login a user

Login a User by email and password.

Password should meet the validator's [isStrongPassword()](https://www.npmjs.com/package/validator) method. 

* **URL**

  ```/user/login```

* **Method:**

  `POST`
  
*  **URL Params**

   None

* **Data Params**

    **Required:**

    ```javascript
    {
        "email" : Email=[String],
        "password" : Password=[String]
    }
  ```
* **Success Response:**

  * **Code:** 200 <br />

    **Content:**     
    ```javascript
    {
        "status": true,
        "message": "Login: success",
        "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDY3NDUwMTR9.oGYfw6v6ZsmwmCxHz6tPz3KR-_lwekdQ1rxuWlOu7-w"
    }
* **Error Response:**

  * **Code:** 404 Not Found <br />

    **Content:** 
    ```json
    {
        "status": false,
        "message": "Can't login!!!",
        "data": "User not found!!!"
    }
  * **Code:** 401 Unauthorized <br />

    **Content:** 
    ```json
    {
        "status": false,
        "message": "Can't login!!!",
        "data": "Incorrect Password!!!"
    }
  * **Code:** 400 Bad Request <br />

    **Content:** 
    ```json
    {
        "status": false,
        "message": "Can't login!!!",
        "data": "Invalid Syntax : Email and Password are required!"
    }
* **Sample Call:**

  ```bash
    curl --location --request POST 'http://localhost:8080/api/user/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "email" : "some@email.com",
        "password" : "somepassword123@_"
    }'
  ```
## User Profile

Get the profile of the logged in user. ```AUTH```

* **URL**

  ```/user/me```

* **Method:**

    `GET`
  
*  **URL Params**

    None 

* **Data Params**

    **Required:**

    None

* **Success Response:**

  * **Code:** 200 <br />

    **Content:**     

    ```json
    {
    "status": true,
    "message": "",
    "data": {
        "_id": "61ffeb2a41962e0bee7fce39",
        "name": "username",
        "email": "username@email.com",
        "phone": "01023456789",
        "createTime": "2022-02-06T15:37:14.163Z",
        "updatedAt": "2022-03-08T13:36:27.159Z",
        "__v": 0,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDY3NDY1ODd9.mjCMSwUH4JegshURio2aJQxbomCVljWgh4L1hZHvHJo",
        "isTrusted": false,
        "role": "nUser"
        }
    }
* **Error Response:**

    None

* **Sample Call:**

  ```bash
    curl --location --request GET 'http://localhost:8080/api/user/me' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDY3NDY1ODd9.mjCMSwUH4JegshURio2aJQxbomCVljWgh4L1hZHvHJo' \
    --data-raw ''
  ```
# Request
## Create Request
Open a Request ```AUTH```

* **URL**

  ```/request/open```

* **Method:**

    `POST`
  
*  **URL Params**

    None 

* **Data Params**

    **Required:**

    ```javascript
    {
      "title" : String[200],
      "body" : String[300],
      "fromLocation" : {
              "type" : "Point",
              "coordinates" : [Number, Number]
      },
      "toLocation" : {
              "type" : "Point",
              "coordinates" : [Number, Number]
      },
      "priceRange" : {
          "min" : Number,
          "max" : Number
      },
      "timeRange" : {
          "val" : Number
      }
    }
* **Success Response:**

  * **Code:** 200 <br />

    **Content:**     

    ```json
    {
      "status": true,
      "message": "Request has been created !!!",
      "data": ""
    }
* **Error Response:**

  * **Code:** 400 Bad Request<br />

    **Content:**     

    ```json
    {
      "status": false,
      "message": "Invalid Syntax : ...",
      "data": ""
    }

* **Sample Call:**

  ```bash
  curl --location --request POST 'http://localhost:8080/api/request/open' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDY3NDY1ODd9.mjCMSwUH4JegshURio2aJQxbomCVljWgh4L1hZHvHJo' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "title" : "Electronic parts needed",
      "body" : "I need someone to bring me some Electronic parts from this store, I will be waiting for it, thanks in advance",
      "fromLocation" : {
              "type" : "Point",
              "coordinates" : [23.402, 22.204]
      },
      "toLocation" : {
              "type" : "Point",
              "coordinates" : [-23.402, 28.204]
      },
      "priceRange" : {
        "min" : 20,
        "max" : 90
      },
      "timeRange" : {
          "val" : 2
      }
  }'
  ```

## Close Request
Close a Request, by choosing the MOD ```AUTH```

* **URL**

  ```/request/close```

* **Method:**

    `GET`
  
*  **URL Params**

    ```modId=[ObjectID]```

    ```reqId=[ObjectID]```

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />

    **Content:**     

    ```json
    {
      "status": true,
      "message": "Request has been closed !!!",
      "data": ""
    }
* **Error Response:**

  * **Code:** 403 Forbidden<br />

    **Content:**     

    ```json
    {
      "status": false,
      "message": "Can't perform this action !!!",
      "data": ""
    }
  * **Code:** 404 Not Found<br />

    **Content:**     

    ```json
    {
      "status": false,
      "message": "Request doesn't exist, are you sure it exists ?",
      "data": ""
    }
  * **Code:** 409 Conflict<br />

    **Content:**     

    ```json
    {
      "status": false,
      "message": "It's already closed, fulfilled or deleted !!!",
      "data": ""
    }
* **Sample Call:**

  ```bash
  curl --location --request GET 'http://localhost:8080/api/request/close?modId=6215bfcc9f304e65e8e337e5&reqId=620e6aad9c7c24049b4f84e0' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDY3NDY1ODd9.mjCMSwUH4JegshURio2aJQxbomCVljWgh4L1hZHvHJo' \
  --data-raw ''
  ```

## Edit Request
Edit a Request, same constraints as create but you can't edit if the state of the request is closed or fulfilled ```AUTH```

* **URL**

  ```/request/edit/:id```

* **Method:**

    `PUT`
  
*  **URL Params**

    ```reqId=[ObjectID]``` 

* **Data Params**

    **Required:**

    ```javascript
    {
      "title" : String[200],
      "body" : String[300],
      "fromLocation" : {
              "type" : "Point",
              "coordinates" : [Number, Number]
      },
      "toLocation" : {
              "type" : "Point",
              "coordinates" : [Number, Number]
      },
      "priceRange" : {
          "min" : Number,
          "max" : Number
      },
      "timeRange" : {
          "val" : Number
      }
    }
* **Success Response:**

  * **Code:** 200 <br />

    **Content:**     

    ```json
    {
      "status": true,
      "message": "Request has been created !!!",
      "data": ""
    }
* **Error Response:**

  * **Code:** 400 Bad Request<br />

    **Content:**     

    ```json
    {
      "status": false,
      "message": "Invalid Syntax : ...",
      "data": ""
    }
  * **Code:** 403 Forbidden<br />

    **Content:**     

    ```json
    {
      "status": false,
      "message": "Can't perform this action !!!",
      "data": ""
    }
  * **Code:** 404 Not Found<br />

    **Content:**     

    ```json
    {
      "status": false,
      "message": "Corrupted ID or Request not found",
      "data": ""
    }
## Delete Request
Delete a Request, same constraints as create but you can't delete if the state of the request is on ```AUTH```

* **URL**

  ```/request/delete/:id```

* **Method:**

    `DELETE`
  
*  **URL Params**

    None

* **Data Params**

  None

**Success Response:**

  * **Code:** 200 <br />

    **Content:**     

    ```json
    {
      "status": true,
      "message": "Request has been deleted !!!",
      "data": ""
    }
* **Error Response:**

  * **Code:** 400 Bad Request<br />

    **Content:**     

    ```json
    {
      "status": false,
      "message": "Invalid Syntax : ...",
      "data": ""
    }
  * **Code:** 403 Forbidden<br />

    **Content:**     

    ```json
    {
      "status": false,
      "message": "Can't perform this action / Can't delete : must be closed",
      "data": ""
    }
  * **Code:** 404 Not Found<br />

    **Content:**     

    ```json
    {
      "status": false,
      "message": "Corrupted ID or Request not found",
      "data": ""
    }
* **Sample Call:**

  ```bash
  curl --location --request DELETE 'http://localhost:8080/api/request/delete/620e6aad9c7c24049b4f84e0' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDU1OTMyNTl9.fs2VD-2o9gqqGYRXKSKN3nosTVTm-_uPGQMjeKEjXoU' \
  --data-raw ''
  ```
