import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { testStore, findByTestAttr } from '../../utils/TestUtils'
import Dashboard from '../../components/dashboard/index'

Enzyme.configure({ 
    adapter: new Adapter(), 
    disableLifecycleMethods: true 
});

const setUp = (initialState={}, props={}) => {
    const store = testStore(initialState);
    const wrapper = shallow(<Dashboard store={store} {...props}/>)
                    .childAt(0)
                    .dive()
    return wrapper;
};

describe('Dashboard Component', () => {

    let wrapper;
    beforeEach(() => {
        const initialState = {
            user: {
                userDetails: {
                    name: 'name',
                    username: 'username',
                    thumbnail: 'pic.png',
                    email: 'email@email.com',
                    profileImage: 'pic.png'
                  },
                userProfile: { totalLabels: 1, totalProjects: 1, totalImages: 1 },
                userActions: {
                    isuploading: false,
                    isfetching: false,
                    isinitializing: false,
                    errors: ''
                  },
            },
            projects: {
                projectActions: {
                    isinitializing: false
                }
            }
        }
        wrapper = setUp(initialState);
    });

    it('Should render without errors', () => {
        const component = findByTestAttr(wrapper, 'dashboard-parent');
        expect(component.length).toBe(1);
    });

    describe('Renders add project modal', () => {

        it('Should contain add project modal on state.open = true', () => {
            const component =  findByTestAttr(wrapper, 'create-project')
            component.simulate('click')
            expect(wrapper.state('open')).toBe(true);
        });

        it('Should contain add project modal on state.open = true', () => {
            wrapper.setState({ open: true })
            const component =  findByTestAttr(wrapper, 'modal-actions')
            expect(component.length).toBe(1);
        });
    })
})