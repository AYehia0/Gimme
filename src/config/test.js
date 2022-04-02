const mongoose = require('mongoose')
const User = require("../models/User")

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
            "password" : "HelloSomeone123_"
        },
        USER_MOD : {
            "name" : "someoneElse",
            "email" : "someoneElse@email.com",
            "phone" : "01023438928",
            "password" : "HelloSomeoneElse123_"
        }
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
                "title" : "Electronic parts needed",
                "body" : "I need Something real quick",
                "fromLocation" : {
                        "type" : "Point",
                        "coordinates" : [23.402, 22.204]
                },
                "toLocation" : {
                        "type" : "Point",
                        "coordinates" : [-23.402, 28.204]
                },
                "priceRange" : {
                    "min" : 20,
                    "max" : 80
                },
                "timeRange" : {
                    "val" : 5
                }
            },
            WRONG : {
                "title" : "Electronic parts needed",
                "body" : "I need Something real quick",
                "fromLocation" : {
                        "type" : "Point",
                        "coordinates" : [23.402, 22.204, "something"]
                },
                "toLocation" : {
                        "type" : "Point",
                        "coordinates" : [-23.402, 28.204]
                }
            }
       }
   },
    COMMENT : {
        "time" : {
            "unit" : "d",
            "val" : 4
        },
        "price" : 30,
        "text" : "Hello, I will bring you thing, I have a car"
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
const getTokenTest = async (email) => {
    try {
        const user = await User.findOne({email: email})

        return user.token
        
    } catch (e) {
        throw new Error(e.message)
    }
}

module.exports = {
    API_DATA,
    CODES,
    getTokenTest
}