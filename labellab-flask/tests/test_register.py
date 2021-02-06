import os
import unittest
import json
import sys
from dotenv import load_dotenv

sys.path.insert(0,os.path.dirname(os.getcwd()))

from api.main import create_app
from api.extensions import db

FLASKR = create_app("testing")

USER_DATA = dict(
    name="name1",
    email="example1@gmail.com",
    username="user1",
    password1="test1credentials",
    password2="test1credentials",
)

class Test_Register(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.app = FLASKR.test_client()
        db.init_app(FLASKR)
        with FLASKR.app_context():
            db.create_all()
        
    def test_can_register(self):
        response = self.app.post(
            "/api/v1/auth/register",
            data=json.dumps(
                dict(
                    name=USER_DATA["name"],
                    email=USER_DATA["email"],
                    username=USER_DATA["username"],
                    password=USER_DATA["password1"],
                    password2=USER_DATA["password2"],
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            res["msg"], "You registered successfully. Please log in."
        )

    def test_sees_error_message_if_passwords_dont_match(self):
        response = self.app.post(
            "/api/v1/auth/register",
            data=json.dumps(
                dict(
                    name=USER_DATA["name"],
                    email=USER_DATA["email"] + "x",
                    username=USER_DATA["username"] + "2",
                    password=USER_DATA["password1"],
                    password2=USER_DATA["password2"] + "x",
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(res["msg"], "Both passwords does not match")

    def test_sees_error_message_if_user_already_registered(self):
        response = self.app.post(
            "/api/v1/auth/register",
            data=json.dumps(
                dict(
                    name=USER_DATA["name"],
                    email=USER_DATA["email"],
                    username=USER_DATA["username"],
                    password=USER_DATA["password1"],
                    password2=USER_DATA["password2"],
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(res["msg"], "Email already exists. Please login.")

    @classmethod
    def tearDownClass(self):
        with FLASKR.app_context():
            db.drop_all()
        pass

if __name__ == "__main__":
    unittest.main()