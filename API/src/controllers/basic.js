function prepareResponse(res, err) {
    if (err) {
        return res.send({status: 'ERROR'})
    }
    return res.send({status: 'OK'})
}

module.exports = {prepareResponse}