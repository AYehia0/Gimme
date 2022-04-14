// validation for the registeration data coming from the user/frontend
/* 
    The validation checks : 
        - data is complete : name, email, age, password, phone 


*/
export default function validRegister (data) {

    if (data.name && data.email && data.password && data.phone)
        return true

    return false
}