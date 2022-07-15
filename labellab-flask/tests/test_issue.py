from importlib.util import set_loader
import os
import unittest
import json
import sys
from dotenv import load_dotenv

sys.path.insert(0,os.path.dirname(os.getcwd()))

from api.main import create_app
from api.extensions import db

FLASKR = create_app("testing")

ISSUE_DATA = dict(
    title= "issue-title",
    description= "issue-description",
    category= "general",
    priority= "Critical",
    status= "In Progress",
    team_id= 1,
    due_date= "2022-06-07 15:06:45",
    entity_id="",
    entity_type= "label"
)
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
    password="test1credentials",
    password2="test1credentials"
)

issue_id=""
class Test_Project(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.app = FLASKR.test_client()
        db.init_app(FLASKR)
        with FLASKR.app_context():
            db.create_all()
        self.app.post(
            "/api/v1/auth/register",
            data=json.dumps( USER_DATA ),
            content_type="application/json",
            follow_redirects=True,
        )
        response = self.app.post(
            "/api/v1/auth/login",
            data=json.dumps(
                dict(email=USER_DATA["email"], password=USER_DATA["password"])
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.auth_token=res["access_token"]

        response = self.app.post(
            "/api/v1/project/create",
            data=json.dumps( PROJECT_DATA ),
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

        response = self.app.post(
            "/api/v1/label/create/"+self.project_id,
            data=json.dumps(
                dict( LABEL_DATA )
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
        ISSUE_DATA["entity_id"] = str(res["body"]["id"])

    def test_1_to_create_an_issue(self):
        response = self.app.post(
            "/api/v1/issue/create/"+self.project_id,
            data=json.dumps( ISSUE_DATA ),
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
        self.assertEqual(res["msg"], "New Issue was created successfully.")
    
    def test_2_to_fetch_all_issues(self):
        response = self.app.get(
            "/api/v1/issue/get/"+self.project_id,
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
            res["msg"], "Issues fetched successfully."
        )
        global issue_id
        issue_id=str(res["body"]["items"][0]["id"])

    def test_3_to_get_an_issue(self):
        response = self.app.get(
            "/api/v1/issue/issue_info/"+issue_id+"/"+self.project_id,
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
        self.assertEqual(res["msg"], "Issue found")

    def test_4_to_update_an_issue(self):
        response = self.app.put(
            "/api/v1/issue/issue_info/"+issue_id+"/"+self.project_id,
            data=json.dumps(
                dict(
                    title= "new-issue-title",
                    description= "new-issue-description",
                    category= "labels",
                    priority= "Low",
                    status= "Done",
                    team_id= 1,
                    due_date= "2022-06-07 15:06:45",
                    entity_id= ISSUE_DATA["entity_id"],
                    entity_type= ISSUE_DATA["entity_type"]
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
        self.assertEqual(res["msg"], "Issue updated.")

    def test_5_to_assign_an_issue(self):
        response = self.app.put(
            "/api/v1/issue/assign/"+self.project_id+"/"+issue_id,
            data=json.dumps(
                dict(
                    assignee_id= 1,
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
        self.assertEqual(res["msg"], "Issue assigned.")

    def test_6_to_delete_an_issue(self):
        response = self.app.delete(
            "/api/v1/issue/issue_info/"+issue_id+"/"+self.project_id,
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
        self.assertEqual(res["msg"], "Issue deleted.")

    @classmethod
    def tearDownClass(self):
        with FLASKR.app_context():
            db.drop_all()
        pass

if __name__ == "__main__":
    unittest.main()