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
        notFound : "This username isn't registered",
        headerToken: "Authorization token is required : make sure to set it in the headers",
        tokenExpired: "User not found or token has been expired",
        auth : "You're not allowed to perform this action",
        registered : "Account already exists",
        wrong : "Username or password is wrong",
        hasAccount : "This user already has a stripe account",
        noAccount : "You're not allowed to perfrom this before you register your payment account, so that you can receive payments"
    },
    invalid : {
        required : function (propery) {
            return `${propery} is required`
        },
        fileType : "Invalid Type : We only accept files of type image",
        fileSize : "You exceeded the max filesize : bigger than you mom",
        route_404 : "Oh no you are lost :( , read the documentation to find your way back",
        phone : "Invalid Phone Number", 
        email : "Invalid email",
        reviewQuery : "Invalid role, make sure it's either a 'customer' or 'mod'",
        missing : "Invalid Syntax : There are some missing fields",
        id : "The given ID is either invalid or doesn't exist",
        invalidId: "This is not a valid ID",
        location : "Invalid geoJSON type :  { 'type' : 'Point' } is required or the coordinates are invalid",
        reviewAdded : "Can't add review to this request : already added or not authorized",
    }, 
    request : {
        delete : "You aren't allowed to delete a request with a fulfilled state",
        edit : "You aren't allowed to edit a request with a state of fulfilled/closed",
        notfound : "You're trying to access a request that doesn't exist",
        modChoosen : "This request doesn't accept any comments/sessions : MOD is already choosen",
        closed : "You're not allowed to perform this : request is already closed",
        noMod : "This is request isn't fulfilled yet"
    },
    comment : {
        commented : "You aren't allowed to have more than one comment on the same request",
        notfound : "You're trying to access a comment that doesn't exist, or you're not authorized",
        yourRequest : "You aren't allowed to comment on your request, LOL",
        price : "The price can't be less than the minimum range of the request",
        delete : "You're not allowed to delete your own comment if you're already chossen as MOD"
    },
}