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