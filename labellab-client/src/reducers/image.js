import {
  POST_IMAGE_FAILURE,
  POST_IMAGE_REQUEST,
  POST_IMAGE_SUCCESS,
  IMAGE_PREVIEW_REQUEST,
  IMAGE_PREVIEW_SUCCESS
} from "../constants/index";

const initialState = {
  imageActions: {
    isposting: false,
    error: "",
    isfetching: false,
    isloading: false,
    ispreview: false
  },
  images: {},
  imageDetails: {},
  imagePreview: {
    image_id: "",
    image_name: "",
    image_url: "",
    label: ""
  },
  currentImage: ""
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case POST_IMAGE_REQUEST:
      return {
        ...state,
        imageActions: {
          isposting: true
        }
      };
    case POST_IMAGE_FAILURE:
      return {
        ...state,
        imageActions: {
          isposting: false,
          error: "Something went wrong!"
        }
      };
    case POST_IMAGE_SUCCESS:
      return {
        ...state,
        imageActions: {
          isposting: false,
          error: "Successfully submitted"
        },
        currentImage: action.payload
      };
    case IMAGE_PREVIEW_REQUEST:
      return {
        ...state,
        imageActions: {
          isloading: true
        }
      };
    case IMAGE_PREVIEW_SUCCESS:
      return {
        ...state,
        imageActions: {
          isloading: false,
          ispreview: true
        },
        imagePreview: {
          image_id: action.payload._id,
          image_name: action.payload.image_name,
          image_url: action.payload.image_url,
          label: action.payload.label
        }
      };
    default:
      return state;
  }
};

export default user;
