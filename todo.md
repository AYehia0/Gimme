## Before starting

Pre-installation:
  - mongodb
  - mongodb-compass
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
      - [] Edit a user profile : EZ !!!
      - [] Add limit to the number of comments a user can make : evil move.
      - [] Extending the user as features will be a lot.
        - [X] Setup multer to upload imgs
        - [X] Add a picture to the user
      - [] Add the role to a list to make sure user can do both in the db.
   - [X] Authentication
    - [X] Review
      - [X] Add review : One like One + comment and rate
    - [] Request 
      - [X] Create a Comment model to sep the Request from having dups in the same request
      - [X] Link the comment owners to the participants in the Requst
      - [X] Close a request by allowing only the creator or the Request to choose one (and only one) from the participants 
      - [] Instead of checking for Requests author : create a middleware for it
  - [] Features 
    - [] Chatting
      - [] Design models for it
    - [] Google Maps API
    - [] Notification System
  - [] Rename the controllers
  - [] Change the status code of all the responses