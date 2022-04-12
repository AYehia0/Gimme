## Before starting

Pre-installation:
  - mongodb
  - mongod-compass
  - postman

## Todo List to keep track of things

- [X] Setup the node workflow
- [X] Install the dependencies
  - express mongoose dotenv jsonwebtoken cors bcryptjs validator helmet  
  - DEV : nodemon
- [X] Init the server
- [ ] Fixes :
  - [ ] Fix all the un-nesseray try-catches
- [ ] API routes Documentations
  - [X] User endpoints
  - [X] Register endpoints
  - [X] Comment endpoints
  - [ ] Review endpoints : Shrink the ```customer/user review``` to only one route.
  - [ ] Room/Message endpoints : Room routes aren't needed anymore !
- [ ] Security
  - [ ] Add request logger
  - [ ] Prevent spamming, hehe
- [X] List the API routes
  - The database design
    - [ ] change mongoose required to : ```required: [true, "XXXX is required"]```
    - [X] User model
      - [X] Edit a user profile : EZ !!!
        - [ ] Check if the email is verified by sending an email to that email asking for a code or something 
      - [ ] Add limit to the number of comments a user can make : evil move.
      - [ ] Extending the user as features will be a lot.
        - [X] Setup multer to upload imgs
        - [X] Add a picture to the user
        - [X] In real life, the static files are stored in other server
      - [ ] Add the role to a list to make sure user can do both in the db.
   - [X] Authentication
    - [ ] Add refresh token : used to limit the session time, without asking the user to login again.
   - [X] Review
      - [X] Add review : One like One + comment and rate
   - [ ] Request 
      - [X] Create a Comment model to sep the Request from having dups in the same request
      - [X] Link the comment owners to the participants in the Requst
      - [X] Close a request by allowing only the creator or the Request to choose one (and only one) from the participants 
      - [X] Create a middleware for checking the existance of user in the comments 
        - [X] Test the middleware
        - [X] Apply the middleware
      - [X] Instead of checking for Requests author : create a middleware for it
      - [X] Use the mongoose aggregate method to perform multiple db queries as one
      - [ ] Create pagination for request rearching route : ```/request/search```
        - [ ] Return only opened requests
  - [ ] Features 
    - [ ] Chatting
      - [X] Design models for it
      - [X] Revert the msg controller [commit](https://github.com/AYehia0/Gimme/commit/9fb02bd313fdbc1436f51ce147a07f3057eaba77) and keep the ```addMsgToChat``` function, no need to create a route for that.
      - [X] Use jwt to authenticate sockets : [here](https://stackoverflow.com/questions/36788831/authenticating-socket-io-connections-using-jwt)
      - [ ] Block a user
      - [ ] Docs
    - [ ] Google Maps API
      - [X] Obtain the google api key : 
        - PS : The frontend will store the api key, also the location things will be handled in the frontend, the backend will be only used to store the location
        - Another solution is to hide the api key in the backend but it's not going to work here as the frontend SDK uses depends upon it.
      - [X] Update the location of the request : new route ```PS : you can use the /request/edit``` 
      - [ ] Track user's location : add to the user 
      - [ ] Fix updating the request fails due to the geoJSON type not given, wtf !!
    - [ ] Notification System
      - [ ] When you send a notification, you should also store the notification for that user in the database. Whenever the user opens the app, you should request for the notification table for each user, and mark the one that he/she sees as seen.
      - [X] [Firebase](https://firebase.google.com/docs/cloud-messaging/manage-tokens) best practices for FCM token management
      - [X] Send notification when:
        - [ ] user accepts the request
        - [ ] user comments on your request
        - [ ] user sends you a message
        - [ ] user releases the money
        - [ ] Test it.
    - [ ] Payment using stripeJS
      - [X] Authenticate StripeJS
      - [X] Before choosing a mod, make sure that card contains (TRY) the money by holding the money
        - Process might fail if : authentication is failed, or card doesn't contain the exact amount
      - [ ] Release the money when MOD scans the QR code, what if the mod forgot his phone or it's dead by the time he delivered : so the user can let it gooooo (nice)
        - [ ] The MOD creates an expirable (why expirable ? idk lol, maybe for security) QR code, only the request owner can scan and decode, once he does it's over : payment is captured, then money is added to the MOD's account.
      - [ ] Add money to user's account
      - [ ] User can take his money after it reaches X EGP


  - [X] Rename the controllers
  - [X] Change the status code of all the responses


## Nice to have

1. Make multiple queries in one shot
```javascript
 //aggregate the message to get a nice informative res in one shot
 const msgAggregte = await Model.aggregate([
     // get msg
     {$match : {_id : msg._id }}, 
     {$lookup : {
         from : "rooms",
         localField : "roomId",
         foreignField : "_id",
         //foreginField : "_id",
         as : "roomId"
     }},
 ])

```
2. Split the workflow 

    It's a good practice to use ```NODE_ENV=test``` depending on the env you're running the code in.
```javascript 
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
```

3. Adding Immutable Properties In Mongoose.

```javascript
const schema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        immutable: true // ADD THIS PROPERTY HERE
    },
}
```