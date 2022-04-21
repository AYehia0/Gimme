class ServerError extends Error{
    constructor (message, code) {
        super(message)
        this.code = code
    }
}
export default {
    ServerError,
    user : {
        login : "Not authorized",
        notFound : "User not found",
        auth : "You're not allowed to perform this action",
        registered : "Account already exists",
    },
    invalid : {
        required : function (propery) {
            return `${propery} is required`
        },
        missing : "Invalid Syntax : There are some missing fields",
        id : "The given ID is either invalid or doesn't exist",
        location : "Invalid geoJSON type :  { 'type' : 'Point' } is required or the coordinates are invalid",
        reviewAdded : "Can't add review to this request : already added or not authorized",
    }, 
    request : {
        delete : "You aren't allowed to delete a request with a state of fulfilled",
        edit : "You aren't allowed to edit a request with a state of fulfilled/closed",
        notfound : "You're trying to access a request that doesn't exist",
        modChoosen : "This request doesn't accept any comments : MOD is already choosen",
        closed : "You're not allowed to perform this : request is already closed",
        noMod : "This is request isn't fulfilled yet"
    },
    comment : {
        commented : "You aren't allowed to have more than one comment on the same request",
        notfound : "You're trying to access a comment that doesn't exist",
        yourRequest : "You aren't allowed to comment on your request, LOL",
        price : "The price can't be less than the minimum range of the request",
        delete : "You're not allowed to delete your own comment if you're already chossen as MOD"
    },
}