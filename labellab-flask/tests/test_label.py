import os
import unittest
import json
import sys
from dotenv import load_dotenv

sys.path.insert(0,os.path.dirname(os.getcwd()))

from api.main import create_app
from api.extensions import db

FLASKR = create_app("testing")

LABEL_DATA = dict(
    label_name="name",
    label_type="bbox"
)
PROJECT_DATA = dict(
    project_name="name1",
    project_description="description"
)

USER_DATA = dict(
    name="name1",
    email="example1@gmail.com",
    username="user1",
    password1="test1credentials",
    password2="test1credentials"
)

label_id=""
class Test_Project(unittest.TestCase):
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
        self.auth_token=res["access_token"]

        response = self.app.post(
            "/api/v1/project/create",
            data=json.dumps(
                dict(
                    project_name=PROJECT_DATA["project_name"],
                    project_description=PROJECT_DATA["project_description"]
                )
            ),
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + self.auth_token
            },
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.project_id=str(res["body"]["project"]["id"])

    def test_1_to_create_a_label(self):
        response = self.app.post(
            "/api/v1/label/create/"+self.project_id,
            data=json.dumps(
                dict(
                    label_name=LABEL_DATA["label_name"],
                    label_type=LABEL_DATA["label_type"]
                )
            ),
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + self.auth_token
            },
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res["msg"], "Your Label was created successfully.")
    
    def test_2_to_fetch_all_labels(self):
        response = self.app.get(
            "/api/v1/label/get/"+self.project_id,
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + self.auth_token
            },
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            res["msg"], "Label fetched successfully."
        )
        global label_id
        label_id=str(res["body"][0]["id"])

    def test_3_to_get_a_label(self):
        response = self.app.get(
            "/api/v1/label/label_info/"+label_id+"/"+self.project_id,
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + self.auth_token
            },
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["msg"], "Label found")

    def test_4_to_update_a_label(self):
        response = self.app.put(
            "/api/v1/label/label_info/"+label_id+"/"+self.project_id,
            data=json.dumps(
                dict(
                    label_name="new_name",
                    label_type="polygon"
                )
            ),
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + self.auth_token
            },
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res["msg"], "Label updated.")
    
    def test_5_to_delete_a_label(self):
        response = self.app.delete(
            "/api/v1/label/label_info/"+label_id+"/"+self.project_id,
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + self.auth_token
            },
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["msg"], "Label deleted.")

    @classmethod
    def tearDownClass(self):
        with FLASKR.app_context():
            db.drop_all()
        pass

if __name__ == "__main__":
    unittest.main()