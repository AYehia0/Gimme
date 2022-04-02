# Notification 

The main api is : ```/api/notify```

## Update The Token

Subscribe the user to the notification by saving the device's token to the db.

Make sure to read [this](https://firebase.google.com/docs/cloud-messaging)

* **URL**

  ```/update```

* **Method:**

  `POST`
  
*  **URL Params**

   ```token: [String]```

* **Data Params**

    **Required:**

    ```javascript
    {
      "token" : "...."
    }
    ```
* **Success Response:**

  * **Code:** 200 <br />

    **Content:** None
    ```json
    {
      "status": true,
      "message": "Token has been updating !!!",
      "data": ""
    }
* **Error Response:**

  * **Code:** 400 Bad Request <br />

    **Content:** 
    ```json
    {
      "status": false,
      "message": "Device Token is required !!!",
      "data": ""
    }

* **Sample Call:**

  ```bash
  curl --location --request POST 'http://localhost:8080/api/notify/update' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjQ1MmU4NGJiYjEzZWE4YzNhNDFmYzkiLCJpYXQiOjE2NDg5MzYwMDd9.V7z-LQI_bU8T8YCzGK4I5VbplMt8FegIm-FNJG65wvk' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "token" : "some_device_token"
  }'
  ```