# Review

The main api is : ```/api/review```
## Add Review
Add Review to a certain Request ```AUTH```

* **URL**

  ```/give-review/:reqId```

* **Method:**

    `POST`
  
*  **URL Params**

    ```reqId=ObjectID```

* **Data Params**

    **Required:**

    ```javascript
    {
      "comment" : "Had fun working with him, would probably deliver more things",
      "rate" : 5
    }
* **Success Response:**

  * **Code:** 200 <br />

    **Content:**     

    ```json
    {
      "status": true,
      "message": "Review has been added !!!",
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
  curl --location --request POST 'http://localhost:8080/api/review/give-review/620e6aad9c7c24049b4f84e0' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDgxNTA5ODJ9.yQBJW6j887PgqiWFUYtqmZ6weCyN7UMRUjttCEx3SF8' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "comment" : "Had fun working with him, would probably deliver more things",
      "rate" : 5
  }'
  ```

## Get User Reviews
Get User (Normal User/ Customer) Reviews ```AUTH```

* **URL**

  ```/reviews```

* **Method:**

    `GET`
  
*  **URL Params**

    ```job=["customer", "user"]```

* **Data Params**

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
                "_id": "623cc90463c9456721de4825",
                "reviewerId": "6215bfcc9f304e65e8e337e5",
                "toWhom": "61ffeb2a41962e0bee7fce39",
                "requestId": "620e6aad9c7c24049b4f84e0",
                "title": "Electronic parts needed",
                "body": "Had fun working with him, would probably deliver more things",
                "rate": 5,
                "flow": "user",
                "__v": 0
            }
        ]
      }
* **Error Response:**
    None

* **Sample Call:**

  ```bash
  curl --location --request GET 'http://localhost:8080/api/review/reviews?job=user' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDgxNTA5ODJ9.yQBJW6j887PgqiWFUYtqmZ6weCyN7UMRUjttCEx3SF8' \
  --data-raw ''
  ```