export default function resp (status, msg, data) {
    return {
        status : status,
        message : msg,
        data : data 
    } 
}