# Request

The main api is : ```/api/request```
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