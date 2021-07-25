module.exports.newChannel = (name) => {
    return { name, users: [] }
}

module.exports.getConId = (user, server) => {
    const index = Object.values(server.users).indexOf(user)
    return Object.entries(server.users)[index][0];
}