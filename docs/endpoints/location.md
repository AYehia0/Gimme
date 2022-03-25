# Location 

The main api is : ```/api/location```
## Update Location
Update the location of comment/request ```AUTH```

* **URL**

  ```/update-location/:reqId```

* **Method:**

    `POST`
  
*  **URL Params**

    ```reqId=ObjectID```

* **Data Params**

    **Required:**

    ```javascript
    {
      "toLocation" : {
          "coordinates" : [23, 40]
      },
      "fromLocation" : {
          "coordinates" : []
      }
    }
* **Success Response:**

  * **Code:** 200 <br />

    **Content:**     

    ```json
    {
      "status": true,
      "message": "Success : Location has been updated !!!",
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
  curl --location --request PUT 'http://localhost:8080/api/location/update-location/620e6aad9c7c24049b4f84e0' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWZmZWIyYTQxOTYyZTBiZWU3ZmNlMzkiLCJpYXQiOjE2NDgxMDk0MjR9.MfFk_7uagcUFTwc0c5Culf8Q_yQtG3ouEjY_nxgR9T0' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "toLocation" : {
          "coordinates" : [23,40]
      },
      "fromLocation" : {
          "coordinates" : []
      }
  }'
  ```