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

class Test_Login(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.app = FLASKR.test_client()
        db.init_app(FLASKR)
        with FLASKR.app_context():
            db.create_all()
        self.app.post(
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

    def test_can_log_in_returns_200(self):
        response = self.app.post(
            "/api/v1/auth/login",
            data=json.dumps(
                dict(email=USER_DATA["email"], password=USER_DATA["password1"])
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["msg"], "You logged in successfully.")
        self.assertNotEqual(res["access_token"], "")
    
    def test_sees_error_message_if_password_is_incorrect(self):
        response = self.app.post(
            "/api/v1/auth/login",
            data=json.dumps(
                dict(
                    email=USER_DATA["email"],
                    password=USER_DATA["password1"] + "x",
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 402)
        self.assertEqual(
            res["msg"], "Wrong password, Please try again"
        )

    def test_sees_error_message_if_username_doesnt_exist(self):
        response = self.app.post(
            "/api/v1/auth/login",
            data=json.dumps(
                dict(
                    email=USER_DATA["email"] + "x",
                    password=USER_DATA["password1"],
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            res["msg"], "Invalid email, Please try again"
        )

    @classmethod
    def tearDownClass(self):
        with FLASKR.app_context():
            db.drop_all()
        pass

if __name__ == "__main__":
    unittest.main()