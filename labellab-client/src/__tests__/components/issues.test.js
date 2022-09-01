import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { testStore, findByTestAttr } from '../../utils/TestUtils'
import ProjectIssues from '../../components/project/issue/issues'

Enzyme.configure({
    adapter: new Adapter(),
    disableLifecycleMethods: true
});

const setUp = (initialState = {}, props = {}) => {
    const store = testStore(initialState);
    const wrapper = shallow(<ProjectIssues store={store} {...props} />)
        .childAt(0)
        .dive();
    return wrapper;
};

describe('Issues Listing Component', () => {

    let wrapper
    const issues = {
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
        teams: [
            {
                "key": 1,
                "value": 1,
                "text": "admin"
            },
            {
                "key": 2,
                "value": 2,
                "text": "images"
            }
        ],
        members: [
            {
                "email": "john@gmail.com",
                "name": "John doe",
                "project_id": 1,
                "team_id": 2,
                "team_name": "images",
                "team_role": "images",
                "user_id": 1
            },
        ],
        users: [
            {
                "email": "john@gmail.com",
                "id": 1,
                "name": "John doe",
                "thumbnail": "https://react.semantic-ui.com/images/avatar/large/elliot.jpg",
                "username": "John Doe"
            }
        ],
        projectId: 1,
        issuesActions: {
            isFetching: false,
            isDeleting: false,
            isPosting: false,
            isUpdating: false,
            errors: ''
        }
    }
    beforeEach(() => {
        const initialState = {
            issues: issues
        }
        wrapper = setUp(initialState);
    });

    it('Should render without errors', () => {
        const component = findByTestAttr(wrapper, 'issues-grand-parent');
        expect(component.length).toBe(1);
    });

    it('Should have add issue button', () => {
        const component = findByTestAttr(wrapper, 'add-issue');
        expect(component.length).toBe(1);
    });

    it('should have category, team, entity type, entity id filters', () => {
        expect(findByTestAttr(wrapper, 'category-filter').length).toBe(1)
        expect(findByTestAttr(wrapper, 'team-filter').length).toBe(1)
        expect(findByTestAttr(wrapper, 'entity-type-filter').length).toBe(1)
        expect(findByTestAttr(wrapper, 'entity-id-filter').length).toBe(1)
    });

    it('Should have a table listing issues', () => {
        const component = findByTestAttr(wrapper, 'issues-list');
        expect(component.length).toBe(1);
        const issue = findByTestAttr(wrapper, 'issue-item');
        expect(issue.length).toBe(issues.issues.items.length);
    });

    it('Table should have cells containing title,category,priority,status and assignee', () => {
        const component = findByTestAttr(wrapper, 'issue-item');
        component.map((item, i) => {
            expect(findByTestAttr(item, 'issue-header').length).toBe(1)
            expect(findByTestAttr(item, 'issue-category').length).toBe(1)
            expect(findByTestAttr(item, 'issue-priority').length).toBe(1)
            expect(findByTestAttr(item, 'issue-status').length).toBe(1)
            expect(findByTestAttr(item, 'issue-assignee').length).toBe(1)
        })
    });

    it('should have actions to open update/delete modal and link to associated activity', () => {
        const component = findByTestAttr(wrapper, 'issue-item').first()
        const actions = findByTestAttr(component, 'issue-actions')
        expect(actions.length).toBe(1)
        expect(findByTestAttr(actions, 'issue-edit').length).toBe(1)
        expect(findByTestAttr(actions, 'issue-delete').length).toBe(1)
        expect(findByTestAttr(actions, 'issue-activity').length).toBe(1)
    });

    it('should have the delete issue modal buttons working', () => {
        const deleteButton = findByTestAttr(wrapper, 'issue-delete').first()
        expect(deleteButton.length).toBe(1)
        deleteButton.simulate('click')
        const modal = findByTestAttr(wrapper, 'delete-issue-modal')
        expect(modal.prop('open')).toBeTruthy()
        const yes = findByTestAttr(modal, 'delete-issue-yes')
        const no = findByTestAttr(modal, 'delete-issue-no')
        expect(yes.length).toBe(1)
        expect(no.length).toBe(1)
        no.simulate('click')
        expect(findByTestAttr(wrapper, 'delete-issue-modal').prop('open')).toBeFalsy()
    });

    it('should have pagination component', () => {
        const component = findByTestAttr(wrapper, 'pagination')
        expect(component.length).toBe(1)
        expect(component.prop('firstItem')).toBe(null)
        expect(component.prop('lastItem')).toBe(null)
        expect(component.prop('activePage')).toBe(1)
        expect(component.prop('totalPages')).toBe(1)
    });
})