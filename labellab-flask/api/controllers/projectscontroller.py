import os
from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask.wrappers import Response
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    get_raw_jwt
)
from api.config import config
from api.models.Projects import Project
from api.models.Team import Team
from api.models.ProjectMembers import ProjectMember
from api.helpers.project import (
    find_by_project_id, 
    find_by_project_name, 
    save as save_project, 
    delete_by_id as delete_project,
    update_project
)
from api.helpers.user import (
    get_data, 
    find_by_email, 
    find_by_user_id, 
    to_json, 
    get_user_roles, 
    get_projectmembers,
    get_teams_of_user_in_project
)
from api.helpers.team import (
    save as save_team, 
    find_by_team_name, 
    delete_by_id as delete_team,
    find_all as find_all_teams_of_project,
    find_admin_team_of_project,
)
from api.helpers.projectmember import (
    save as save_project_member, 
    find_by_user_id_team_id, 
    delete_by_user_id_team_id, 
    count_users_in_team
)
from api.helpers.image import (
    find_all_by_project_id as find_images,
    get_path
)
from path_tracking.extract_exif import ImageMetaData
from api.middleware.logs_decorator import record_logs
from api.helpers.log import fetch_recent_project_logs
from api.middleware.project_member_access import project_member_only
from api.middleware.project_admin_access import admin_only
from api.middleware.project_owner_access import project_owner_only

allowed_teams = config[os.getenv("FLASK_CONFIG") or "development"].TEAMS_ALLOWED

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
            project_name = post_data["project_name"]
            project_description = post_data["project_description"]
            admin_id = current_user
        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        # Querying the database with requested project_name
        project = find_by_project_name(project_name)

        if project:
            # There is an existing project with the same name. We don't want to create two
            # projects with the same name.
            # Return a message to the user telling them that they have already created a project
            # with this name.
            response = {
                "success": False,
                "msg": "Project already exists. Please change the Project Name."}
            return make_response(jsonify(response)), 400
        
        # There is no project so we'll try to create a new one
        
        """Save the new Project."""
        try:
            project = Project(project_name=project_name, 
                        project_description=project_description, 
                        admin_id=admin_id)
            project_new = save_project(project)
            
            """Save the project admin."""
            team = Team(team_name="admin",
                        role="admin",
                        project_id=project_new['id'])
            team_new = save_team(team)

            project_member = ProjectMember(user_id=admin_id,
                                    team_id=team_new['id'])
            project_member_new = save_project_member(project_member)
            
            project_new['members'] = get_projectmembers(project_new['id'])

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
                    "msg": "Data not found"}
                return make_response(jsonify(response)), 404

            all_projects = data["all_projects"]

            if not all_projects:
                response = {
                    "success": False,
                    "msg": "No projects present"
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

            return make_response(jsonify(response)), 500


class ProjectInfo(MethodView):
    """
    This methods gets, deletes and updates the info of a particular project.
    Handle GET, DELETE, PUT request for this view. 
    Url --> /api/v1/project/project_info/<int:project_id>
    """
    @jwt_required
    @project_member_only
    def get(self, project_id):
        try:
            if not project_id:
                response = {
                    "success":False,
                    "msg": "Project id not provided"
                    }
                return make_response(jsonify(response)), 400
            
            project = find_by_project_id(project_id)
            project['members'] = get_projectmembers(project_id)
            project['logs'] = fetch_recent_project_logs(project_id)
            project['teams'] = find_all_teams_of_project(project_id)
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
    @project_owner_only
    @record_logs
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
    @admin_only
    @record_logs
    def put(self, project_id):
        """Handle PUT request for this view. Url --> /api/v1/project/update"""
        # getting JSON data from request
        post_data = request.get_json(silent=True,
                                     force=True)
        try:
            project_name = post_data["project_name"]
            project_description = post_data["project_description"]
            
        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        # Search the database for this project_name
        project = find_by_project_name(project_name)

        if project and project['id'] != project_id:
            # There already exists another project with the same name.
            # So we can't let this project use that name
            response = {
                "success": False,
                "msg": "Project name already taken."
            }
            return make_response(jsonify(response)), 400

        try:
            project = find_by_project_id(project_id)
            project['members'] = get_projectmembers(project_id)

            if not project:
                response = {
                    "success": False,
                    "msg": "Project not present."}
                return make_response(jsonify(response)), 404

            data = {
                "project_name": project_name,
                "project_description": project_description
            }

            project_new = update_project(project_id, data)

            response = {
                    "success": True,
                    "msg": "Project updated.",
                    "body": project_new
            }
            return make_response(jsonify(response)), 201

        except Exception as err:
            print("Error occurred: ", err)
            response = {
                "success": False,
                "msg": "Something went wrong"}
            return make_response(jsonify(response)), 500


class AddProjectMember(MethodView):
    """
    This method adds a member to the project.
    """
    @jwt_required
    @admin_only
    @record_logs
    def post(self, project_id):
        """
        Handle POST request for this view.
        Url --> /api/v1/project/add_project_member/<int:project_id>
        """
        # getting JSON data from request
        post_data = request.get_json(silent=True, force=True)

        try:
            user_email = post_data["member_email"]
            team_name = post_data["team_name"]
            role = post_data["role"]

        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        try:
            if role not in allowed_teams:
                response = {
                    "success": False,
                    "msg": "Team role is not allowed."
                }
                return make_response(jsonify(response)), 400

            user_obj = find_by_email(user_email)
            user = to_json(user_obj)
            if not user:
                response = {
                    "success": False,
                    "msg": "User not found."
                }
                return make_response(jsonify(response)), 404
            
            roles = get_user_roles(user['id'], project_id)
            if "admin" in roles:
                print("Error occured: user already admin")
                response = {
                        "success": False,
                        "msg": "User already admin."
                    }
                return make_response(jsonify(response)), 400

            team_exist = find_by_team_name(team_name)

            if team_exist:
                project_member_exist = find_by_user_id_team_id(user['id'], team_exist['id'])
            
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
                    team = Team(team_name=team_name,
                                project_id=project_id,
                                role=role)
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
                                    user_id=user['id'],
                                    team_id=team_exist['id']
                                )

                project_member_new = save_project_member(project_member)
                
                user_added = find_by_user_id(project_member_new['user_id'])
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
            return make_response(jsonify(response)), 500

        except Exception:
            response = {
                "success": False,
                "msg": "Something went wrong!!"
            }
            return make_response(jsonify(response)), 500

