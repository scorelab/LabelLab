from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    jwt_refresh_token_required,
    get_jwt_identity,
    get_raw_jwt,
)
from api.extensions import db
from api.models.User import User
from api.models.RevokedToken import RevokedToken
from api.helpers.user import (
    find_by_user_id,
    find_by_email, 
    find_by_user_id,
    find_by_username, 
    get_data,
    save, 
    to_json, 
    get_data,
    get_user_roles,
    get_projectmembers,
    search_user
)

class Register(MethodView):
    """This class registers a new user."""
    
    def post(self):
        """Handle POST request for this view. Url --> /api/v1/auth/register"""
        # getting JSON data from request
        post_data = request.get_json(silent=True,force=True)

        try:
            name = post_data["name"]
            username = post_data["username"]
            email = post_data["email"]
            password = post_data["password"]
            password2 = post_data["password2"]
        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        # Querying the database with requested email
        user = find_by_email(email)

        if user:
            # There is an existing user. We don't want to register users twice
            # Return a msg to the user telling them that they they already
            # exist
            response = {
                "success": False,
                "msg": "Email already exists. Please login."
            }
            return make_response(jsonify(response)), 400

        # Querying the database with requested username
        user = find_by_username(username)
        
        if user:
            # There is an existing username. We don't want to register users twice
            # Return a msg to the user telling them that the username already
            # exist
            response = {
                "success": False,
                "msg": "Username already exists. Please choose a different one."
            }
            return make_response(jsonify(response)), 400

        # There is no user so we'll try to register them

        # If passwords don't match, return error
        if password != password2:
            response = {
                "success": False,
                "msg": "Both passwords does not match"
            }
            return make_response(jsonify(response)), 400
        
        """Save the new User."""
        try:
            user = User(email=email, 
                        password=password, 
                        name=name, 
                        username=username)
            user = save(user)
        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Something went wrong!!"
            }
            return make_response(jsonify(response)), 500

        response = {
                    "success": True,
                    "msg": "You registered successfully. Please log in.",
                    "body": user
                    }

        # return a response notifying the user that they registered
        # successfully
        return make_response(jsonify(response)), 201


class Login(MethodView):
    """This class-based view handles user login and access token generation."""

    def post(self):
        """Handle POST request for this view. Url ---> /api/v1/auth/login/"""
        data = request.get_json(silent=True,
                                force=True)
        try:
            email = data["email"]
            password = data["password"]
        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400
        
        # Get the user object using their email (unique to every user)
        # print(dir(User.User))
        user = find_by_email(email)
        get_projectmembers(1)
        if not user:
            # User does not exist. Therefore, we return an error msg
            response = {
                "success": False,
                "msg": "Invalid email, Please try again"
            }
            return make_response(jsonify(response)), 400

        # Try to authenticate the found user using their password
        if not user.verify_password(password):
            response = {
                "success": False,
                "msg": "Wrong password, Please try again"
            }
            return make_response(jsonify(response)), 402

        access_token = create_access_token(identity=user.id, fresh=True)
        refresh_token = create_refresh_token(user.id)

        if not access_token or not refresh_token:
            response = {
                "success": False,
                "msg": "Something went wrong!"
            }
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500
        
        # Generate the access token. This will be used as the
        # authorization header
        response = {
            "success": True,
            "msg": "You logged in successfully.",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "body": to_json(user),
        }
        return make_response(jsonify(response)), 200

