import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { testStore, findByTestAttr } from '../../utils/TestUtils'
import IssueDetails from '../../components/project/issue/issueDetails'

Enzyme.configure({
    adapter: new Adapter(),
    disableLifecycleMethods: true
});

const setUp = (initialState = {}, props = {}) => {
    const store = testStore(initialState);
    const wrapper = shallow(<IssueDetails store={store} {...props} />)
        .childAt(0)
        .dive();
    return wrapper;
};

describe('Issues Details Component', () => {

    let wrapper
    const issues = {
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
    }
    const logs = {
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
    }
    const projects = {
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
            ]
        }
    }
    const user = {
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
    }
    const labels = {
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
    beforeEach(() => {
        const initialState = {
            issues: issues,
            logs: logs,
            projects: projects,
            user: user,
            labels: labels
        }
        wrapper = setUp(initialState);
    });

    it('Should render without errors', () => {
        const component = findByTestAttr(wrapper, 'issue-details-grand-parent');
        expect(component.length).toBe(1);
    });

    it('should have clickable id,title,description,category,team,priority,status,assignee,created,updated,due date,entity', () => {
        expect(findByTestAttr(wrapper, 'issue-id').length).toBe(1)
        expect(findByTestAttr(wrapper, 'issue-created').length).toBe(1)
        expect(findByTestAttr(wrapper, 'issue-updated').length).toBe(1)
        expect(findByTestAttr(wrapper, 'issue-entity').length).toBe(1)

        const editable = ["title", "description", "category", "status", "priority", "team", "assignee"]
        editable.map(field => {
            const element = findByTestAttr(wrapper, `issue-${field}`)
            expect(element.length).toBe(1)
            expect(findByTestAttr(wrapper, `issue-${field}-edit`).length).toBe(0)
            element.simulate('click')
            expect(findByTestAttr(wrapper, `issue-${field}-edit`).length).toBe(1)
        })
    });

    it('Should have disabled assign, disabled update and active delete button', () => {
        const assignButton = findByTestAttr(wrapper, 'assign-button');
        const updateButton = findByTestAttr(wrapper, 'update-button');
        const deleteButton = findByTestAttr(wrapper, 'delete-button');
        expect(assignButton.length).toBe(1);
        expect(assignButton.prop('disabled')).toEqual(true);
        expect(updateButton.length).toBe(1);
        expect(updateButton.prop('disabled')).toEqual(true);
        expect(deleteButton.length).toBe(1);
        deleteButton.simulate('click')
        expect(
            findByTestAttr(wrapper, 'delete-confirmation').prop('open'),
        ).toBeTruthy();
    });

    it('Should have comment section, comment box, comments and send button', () => {
        expect(findByTestAttr(wrapper, 'comment-section').length).toBe(1)
        expect(findByTestAttr(wrapper, 'comments').length).toBe(issues.currentIssue.comments.length)
        expect(findByTestAttr(wrapper, 'comment-box').length).toBe(1)
        expect(findByTestAttr(wrapper, 'send-comment').length).toBe(1)
    });

    it('Should have activity section and activity logs', () => {
        expect(findByTestAttr(wrapper, 'activity-section').length).toBe(1)
        expect(findByTestAttr(wrapper, 'log').length).toBe(logs.logs.length)
        expect(findByTestAttr(wrapper, 'log-details').length).toBe(1)
    });
})