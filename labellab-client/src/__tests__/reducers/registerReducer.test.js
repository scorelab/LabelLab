import { 
    REGISTER_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS
} from "../../constants/index";
import register  from "../../reducers/register";

const initState = {
    isRegistering: false,
    error: false,
    errField: '',
    statusText: ''
}

describe("Register Reducer", () => {
  it("Should return the default state", () => {
    const newState = register(undefined, {});
    expect(newState).toEqual(initState);
  });
  it("Should send a register request", () => {
    const newState = register(initState, {
      type: REGISTER_REQUEST
    });
    expect(newState).toEqual({
      ...initState,
      isRegistering: true,
      error: false
    });
  });
  it("Should register a user", () => {
    const mockPayload = { statusText: "OK" }
    const newState = register(initState, {
      type: REGISTER_SUCCESS,
      payload: mockPayload
    });
    expect(newState).toEqual({ 
        ...initState,
        isRegistering: false,
        statusText: mockPayload,
        error: false
    });
  });
});