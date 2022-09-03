export const issues = {
    currentIssue: {
        "assigneeId": 1,
        "category": "general",
        "comments": [
            {
                "body": "hey",
                "id": 1,
                "issue_id": 1,
                "thumbnail": "https://react.semantic-ui.com/images/avatar/large/elliot.jpg",
                "timestamp": "2022-07-21 20:42:27",
                "user_id": 1,
                "username": "vaishnavi"
            }
        ],
        "createdAt": "2022-07-07 13:42:25",
        "createdBy": 1,
        "description": "Frontend Test",
        "dueDate": "2022-07-21 04:55:00",
        "entityId": 1,
        "entityType": "label",
        "id": 1,
        "priority": "Critical",
        "projectId": 1,
        "status": "Closed",
        "teamId": 1,
        "title": "Frontend Test",
        "updatedAt": "2022-08-11 18:53:51"
    },
    issues: {
        "items": [
            {
                "assignee_id": null,
                "category": "labels",
                "created_at": "2022-08-13 18:30:12",
                "created_by": 2,
                "description": "test issue 1",
                "due_date": null,
                "entity_id": null,
                "entity_type": null,
                "id": 1,
                "priority": "Low",
                "project_id": 1,
                "status": "Done",
                "team_id": null,
                "title": "test issue 1",
                "updated_at": "2022-08-13 18:30:12"
            },
            {
                "assignee_id": null,
                "category": "models",
                "created_at": "2022-08-13 18:29:37",
                "created_by": 2,
                "description": "test issue 2",
                "due_date": null,
                "entity_id": null,
                "entity_type": null,
                "id": 2,
                "priority": "Low",
                "project_id": 1,
                "status": "In Progress",
                "team_id": null,
                "title": "test issue 2",
                "updated_at": "2022-08-13 18:29:37"
            }
        ],
        "page": 1,
        "perPage": 6,
        "total": 2
    },
    issuesActions: {
        isFetching: false,
        isDeleting: false,
        isPosting: false,
        isUpdating: false,
        errors: ''
    },
    comments: [
        {
            "body": "hey",
            "id": 1,
            "issue_id": 1,
            "thumbnail": "https://react.semantic-ui.com/images/avatar/large/elliot.jpg",
            "timestamp": "2022-07-21 20:42:27",
            "user_id": 1,
            "username": "John Doe"
        }
    ]
},
    logs = {
        logs: [
            {
                "category": "general",
                "entity_id": 1,
                "entity_type": "issue",
                "id": 1,
                "message": "Issue Frontend Test has been created",
                "project_id": 1,
                "timestamp": "Thu, 11 Aug 2022 18:53:51 GMT",
                "user_id": 1,
                "username": "John Doe"
            }
        ],
        logsActions: {
            "isFetching": false
        }
    },
    projects = {
        currentProject: {
            projectId: 1,
            members: [
                {
                    "email": "john@gmail.com",
                    "name": "John doe",
                    "project_id": 1,
                    "team_id": 1,
                    "team_name": "admin",
                    "team_role": "admin",
                    "user_id": 1
                },
            ],
            roles: [
                "admin"
            ],
            teams: [
                {
                    "id": 1,
                    "project_id": 1,
                    "role": "admin",
                    "team_members": [
                        {
                            "team_id": 1,
                            "user_id": 2
                        },
                        {
                            "team_id": 1,
                            "user_id": 1
                        }
                    ],
                    "team_name": "admin"
                },
                {
                    "id": 2,
                    "project_id": 1,
                    "role": "images",
                    "team_members": [
                        {
                            "team_id": 1,
                            "user_id": 2
                        },
                        {
                            "team_id": 1,
                            "user_id": 1
                        }
                    ],
                    "team_name": "images"
                }
            ]
        }
    },
    user = {
        users: [
            {
                "email": "john@gmail.com",
                "id": 1,
                "name": "John doe",
                "thumbnail": "https://react.semantic-ui.com/images/avatar/large/elliot.jpg",
                "username": "John Doe"
            }
        ],
        userDetails: {
            "id": 1,
            "name": "John doe",
            "email": "john@gmail.com",
            "username": "John Doe",
            "thumbnail": "https://react.semantic-ui.com/images/avatar/large/elliot.jpg",
            "profileImage": "https://react.semantic-ui.com/images/avatar/large/elliot.jpg"
        }
    },
    labels = {
        labels: [
            {
                "count": 0,
                "created_at": "2022-07-08 14:41:15",
                "id": 1,
                "label_name": "Label 1",
                "label_type": "bbox",
                "labeldata": {},
                "project_id": 1
            }
        ]
    }