class RemoveProjectMember(MethodView):
    """
    This method removes a member to the project.
    """
    @jwt_required
    @admin_only
    @record_logs
    def post(self, project_id):
        """
        Handle POST request for this view.
        Url --> /api/v1/project/remove_project_member/<int:project_id>
        """
        # getting JSON data from request
        post_data = request.get_json(silent=True, force=True)

        try:
            user_email = post_data["member_email"]

        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        try:
            user_obj = find_by_email(user_email)
            user = to_json(user_obj)
            if not user:
                response = {
                    "success": False,
                    "msg": "User not found."
                }
                return make_response(jsonify(response)), 404
            try:
                team_ids = get_teams_of_user_in_project(user['id'], project_id)

                for id in team_ids:
                    delete_by_user_id_team_id(user['id'], id)
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
                return make_response(jsonify(response)), 500

        except Exception:
            response = {
                "success": False,
                "msg": "Something went wrong!!"}
            return make_response(jsonify(response)), 500

class GetCoordinates(MethodView):
    """
    This class-based view handles fetching of all the coordinates for polylines
    fillings.
    """
    @jwt_required
    @project_member_only
    def get(self, project_id):
        """Handle GET request for this view. Url ---> /api/v1/project/polylines/<int:project_id>"""
        
        try:
            images = find_images(project_id)

            if not images:
                response = {
                    "success": False,
                    "msg": "Images not found"}
                return make_response(jsonify(response)), 404

            # Getting the metadata of the image from ImageMetaData class.
            
            coordinates = []
            for image in images:
                image_path = get_path(image['image_url'], project_id)
                meta_data =  ImageMetaData(image_path)
                latlng = meta_data.get_lat_lng()
                if not all(latlng):
                    coordinates.append([])
                else:
                    latlng_list = list(latlng)
                    coordinates.append(latlng_list)

            response = {
                "success": True,
                "msg": "Coordinates fetched successfully.",
                "body": coordinates
            }

            return make_response(jsonify(response)), 200

        except Exception as err:
            print("Error occured: ", err)
            response = {
                "success": False,
                "msg": "Data could not be fetched"
            }

            return make_response(jsonify(response)), 500

