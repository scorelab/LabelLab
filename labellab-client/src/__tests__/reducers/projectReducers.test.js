import { 
    INITIALIZE_PROJECT_FAILURE,
    INITIALIZE_PROJECT_REQUEST,
    INITIALIZE_PROJECT_SUCCESS,
    FETCH_PROJECT_FAILURE,
    FETCH_PROJECT_REQUEST,
    FETCH_PROJECT_SUCCESS,
    FETCH_PROJECT_ALL_FAILURE,
    FETCH_PROJECT_ALL_REQUEST,
    FETCH_PROJECT_ALL_SUCCESS,
    ADD_MEMBER_FAILURE,
    ADD_MEMBER_REQUEST,
    ADD_MEMBER_SUCCESS,
    DELETE_MEMBER_FAILURE,
    DELETE_MEMBER_REQUEST,
    DELETE_MEMBER_SUCCESS,
    DELETE_PROJECT_FAILURE,
    DELETE_PROJECT_REQUEST,
    DELETE_PROJECT_SUCCESS
} from "../../constants/index";
import project  from "../../reducers/project";

const initState = {
    projectActions: {
        isuploading: false,
        isfetching: false,
        isinitializing: false,
        isadding: false,
        isdeleting: false,
        isdeletingproject: false,
        errors: '',
        msg: ''
      },
    currentProject: {},
    allProjects: []
}

describe("Project Reducer", () => {

  it("Should return the default state", () => {
    const newState = project(undefined, {});
    expect(newState).toEqual(initState);
  });

  it("Should send a project init request", () => {
    const newState = project(initState, {
      type: INITIALIZE_PROJECT_REQUEST
    });
    expect(newState).toEqual({
      ...initState,
      projectActions: {
        isinitializing: true
      }
    });
  });

  it("Should initialize a project", () => {
    const mockPayload = { project_name: "project1", 
                          images: { image_name: "image1", image_url: "image/url.png", image: "some_base64_image"}
                        }
    const newState = project(initState, {
      type: INITIALIZE_PROJECT_SUCCESS,
      payload: mockPayload
    });
    expect(newState).toEqual({ 
        ...initState,
        projectActions: {
            isinitializing: false
          },
        currentProject: {
        projectName: mockPayload.project_name,
        images: mockPayload.images
        }
    });
  });

  it("Should make a fetch a project request", () => {
    const newState = project(initState, {
      type: FETCH_PROJECT_REQUEST
    });
    expect(newState).toEqual({ 
        ...initState,
        projectActions: {
            isfetching: true
        }
    });
  });

  it("Should fetch a project", () => {
    const mockPayload = { id: 1,
                          project_name: "project1", 
                          project_description: "desc",
                          images: { image_name: "image1", image_url: "image/url.png", image: "some_base64_image"},
                          members: [{ member: 1, projectId: 1, role: "member"}, { member: 2, projectId: 1, role: "admin"}]
                        }
    const newState = project(initState, {
      type: FETCH_PROJECT_SUCCESS,
      payload: mockPayload
    });
    expect(newState).toEqual({ 
        ...initState,
        projectActions: {
            isfetching: false
          },
        currentProject: {
          projectId: mockPayload.id,
          projectName: mockPayload.project_name,
          projectDescription: mockPayload.project_description,
          images: mockPayload.images,
          // members: mockPayload.members
        }
    });
  });

  it("Should make a fetch all projects request", () => {
    const newState = project(initState, {
      type: FETCH_PROJECT_ALL_REQUEST
    });
    expect(newState).toEqual({ 
        ...initState,
        projectActions: {
            isfetching: true
        }
    });
  });

  it("Should fetch all projects", () => {
    const mockPayload = [
                        { 
                            projectId: 1,
                            projectName: "project1", 
                            projectDescription: "desc",
                            image: { imageName: "image1", imageUrl: "image/url.png", image: "some_base64_image"},
                            members: [{ member: 1, projectId: 1, role: "member"}, { member: 2, projectId: 1, role: "admin"}]
                        },
                        { 
                            projectId: 2,
                            projectName: "project2", 
                            projectDescription: "desc",
                            image: { imageName: "image2", imageUrl: "image2/url.png", image: "some_base64_image_2"},
                            members: [{ member: 1, projectId: 1, role: "member"}, { member: 2, projectId: 1, role: "admin"}]
                        },
                        { 
                            projectId: 3,
                            projectName: "project3", 
                            projectDescription: "desc",
                            image: { imageName: "image3", imageUrl: "image3/url.png", image: "some_base64_image_3"},
                            members: [{ member: 1, projectId: 1, role: "member"}, { member: 2, projectId: 1, role: "admin"}]
                        }
                        ]
    const newState = project(initState, {
      type: FETCH_PROJECT_ALL_SUCCESS,
      payload: mockPayload
    })
    expect(newState).toEqual({ 
        ...initState,
        projectActions: {
            isfetching: false
        },
        allProjects: mockPayload
    });
  });  
  
  it("Should make a delete project request", () => {
    const newState = project(initState, {
      type: DELETE_PROJECT_REQUEST
    });
    expect(newState).toEqual({ 
        ...initState,
        projectActions: {
            isdeletingproject: true
        }
    });
  });

  it("Should delete project", () => {
    const newState = project(initState, {
      type: DELETE_PROJECT_SUCCESS
    });
    expect(newState).toEqual({ 
        ...initState,
        projectActions: {
            isdeletingproject: false,
            msg: 'Project removed successfully'
        }
    });
  });
});