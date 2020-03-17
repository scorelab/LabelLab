import bcrypt
from flask import abort, request
from models.user import User

salt = bcrypt.gensalt(rounds=8)


def register():
    data = request.get_json()
    name = data['name']
    username = data['username']
    password = data['password']
    password = ''.join(format(i, 'b') for i in bytearray(password, encoding='utf-8'))
    password = bcrypt.hashpw(password.encode('utf-8'), salt)
    password = str(password)
    email = data['email']
    newUser = User(name=name, username=username, password=password, email=email)
    newUser.save()
    return "Registered the user!!"


def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    currUser = User.query.fiter(username=username)
    if not currUser:
        abort(404)
    if bcrypt.checkpw(password.encode('utf-8'), currUser.password):
        print("The user has been logged in.")
        # Along with this return jwt token
        return "Successfully logged in"
    else:
        abort(401)
