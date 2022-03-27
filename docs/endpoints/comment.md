# Comment 

The main api is : ```/api/comment```

## Add a comment

Add a comment to a request.

* **URL**

  ```/comment/:reqId```

* **Method:**

  `POST`
  
*  **URL Params**

   None

* **Data Params**

    **Required:**

    ```javascript
    {
      "time" : {
          "unit" : "d",
          "val" : 4
      },
      "price" : 30,
      "text" : "Hello, I will bring you thing, I have a car"
    }
    ```
* **Success Response:**

  * **Code:** 200 <br />

    **Content:** None
    ```json
    {
      "status": true,
      "message": "Success: Comment has been added !!!",
      "data": ""
    }
* **Error Response:**

  * **Code:** 403 Forbidden <br />

    **Content:** 
    ```json
    {
      "status": false,
      "message": "MOD is already choosen !!!",
      "data": ""
    }

  * **Code:** 400 Bad Request <br />

    **Content:** 
    ```json
    {
      "status": false,
      "message": "Price can't be less than the minimum range",
      "data": ""
    }

* **Sample Call:**

  ```bash
    curl --location --request POST 'http://localhost:8080/api/comment/comment/620e6aad9c7c24049b4f84e0' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDgyMjA1MzR9.1KuM7Un_83UOCmVgMwUKT9rDdyu7do58fVlSadxGSy8' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "time" : {
            "unit" : "d",
            "val" : 4
        },
        "price" : 30,
        "text" : "Hello, I will bring you thing, I have a car"
    }'
  ```

## Edit a comment

Add a comment to a request.

* **URL**

  ```/comment/:id```

* **Method:**

  `PUT`
  
*  **URL Params**

    ```id=CommentID/RequestID```
* **Data Params**

    **Required:**

    ```javascript
    {
      "time" : {
          "unit" : "d",
          "val" : 2
      },
      "price" : 50,
      "text" : "Hello, I have a car, Edited!!!"
    }
    ```
* **Success Response:**

  * **Code:** 200 <br />

    **Content:** None
    ```json
    {
      "status": true,
      "message": "Success : Comment has been edited !!!",
      "data": ""
    }
* **Error Response:**

  Same error responses as the ```POST``` 
   
* **Sample Call:**

  ```bash
  curl --location --request PUT 'http://localhost:8080/api/comment/comment/620e6aad9c7c24049b4f84e0' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDUxMTA1MDN9.aFDqnj9BS4QEOpzfPW6fttFWcZuLRCmJ21zfWzG0CX4 ' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "time" : {
          "unit" : "d",
          "val" : 2
      },
      "price" : 50,
      "text" : "Hello, I will bring you thing, I have a car, Edited!!!"
  }'
  ```
## Delete a comment

Delete a comment from a request (if commented ofc !)

* **URL**

  ```/comment/:id```

* **Method:**

  `DELETE`
  
*  **URL Params**

    ```id=CommentID/RequestID```

* **Data Params**

    **Required:**
    None
* **Success Response:**

  * **Code:** 200 <br />

    **Content:**
    ```json
    {
      "status": true,
      "message": "Success : Comment has been deleted !!!",
      "data": ""
    }
    
* **Error Response:**

  * **Code:** 404 Not Found <br />

    **Content:** 
    ```json
    {
      "status": true,
      "message": "Comment doens't exist",
      "data": ""
    }
* **Sample Call:**

  ```bash
  curl --location --request DELETE 'http://localhost:8080/api/comment/comment/620e6aad9c7c24049b4f84e0' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDUxMTA1MDN9.aFDqnj9BS4QEOpzfPW6fttFWcZuLRCmJ21zfWzG0CX4 ' \
  --data-raw ''
  ```

## Get Comments

Get all comments in a request.

* **URL**

  ```/comment/:id```

* **Method:**

  `GET`
  
*  **URL Params**

    ```id=RequestID```

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
      "data": [
          {
              "time": {
                  "unit": "d",
                  "val": 4
              },
              "_id": "621900cbe84821ba7140f96e",
              "userId": "6215bfcc9f304e65e8e337e5",
              "text": "Hello, I will bring you thing, I have a car",
              "price": 30,
              "mod": true,
              "__v": 0
          }
      ]
    }
* **Error Response:**

  * **Code:** 400 Bad Request <br />

    **Content:** 
    ```json
    {
      "status": false,
      "message": "Invalid ID : Make sure it's a valid RequestID",
      "data": ""
    }

* **Sample Call:**

  ```bash
  curl --location --request GET 'http://localhost:8080/api/comment/comment/620e6aad9c7c24049b4f84e0' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDgyMjA1MzR9.1KuM7Un_83UOCmVgMwUKT9rDdyu7do58fVlSadxGSy8' \
  --data-raw ''
  ```


