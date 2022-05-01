import Request from '../../models/Request'
import User from '../../models/User'

const CODES = {
    NOT_FOUND : 404,
    OK : 200,
    BAD : 400,
    CONFLICT : 409,
    FORBIDDEN : 403
}

const API_DATA = {
    REGISTER : {
        USER_NORMAL : {
            "name" : "someone",
            "email" : "someone@email.com",
            "phone" : "01023438928",
            "password" : "HelloSomeone123_",
            "age" : 24
        },
        USER_MOD : {
            "name" : "someoneElse",
            "email" : "someoneElse@email.com",
            "phone" : "01023438929",
            "password" : "HelloSomeoneElse123_"
        }
    },
    EDIT : {
        USER_NORMAL : {
            "name" : "someone",
            "password" : "HelloSomeone123_edited",
            "age" : 25
        },
    },
    LOGIN : {
        USER_NORMAL : {
            "email" : "someone@email.com",
            "password" : "HelloSomeone123_"
        },
        USER_NORMAL_404 : {
            "email" : "someone1@email.com",
            "password" : "HelloSomeone123_"
        },
        USER_NORMAL_WRONG_PASS : {
            "email" : "someone@email.com",
            "password" : "wrongPassword"
        },
        USER_MOD : {
            "email" : "someoneElse@email.com",
            "password" : "HelloSomeoneElse123_"
        }
    },
    REQUEST : {
        NORMAL : {
            "title" : "Electronic parts needed",
            "body" : "I need someone to bring me some Electronic parts from this store, I will be waiting for it, thanks in advance",
            "fromLocation" : {
                    "type" : "Point",
                    "coordinates" : [23.402, 22.204]
            },
            "toLocation" : {
                    "type" : "Point",
                    "coordinates" : [-23.402, 28.204]
            },
            "toAddress" : "Tanta Al-Hussiny Magry ST-42",
            "fromAddress" : "Cairo Hadaiq Sayed-Mohamed ST-40",
            "priceRange" : {
                "min" : 20,  
                "max" : 90
            },
            "timeRange" : {
                "val" : 2
            }
        },
        EDITED : {
            NORMAL : {
                "title" : "Electronic parts needed, edited",
                "body" : "I need Something real quick",
                "fromLocation" : {
                        "type" : "Point",
                        "coordinates" : [23.402, 22.204]
                },
            },
            WRONG : {
                "title" : "Electronic parts needed",
                "body" : "I need Something real quick",
                "fromLocation" : {
                        "type" : "Point",
                        "coordinates" : [23.402, 22.204, "something"]
                },
                "toAddress" : "Tanta Al-Hussiny Magry ST-42",
                "fromAddress" : "Cairo Hadaiq Sayed-Mohamed ST-40",
                 "toLocation" : {
                        "type" : "Point",
                        "coordinates" : [-23.402, 28.204]
                }
            }
       }
   },
    COMMENT : {
        NEW_COMMENT :  {
            "time" : {
                "unit" : "d",
                "val" : 4
            },
            "price" : 30,
            "text" : "Hello, I will bring you thing, I have a car"
        }, 
        EDITED_COMMENT :  {
            "time" : {
                "unit" : "d",
                "val" : 4
            },
            "price" : 80,
            "text" : "Hello, I am the best one to do this as I am ..."
        }, 
    },
    REVIEWS : {
        USER_NORMAL : {
            "comment" : "Good man, the best one to deliver",
            "rate" : 5
        },
        MOD : {
            "comment" : "Had fun working with him, would probably deliver more things",
            "rate" : 5
        }
    }

}

// get user's token by email
const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({email: email})

        return user
        
    } catch (e) {
        throw new Error(e.message)
    }
}

// get a request
const getRequestByUserId = async (userId) => {
    try {
        const request = await Request.findOne({userId: userId})

        return request
        
    } catch (e) {
        throw new Error(e.message)
    }
}


export default {
    API_DATA,
    CODES,
    getUserByEmail,
    getRequestByUserId
}