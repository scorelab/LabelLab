import bcrypt
from flask import abort, jsonify, request
from models.user import User


salt = bcrypt.gensalt(rounds=8)


def register():
    name = request.form['name']
    username = request.form['username']
    password = bcrypt.hashpw(request.form['password'], salt)
    email = request.form['email']
    newUser = User(name=name, username=username, password=password, email=email)
    newUser.save()
    print("Registered the user!!")
    return jsonify(newUser)


def login():
    username = request.form['username']
    password = request.form['password']
    currUser = User.query.fiter(username=username)
    if not currUser:
        abort(404)
    if bcrypt.checkpw(password, currUser.password):
        print("The user has been logged in.")
        # Along with this return jwt token
        return "Successfully logged in"
    else:
        abort(401)
