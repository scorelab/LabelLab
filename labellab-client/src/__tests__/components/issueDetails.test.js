import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { testStore, findByTestAttr } from '../../utils/TestUtils'
import IssueDetails from '../../components/project/issue/issueDetails'
import {issues, logs, projects, user, labels} from '../../constants/test'

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