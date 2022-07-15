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

COMMENT_DATA = dict(
    body = "comment-body",
    issue_id = "",
    user_id = 1,
    username = "user1",
    thumbnail = "thumbnail"
)
ISSUE_DATA = dict(
    title= "issue-title",
    description= "issue-description",
    category= "general"
)
PROJECT_DATA = dict(
    project_name="name2",
    project_description="description"
)

USER_DATA = dict(
    name="name1",
    email="example1@gmail.com",
    username="user1",
    password="test1credentials",
    password2="test1credentials"
)

comment_id=""
class Test_Project(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.app = FLASKR.test_client()
        db.init_app(FLASKR)
        with FLASKR.app_context():
            db.create_all()
        response = self.app.post(
            "/api/v1/auth/register",
            data=json.dumps( USER_DATA ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
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
            "/api/v1/issue/create/"+self.project_id,
            data=json.dumps(
                dict( ISSUE_DATA )
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
        self.issue_id = str(res["body"]["id"])
        COMMENT_DATA["issue_id"] = self.issue_id

    def test_1_to_create_a_comment(self):
        response = self.app.post(
            "/api/v1/comment/create/"+self.issue_id,
            data=json.dumps( COMMENT_DATA ),
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
        self.assertEqual(res["msg"], "New Comment Added")
    
    def test_2_to_fetch_all_comments(self):
        response = self.app.get(
            "/api/v1/comment/get/"+self.issue_id,
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
            res["msg"], "Fetched all Comments"
        )
        global comment_id
        comment_id=str(res["body"][0]["id"])

    def test_3_to_get_a_comment(self):
        response = self.app.get(
            "/api/v1/comment/comment_info/"+self.issue_id+"/"+comment_id,
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
        self.assertEqual(res["msg"], "Comment found")

    def test_4_to_update_a_comment(self):
        response = self.app.put(
            "/api/v1/comment/comment_info/"+self.issue_id+"/"+comment_id,
            data=json.dumps(
                dict(
                    body = "new-comment-body",
                    user_id = COMMENT_DATA["user_id"],
                    username = COMMENT_DATA["username"],
                    thumbnail = COMMENT_DATA["thumbnail"],
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
        self.assertEqual(res["msg"], "Comment updated.")
    
    def test_5_to_delete_an_issue(self):
        response = self.app.delete(
            "/api/v1/comment/comment_info/"+self.issue_id+"/"+comment_id,
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
        self.assertEqual(res["msg"], "Comment deleted.")

    @classmethod
    def tearDownClass(self):
        with FLASKR.app_context():
            db.drop_all()
        pass

if __name__ == "__main__":
    unittest.main()