class Auth(MethodView):
    """
    This class-based view handles user 
    register and access token generation \
    via 3rd sources like github, google
    """

    def post(self):
        # Querying the database with requested email
        data = request.get_json(silent=True,
                                force=True)

        try:
            name = data["name"]
            username = data["username"]
            email = data["email"]
        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        user = find_by_email(email)

        if not user:
            # There is no user so we'll try to register them
            user = User(email=email, 
                        username= username, 
                        name=name)

            try:
                user_new = save(user)
            except Exception:
                # An error occured, therefore return a string msg
                # containing the error
                response = {
                    "success": False,
                    "msg": "Something went wrong!"
                }
                return make_response(jsonify(response)), 500

            access_token = create_access_token(identity=user_new['id'], fresh=True)
            refresh_token = create_refresh_token(user_new['id'])

            if not access_token:
                response = {
                    "success": False,
                    "msg": "Something went wrong!"
                }
                # Return a server error using the HTTP Error Code 500 (Internal
                # Server Error)
                return make_response(jsonify(response)), 500

            # Generate the access token. This will be used as the
            # authorization header
            response = {
                "success": True,
                "msg": "You logged in successfully.",
                "access_token": access_token,
                "refresh_token": refresh_token,
                "body": user_new
            }
            return make_response(jsonify(response)), 201

        else:
            # There is an existing user, Let him login.
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(user.id)

            response = {
                "success": True,
                "msg": "You logged in successfully.",
                "access_token": access_token,
                "refresh_token": refresh_token,
                "body": to_json(user)
            }
            return make_response(jsonify(response)), 202

class LogoutAccess(MethodView):
    """
    This method removes the access token on logout and stores the revoked token.
    """
    @jwt_required
    def post(self):
        jti = get_raw_jwt()["jti"]
        try:
            revoked_token = RevokedToken(jti=jti)
            revoked_token.add()
            response = {"msg": "Access token has been revoked"}
            return make_response(jsonify(response)), 200
        except Exception:
            response = {"msg": "Something went wrong!"}
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500


class LogoutRefresh(MethodView):
    """
    This method removes the refresh token on logout and stores the revoked token.
    """
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()["jti"]
        try:
            revoked_token = RevokedToken(jti=jti)
            revoked_token.add()
            response = {"msg": "Refresh token has been revoked"}
            return make_response(jsonify(response)), 200
        except Exception:
            response = {"msg": "Something went wrong!"}
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500


class TokenRefresh(MethodView):
    """
    This method is called when the access token is missing or is expired.
    """
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user, 
                                           fresh=False)

        response = {
            "msg": "Token refreshed successfully",
            "access_token": access_token,
        }
        return make_response(jsonify(response)), 201

class UserInfo(MethodView):
    """This class-based view handles retrieving the current \
    user's information"""

    @jwt_required
    def get(self):
        current_user = get_jwt_identity()

        user = find_by_user_id(current_user)

        if user is None:
            response = {
                "success": False,
                "msg": "User not found."
            }
            return make_response(jsonify(response)), 404

        response = {
            "success": True,
            "msg": "User found.",
            "body": user
        }
        return make_response(jsonify(response)), 200

class CountInfo(MethodView):
    """This class-based view handles the count of images and labels."""

    @jwt_required
    def get(self):
        current_user = get_jwt_identity()

        user = get_data(current_user)

        if user is None:
            response = {
                "success": False,
                "msg": "User not found."
            }
            return make_response(jsonify(response)), 404
        
        projects = user["all_projects"]
        total_projects = len(user["all_projects"])
        total_images = 0
        total_labels = 0
        for i in range(total_projects):
            total_images += len(projects[i]["images"])
            total_labels += len(projects[i]["labels"])

        data = {
            "total_projects": total_projects,
            "total_images": total_images,
            "total_labels": total_labels
        }
        response = {
            "success": True,
            "msg": "Counts fetched.",
            "body": data
        }
        return make_response(jsonify(response)), 200

class SearchUsers(MethodView):
    """This class-based view handles the Users search"""

    @jwt_required
    def get(self,query):

        if query is None or "":
            response = {
                "success": False,
                "msg": "No user input"
            }
            return make_response(jsonify(response)), 400

        users = search_user(query)
        response = {
            "success": True,
            "msg": "Users fetched.",
            "body": users
        }
        return make_response(jsonify(response)), 200

userController = {
    "register": Register.as_view("register"),
    "login": Login.as_view("login"),
    "logout_access": LogoutAccess.as_view("logout_access"),
    "logout_refresh": LogoutRefresh.as_view("logout_refresh"),
    "token_refresh": TokenRefresh.as_view("token_refresh"),
    "oauth": Auth.as_view("oauth"),
    "user": UserInfo.as_view("user"),
    "count_info": CountInfo.as_view("count_info"),
    "search_users": SearchUsers.as_view("search_users")
}