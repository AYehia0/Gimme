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
- [X] List the API routes
  - The database design
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
    - [X] Review
      - [X] Add review : One like One + comment and rate
    - [ ] Request 
      - [X] Create a Comment model to sep the Request from having dups in the same request
      - [X] Link the comment owners to the participants in the Requst
      - [X] Close a request by allowing only the creator or the Request to choose one (and only one) from the participants 
      - [X] Create a middleware for checking the existance of user in the comments 
        - [ ] Test the middleware
        - [ ] Apply the middleware
      - [ ] Instead of checking for Requests author : create a middleware for it
      - [ ] Use the mongoose aggregate method to perform multiple db queries as one
  - [ ] Features 
    - [ ] Chatting
      - [X] Design models for it
      - [ ] Revert the msg controller [commit](https://github.com/AYehia0/Gimme/commit/9fb02bd313fdbc1436f51ce147a07f3057eaba77) and keep the ```addMsgToChat``` function, no need to create a route for that.
      - [ ] Use jwt to authenticate sockets : [here](https://stackoverflow.com/questions/36788831/authenticating-socket-io-connections-using-jwt)
      - [ ] Block a user
    - [ ] Google Maps API
    - [ ] Notification System
  - [X] Rename the controllers
  - [X] Change the status code of all the responses


## Nice to have

Make multiple queries in one shot
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