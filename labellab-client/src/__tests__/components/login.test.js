import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { testStore, findByTestAttr } from '../../utils/TestUtils'
import LoginIndex from '../../components/login/index'

Enzyme.configure({ 
    adapter: new Adapter(), 
    disableLifecycleMethods: true 
});

const setUp = (initialState={}, props={}) => {
    const store = testStore(initialState);
    const wrapper = shallow(<LoginIndex store={store} {...props}/>)
                    .childAt(0)
                    .dive();
    return wrapper;
};

describe('Login Component', () => {

    let wrapper;
    beforeEach(() => {
        const initialState = {
            auth: { 
                isAuthenticating:false,
                statusText: "ok",
                registerStatusText: "ok",
                authError: '' 
            },
        }
        wrapper = setUp(initialState);
    });

    it('Should render without errors', () => {
        const component = findByTestAttr(wrapper, 'login-grand-parent');
        expect(component.length).toBe(1);
    });
    it('Should have a login form', () => {
        const component = findByTestAttr(wrapper, 'login-form');
        expect(component.length).toBe(1);
    })
    it('Should have a email form', () => {
        const component = findByTestAttr(wrapper, 'email');
        expect(component.length).toBe(1);
    })
    it('Should have a email form', () => {
        const component = findByTestAttr(wrapper, 'password');
        expect(component.length).toBe(1);
    })
})