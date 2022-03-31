# Stories

## User
- User is either a employer (normal user) or shipper (MOD) or both.

- User are required to register with all : 
    - email : must be verified
    - phone
    - age > 20
    - password : must be strong ! 
- User can sign-in with : 
    - email/phone number 
    - password
- User can create (open) a request.
- User can view other requests by location.
- User can Search for a store (location) to buy from, while opening the request.
- User is limited to open X requests a day.
- User is trusted when they reach certain limit of successful (paid) operations.
- User can edit/delete request with some validations :
    - MOD isn't yet choosen.
    - Request isn't closed/fulfilled (check the request section)
- User can edit thier profile.
- User's profile contains :
    - Username
    - Picture
    - Joined in.
    - Reviews as both employer and MOD.
    - ~~Working Price~~
    - Available for work ?

- User can have an image 
    - Image size can't exceed X mb
- User can give reviews to others (under some conditions) :
    - Request is fulfilled/closed
    - The other part gave review.
- User can Pay to others with only credit cards.
- User must verify the operation when he receives the shippment by scanning a QR code.
- User can comment on others requests' (check the comment section) 
- User can chat with others (under some conditions) :
    - With only commented users, that are still commented only.
    - If the request is closed, user can't chat with other commented users.
    - The request maker can only start the chat

- User and MOD can't close a request once MOD is choosen.
- User can update his current location, and notify others for being available to work.
- Users in certain location are notified when there is an open request.

## The Request

Request is an act of asking for delivery.

- Request has 4 states : 
    - on (no MOD is choosen). 
    - fulfilled (MOD is choosen but payment isn't done)
    - closed (payment is completed)
    - deleted 

- To create a request, user must enter :
    - Title
    - Description
    - Price range (min - max) EGP
    - Time (hours, days, weeks)
    - Start Location : where store is located.
    - End Location : where user is (requires GPS location) or other location.
    - ~~Type :(food, electronics, ...)~~ 

## The Comment 

Comment is a MOD proposal for the job.

- Comments are shown in the request.
- Comments can be reviewed by anyone authenticated : ~~unless employer make it hidden~~
- Any Comment must have :
    - Request related to it.
    - Body : text <= X chars
    - Price range : >= Request's min price
- The comments are deleted when the request is deleted.
- Comment can't be deleted if the request is fulfilled.

## The Review

Review is a rating indication.

- Review is from 1-5 stars
- Review is given after request is done.
- Any Review must have : 
    - Request related to it with request title.
    - Comment.
    - Stars (1-5)
- Reviews are shown in user's profile.

## The Message

Message is a text sent to ther others for easy communication.

- Message is text only, ~~May have other types~~
- Messages are stored in a room, the room is one-to-one chatroom.
