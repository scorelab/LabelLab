import checkPropTypes from "check-prop-types";
import { applyMiddleware, createStore } from "redux";
import { middleware } from "./store";
import rootReducers from "../reducers";

export const findByTestAttr = (component, attr) => {
  const wrapper = component.find(`[className='${attr}']`);
  return wrapper;
};

export const checkProps = (component, expectedProps) => {
  const propsErr = checkPropTypes(
    component.propTypes,
    expectedProps,
    "props",
    component.name
  );
  return propsErr;
};

export const testStore = initialState => {
  const createStoreWithMiddleware = applyMiddleware(...middleware)(
    createStore
  );
  return createStoreWithMiddleware(rootReducers, initialState);
};