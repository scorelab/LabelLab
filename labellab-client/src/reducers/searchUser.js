import { SEARCH_USER, SEARCH_USER_FAILURE } from "../constants/index";
const searchUser = (state = [], action) => {
  switch (action.type) {
    case SEARCH_USER:
      return action.payload;
    case SEARCH_USER_FAILURE:
      return action.payload;
    default:
      return state;
  }
};
export default searchUser;
