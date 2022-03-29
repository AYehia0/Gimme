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
    }
}


module.exports = API_DATA