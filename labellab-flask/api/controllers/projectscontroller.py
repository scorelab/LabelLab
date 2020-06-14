from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    get_raw_jwt
)
from api.models.Projects import Project
from api.models.Team import Team
from api.models.ProjectMembers import ProjectMember
from api.helpers.project import (
    find_by_project_id, 
    find_by_projectname, 
    save as save_project, 
    delete_by_id as delete_project
)
from api.helpers.user import (
    get_data, 
    find_by_email, 
    find_by_user_id, 
    to_json, 
    get_user_roles, 
    get_teams_of_user_in_project
)
from api.helpers.team import (
    save as save_team, 
    find_by_teamname, 
    delete_by_id as delete_team
)
from api.helpers.projectmember import (
    save as save_projectmember, 
    find_by_user_id_team_id, 
    delete_by_user_id_team_id, 
    count_users_in_team
)


class CreateProject(MethodView):
    """This class creates a new project."""
    @jwt_required
    def post(self):
        """Handle POST request for this view. Url --> /api/v1/project/create"""
        # getting JSON data from request
        post_data = request.get_json(silent=True,
                                     force=True)
        current_user = get_jwt_identity()
        try:
            projectname = post_data["projectname"]
            projectdescription = post_data["projectdescription"]
            admin_id = current_user
        except Exception:
            response = {
                "success": False,
                "msg": "Please provide all the required fields."}
            return make_response(jsonify(response)), 400

        # Querying the database with requested projectname
        project = find_by_projectname(projectname)

        if project:
            # There is an existing project with the same name. We don't want to create two
            # projects with the same name.
            # Return a message to the user telling them that they have already created a project
            # with this name.
            response = {
                "success": False,
                "msg": "Project already exists. Please change the Project Name."}
            return make_response(jsonify(response)), 401
        
        # There is no project so we'll try to create a new one
        
        """Save the new Project."""
        try:
            project = Project(projectname=projectname, 
                        projectdescription=projectdescription, 
                        admin_id=admin_id)
            project_new = save_project(project)

            """Save the project admin."""
            team = Team(teamname="admin",
                        role="admin",
                        project_id=project_new.id)
            team_new = save_team(team)

            project_member = ProjectMember(user_id=admin_id,
                                    team_id=team_new.id)
            project_member_new = save_projectmember(project_member)
            
            res = {
                "project": project_new,
                "team": team_new,
                "project_member": project_member_new
            }
        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Something went wrong!!"}
            return make_response(jsonify(response)), 500

        response = {
                    "success": True,
                    "msg": "Your project was created successfully.",
                    "body": res
                    }
        # return a response notifying the user that they registered
        # successfully
        return make_response(jsonify(response)), 201


class GetAllProjects(MethodView):
    """This class-based view handles fetching of all projects in which the logged in user is an admin."""
    
    @jwt_required
    def get(self):
        """Handle GET request for this view. Url ---> /api/v1/project/get"""
        current_user = get_jwt_identity()
        
        try:
            data = get_data(current_user)

            if not data:
                response = {
                    "success": False,
                    "msg": "Data could not be fetched"}
                return make_response(jsonify(response)), 404

            all_projects = data["all_projects"]

            if not all_projects:
                response = {
                    "success": False,
                    "msg": "Data could not be fetched"
                    }
                return make_response(jsonify(response)), 404

            response = {
            "success": True,
            "msg": "Projects fetched successfully.",
            "body": all_projects
            }

            return make_response(jsonify(response)), 200

        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Data could not be fetched"
                }

            return make_response(jsonify(response)), 404


class ProjectInfo(MethodView):
    """
    This methods gets, deletes and updates the info of a particular project.
    Handle GET, DELETE, PUT request for this view. 
    Url --> /api/v1/project/project_info/<int:project_id>
    """
    @jwt_required
    def get(self, project_id):
        try:
            if not project_id:
                response = {
                    "success":False,
                    "msg": "Project id not provided"
                    }
                return make_response(jsonify(response)), 400
            
            project = find_by_project_id(project_id)
            response = {
                "success": True,
                "msg": "Project found",
                "body": project
            }
            return make_response(jsonify(response)), 200
        
        except Exception:
            response = {
                "success":False,
                "msg": "Something went wrong!"
                }
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500

    @jwt_required
    def delete(self, project_id):
        try:
            if not project_id:
                response = {
                    "success":False,
                    "msg": "Project id not provided"
                    }
                return make_response(jsonify(response)), 400
            
            delete_project(project_id)
            response = {
                "success": True,
                "msg": "Project deleted."
            }
            return make_response(jsonify(response)), 200
        
        except Exception:
            response = {
                "success":False,
                "msg": "Something went wrong!"
                }
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500

    @jwt_required
    def put(self, project_id):
        """Handle PUT request for this view. Url --> /api/v1/project/update"""
        # getting JSON data from request
        post_data = request.get_json(silent=True,
                                     force=True)
        try:
            projectname = post_data["projectname"]
            projectdescription = post_data["projectdescription"]
        except Exception:
            response = {
                "success": False,
                "msg": "Please provide all the required fields."}
            return make_response(jsonify(response)), 400

        try:
            project = find_by_project_id(project_id)

            if not project:
                response = {
                    "success": False,
                    "msg": "Project not present."}
                return make_response(jsonify(response)), 404
            
            project.projectname = projectname
            project.projectdescription = projectdescription

            project_new = save_project(project)

            response = {
                    "success": True,
                    "msg": "Project updated.",
                    "body": project_new}
            return make_response(jsonify(response)), 201

        except Exception as err:
            print("Error occurred: ", err)
            response = {
                "success": False,
                "msg": "Project not present."}
            return make_response(jsonify(response)), 404