class LeaveProject(MethodView):
    """
    This class-based view leaving a project
    """
    @jwt_required
    @project_member_only
    @record_logs
    def get(self, project_id):
        try:
            user_id = get_jwt_identity()
            user = find_by_user_id(user_id)

            project = find_by_project_id(project_id)
            if user_id == project['admin_id']:
                response = {
                    'success': False,
                    'msg': 'Cannot leave own project',
                }
                return make_response(jsonify(response)), 401

            team_ids = get_teams_of_user_in_project(user['id'], project_id)

            for id in team_ids:
                delete_by_user_id_team_id(user['id'], id)
                project_members = count_users_in_team(id)
                if project_members==0:
                    delete_team(id)

            response = {
                'success': True,
                'msg': 'Project left',
            }
            return make_response(jsonify(response)), 200
        except Exception as err:
            print(err)
            response = {
                'success': False,
                'msg': 'Something went wrong',
            }
            return make_response(jsonify(response)), 500

class MakeAdmin(MethodView):
    """
    This class-based view for making a user admin
    URL - api/v1/project/make_admin/<int:project_id>
    """
    @jwt_required
    @admin_only
    @record_logs
    def post(self, project_id):

        post_data = request.get_json(silent=True, force=True)

        try:
            user_email = post_data["member_email"]
        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        # Check if user exists
        user_obj = find_by_email(user_email)
        if not user_obj:
            response = {
                'success': False,
                'msg': 'User does not exist'
            }
            return make_response(jsonify(response)), 404

        user = to_json(user_obj)
        roles = get_user_roles(user['id'], project_id)

        # Check if user is already admin
        if 'admin' in roles:
            response = {
                'success': False,
                'msg': 'User is already admin'
            }
            return make_response(jsonify(response)), 400

        admin_team = find_admin_team_of_project(project_id)

        project_member = ProjectMember(user['id'], admin_team['id'])
        project_member = save_project_member(project_member)

        response = {
            'success': True,
            'msg': 'User made admin successfully',
        }
        return make_response(jsonify(response)), 200

class RemoveAdmin(MethodView):
    """
    This class-based view for making a user admin
    URL - api/v1/project/remove_admin/<int:project_id>
    """
    @jwt_required
    @project_owner_only
    @record_logs
    def post(self, project_id):
        post_data = request.get_json(silent=True, force=True)

        try:
            user_email = post_data["member_email"]
        except KeyError as err:
            response = {
                "success": False,
                "msg": f'{str(err)} key is not present'
            }
            return make_response(jsonify(response)), 400

        # Check if user exists
        user_obj = find_by_email(user_email)
        if not user_obj:
            response = {
                'success': False,
                'msg': 'User does not exist'
            }
            return make_response(jsonify(response)), 404
        
        user = to_json(user_obj)
        roles = get_user_roles(user['id'], project_id)

        # Check if user is already not admin
        if 'admin' not in roles:
            response = {
                'success': False,
                'msg': 'User is already not admin'
            }
            return make_response(jsonify(response)), 400

        admin_team = find_admin_team_of_project(project_id)
        delete_by_user_id_team_id(user['id'], admin_team['id'])

        response = {
            'success': True,
            'msg': 'User removed as admin',
        }
        return make_response(jsonify(response)), 200

class ProjectMemberRoles(MethodView):
    """
    This class-based view is for getting all roles of a project member
    URL - api/v1/project/member_roles/<int:project_id>
    """
    @jwt_required
    @project_member_only
    def get(self, project_id):
        user_id = get_jwt_identity()
        roles = get_user_roles(user_id, project_id)
        response = {
            'success': True,
            'body': roles,
        }
        return make_response(jsonify(response)), 200

projectController = {
    "create_project": CreateProject.as_view("create_project"),
    "get_all_projects": GetAllProjects.as_view("get_all_projects"),
    "project": ProjectInfo.as_view("project"),
    "add_project_member": AddProjectMember.as_view("add_project_member"),
    "remove_project_member": RemoveProjectMember.as_view("remove_project_member"),
    "get_coordinates": GetCoordinates.as_view("get_coordinates"),
    "leave_project": LeaveProject.as_view("leave_project"),
    "make_admin": MakeAdmin.as_view("make_admin"),
    "remove_admin": RemoveAdmin.as_view("remove_admin"),
    "member_roles": ProjectMemberRoles.as_view("member_roles"),
}