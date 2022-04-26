# API Routes
## Notes
- This isn't the final version of the documentations, so things may be messy :D
- All the possible error messages are [here](../../src/helpers/error.js)
- All the possible success messages are [here](../../src/helpers/success.js)
- The returned response is the same almost everywhere : [here](../../src/helpers/responseTemplate.js)
- The Postman collection contains up-to-date routes : [collection](../postman/Gimme.postman_collection.json)
- Almost all the endpoints docs here are deprecated for returned responses and status codes.
- Thinking to move to [swagger.io](https://swagger.io/) for better docs or just use [postman docs](https://learning.postman.com/docs/publishing-your-api/documenting-your-api/), but after testing.
- To check all the routes, go to the [modules](../../src/modules/) and check ```*.routes.js```
- Input validation has been updated, after introducing [zod](https://github.com/colinhacks/zod) go to the [modules](../../src/modules/) and check ```*.validation.js```
    - validation errors are returned in the ```message```, probably it would be a good idea to add another field for it.

## Contents

- [Auth](./endpoints/auth.md)
- [User](./endpoints/user.md)
- [Request](./endpoints/request.md)
- [Comment](./endpoints/comment.md)
- [Review](./endpoints/review.md)
- [Notification](./endpoints/notification.md)
- [Payment](./endpoints//payment.md)

