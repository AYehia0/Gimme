const Request = require("../models/Request")

const setRequestLocation = async (req, res) => {
    try {

        // the user to send
        const reqId = req.params.id
        const locations = req.body
        // getting the request
        await Request.updateRequestLocations(reqId, locations)

        res.send({
            status: true,
            message: "Success : Location has been updated !",
            data: "" 
        })

    } catch (e) {
        let message = e.message
        res.send({
            status: false,
            message: message,
            data: ""
        })
    }
}

module.exports =  {
    setRequestLocation,
}