# Payment 

The main api is : ```/api/payment```

## Get The PublishableKey

Get the publishable key from the backend, which is used in the [frontend](https://stripe.com/docs/keys). ```AUTH```

* **URL**

  ```/config```

* **Method:**

  `GET`
  
*  **URL Params**

  None

* **Data Params**

    **Required:**

    None

* **Success Response:**

  * **Code:** 200 <br />

    **Content:** None
    ```json
    {
      "status": true,
      "message": "",
      "data": "pk_XXXXXXXXXX"
    }
* **Error Response:**

    None
* **Sample Call:**

 ```bash
  curl --location --request GET 'http://localhost:8080/api/payment/config' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjQ1MmU4NGJiYjEzZWE4YzNhNDFmYzkiLCJpYXQiOjE2NDkyNDg1Mzl9.rJNrqM64HORD4zPyuWetcg9LV9xuwLlzj0yP67vTHIM' \
  --data-raw ''
  ```
## Create Stripe Session

Create a stripe session used to hold the payment, since I don't know how the frontend would use the session as only ```url``` is needed. ```AUTH```

* **URL**

  ```/create-stripe-session```

* **Method:**

  `POST`
  
*  **URL Params**

    None

* **Data Params**

    **Required:**

    ```commentId=[String]```

    ```reqId=[String]```

* **Success Response:**

  * **Code:** 200 <br />

    **Content:** None
    ```json
    {
      "status": true,
      "message": "Session has been created !!!",
      "data": {
          "id": "cs_test_a15zPpF0Q2jR4AmQnP5DZtCjiA6BpE25zWZQqk33X964a3XTUisY5X65bs",
          "object": "checkout.session",
          "after_expiration": null,
          "allow_promotion_codes": null,
          "amount_subtotal": 3000,
          "amount_total": 3000,
          "automatic_tax": {
              "enabled": false,
              "status": null
          },
          "billing_address_collection": null,
          "cancel_url": "https://checkout.stripe.dev/cancel",
          "client_reference_id": "624d8d01468546f58e2cac79;6249ba0d7572a1812a68f6f3",
          "consent": null,
          "consent_collection": null,
          "currency": "egp",
          "customer": "cus_LTVsxuJ9bNVu0f",
          "customer_creation": null,
          "customer_details": {
              "address": null,
              "email": "admin@email.com",
              "name": null,
              "phone": null,
              "tax_exempt": "none",
              "tax_ids": null
          },
          "customer_email": null,
          "expires_at": 1649595699,
          "livemode": false,
          "locale": null,
          "metadata": {},
          "mode": "payment",
          "payment_intent": "pi_3Kmdv6B4NnMxVIuf1onz8P1r",
          "payment_link": null,
          "payment_method_options": {},
          "payment_method_types": [
              "card"
          ],
          "payment_status": "unpaid",
          "phone_number_collection": {
              "enabled": false
          },
          "recovered_from": null,
          "setup_intent": null,
          "shipping": null,
          "shipping_address_collection": null,
          "shipping_options": [],
          "shipping_rate": null,
          "status": "open",
          "submit_type": null,
          "subscription": null,
          "success_url": "https://checkout.stripe.dev/success",
          "total_details": {
              "amount_discount": 0,
              "amount_shipping": 0,
              "amount_tax": 0
          },
          "url": "https://checkout.url..."
      }
    }
* **Error Response:**

  * **Code:** 400 Bad Request<br />

    **Content:**     

    ```json
    {
      "status": false,
      "message": "Can't create a session : MOD already choosen !!!",
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
      "message": "Comment not found !!!",
      "data": ""
    }
* **Sample Call:**

 ```bash
    curl --location --request POST 'http://localhost:8080/api/payment/create-stripe-session' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjQ1MmU4NGJiYjEzZWE4YzNhNDFmYzkiLCJpYXQiOjE2NDkyNDg1Mzl9.rJNrqM64HORD4zPyuWetcg9LV9xuwLlzj0yP67vTHIM' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "commentId" : "624e5b53a62fa0412bc59b67",
        "reqId" : "624d8d01468546f58e2cac79"
    }'
 ```

## Stripe Webhook

Only used by stripe, to send real time notifications which is later used to perform certain actions.

* **URL**

  ```/webhook```

* **Method:**

  `POST`
  
*  **URL Params**

    None

* **Data Params**

    **Required:**

      Check Stripe's docs!

