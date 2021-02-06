import os
import unittest
import json
import sys
from dotenv import load_dotenv

sys.path.insert(0,os.path.dirname(os.getcwd()))

from api.main import create_app
from api.extensions import db

FLASKR = create_app("testing")

TEAM_DATA = dict(
    team_name="teamname1",
    role="images"
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
    password2="test1credentials",
    name2="name2",
    email2="example2@gmail.com",
    username2="user2"
)

project_id=""
team_id=""
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
        self.app.post(
            "/api/v1/auth/register",
            data=json.dumps(
                dict(
                    name=USER_DATA["name2"],
                    email=USER_DATA["email2"],
                    username=USER_DATA["username2"],
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

    def test_1_create_a_project(self):
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
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res["msg"], "Your project was created successfully.")
        global project_id
        project_id=str(res["body"]["project"]["id"])

    def test_2_get_all_projects(self):
        response = self.app.get(
            "/api/v1/project/get",
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
        self.assertEqual(res["msg"], "Projects fetched successfully.")
        self.assertNotEqual(res["body"], {})
    
    def test_3_to_fetch_a_project(self):
        response = self.app.get(
            "/api/v1/project/project_info/"+project_id,
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
            res["msg"], "Project found"
        )

    def test_4_to_add_a_team_member(self):
        response = self.app.post(
            "/api/v1/project/add_project_member/"+project_id,
            data=json.dumps(
                dict(
                    team_name=TEAM_DATA["team_name"],
                    role=TEAM_DATA["role"],
                    member_email=USER_DATA["email2"]
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
        self.assertEqual(res["msg"], "ProjectMember added.")

    def test_5_to_get_all_teams_in_a_project(self):
        response = self.app.get(
            "/api/v1/team/get/"+project_id,
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
        self.assertEqual(res["msg"], "Teams fetched successfully.")
        global team_id
        team_id=str(res["body"][1]["id"])
    
    def test_6_to_get_a_team_in_a_project(self):
        response = self.app.get(
            "/api/v1/team/team_info/"+project_id+"/"+team_id,
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
        self.assertEqual(res["msg"], "Team found.")
    
    def test_7_to_remove_a_member_in_a_team_in_a_project(self):
        response = self.app.post(
            "/api/v1/team/remove_team_member/"+project_id+"/"+team_id,
            data=json.dumps(
                dict(
                    member_email=USER_DATA["email2"]
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
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["msg"], "Team member deleted.")

    def test_8_to_delete_a_project(self):
        response = self.app.delete(
            "/api/v1/project/project_info/"+project_id,
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
            res["msg"], "Project deleted."
        )

    @classmethod
    def tearDownClass(self):
        with FLASKR.app_context():
            db.drop_all()
        pass

if __name__ == "__main__":
    unittest.main()