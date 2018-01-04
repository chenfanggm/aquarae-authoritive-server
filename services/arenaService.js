const users = {}

module.exports = {
  addUser(ws, user) {
    users[user.id] = {...user, ws}
  }
}