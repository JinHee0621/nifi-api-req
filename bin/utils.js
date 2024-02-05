function requestFormat(host, port, path, method, header) {
    let format = {
        hostname : host,
        port : port,
        path : path,
        method : method,
        rejectUnauthorized: false,
        headers : header
    }
    return format;
}

module.exports = { requestFormat }