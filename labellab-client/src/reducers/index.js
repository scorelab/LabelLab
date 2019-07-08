import { combineReducers } from "redux";
import auth from "./auth";
import register from "./register";
import user from "./user";
import project from "./project";
import image from "./image";
import label from "./label";
import searchProjects from "./search";

const rootReducers = combineReducers({
  auth: auth,
  register: register,
  user: user,
  projects: project,
  images: image,
  labels: label,
  searchProjects: searchProjects
});

export default rootReducers;