class AddProjectMember(MethodView):
    """
    This method adds a member to the project.
    """
    @jwt_required
    def post(self, project_id):
        """
        Handle POST request for this view.
        Url --> /api/v1/project/add_project_member/<int:project_id>
        """
        # getting JSON data from request
        post_data = request.get_json(silent=True,
                                     force=True)
        current_user = get_jwt_identity
        roles = get_user_roles(current_user, project_id)

        if not roles.index("admin"):
            print("Error occured: user not admin")
            response = {
                    "success": False,
                    "msg": "User not admin."
                }
            return make_response(jsonify(response)), 400

        try:
            user_email = post_data["memberEmail"]
            team_name = post_data["teamName"]
            user_obj = find_by_email(user_email)
            user = to_json(user_obj)
            if not user:
                response = {
                    "success": False,
                    "msg": "User not found."
                }
                return make_response(jsonify(response)), 404
            
            team_exist = find_by_teamname(team_name)

            if team_exist:
                project_member_exist = find_by_user_id_team_id(user.id, team_exist.id)
            
            if team_exist and team_name=="admin":
                response = {
                            "success": False,
                            "msg": "Admin role already exists."
                            }
                return make_response(jsonify(response)), 400

            if team_exist and project_member_exist:
                response = {
                            "success": False,
                            "msg": "Projectmember already exists in this team."
                            }
                return make_response(jsonify(response)), 400

            if not team_exist:
                try:
                    team = Team(teamname=team_name,
                                project_id=project_id,
                                user_id=user.id)
                    team_exist = save_team(team)
                except Exception as err:
                    print("Error occured: ",err)
                    response = {
                        "success": False,
                        "msg": "Could not save a team."
                        }
                    return make_response(jsonify(response)), 400
            try:
                project_member = ProjectMember(
                                    user_id=user.id,
                                    team_id=team_exist.id
                                )

                project_member_new = save_projectmember(project_member)
                
                user_added = find_by_user_id(project_member_new.user_id)
                response = {
                        "success": True,
                        "msg": "ProjectMember added.",
                        "body": user_added
                        }
                return make_response(jsonify(response)), 201

            except Exception as err:
                print("Error occured: ",err)
                response = {
                    "success": False,
                    "msg": "Could not save the projectmember."
                    }
            return make_response(jsonify(response)), 400

        except Exception:
            response = {
                "success": False,
                "msg": "Please provide all the required fields."}
            return make_response(jsonify(response)), 500

class RemoveProjectMember(MethodView):
    """
    This method removes a member to the project.
    """
    @jwt_required
    def post(self, project_id):
        """
        Handle POST request for this view.
        Url --> /api/v1/project/remove_project_member/<int:project_id>
        """
        # getting JSON data from request
        post_data = request.get_json(silent=True,
                                     force=True)
        current_user = get_jwt_identity
        roles = get_user_roles(current_user, project_id)

        if not roles.index("admin"):
            print("Error occured: user not admin")
            response = {
                    "success": False,
                    "msg": "User not admin."
                }
            return make_response(jsonify(response)), 400

        try:
            user_email = post_data["memberEmail"]
            user_obj = find_by_email(user_email)
            user = to_json(user_obj)
            if not user:
                response = {
                    "success": False,
                    "msg": "User not found."
                }
                return make_response(jsonify(response)), 404
            try:
                team_ids = get_teams_of_user_in_project(user.id, project_id)

                for id in team_ids:
                    delete_by_user_id_team_id(user.id, id)
                    project_members = count_users_in_team(id)
                    if project_members==0:
                        delete_team(id)
                        
                response = {
                        "success": True,
                        "msg": "ProjectMember deleted."
                        }
                return make_response(jsonify(response)), 200

            except Exception:
                response = {
                    "success": False,
                    "msg": "Could not delete projectmember from all teams"}
                return make_response(jsonify(response)), 400

        except Exception:
            response = {
                "success": False,
                "msg": "Please provide all the required fields."}
            return make_response(jsonify(response)), 400


projectController = {
    "createproject": CreateProject.as_view("createproject"),
    "get_all_projects": GetAllProjects.as_view("get_all_projects"),
    "project": ProjectInfo.as_view("project"),
    "add_project_member": AddProjectMember.as_view("add_project_member"),
    "remove_project_member": RemoveProjectMember.as_view("remove_project_member"),
}