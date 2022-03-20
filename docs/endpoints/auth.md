# Authorization

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