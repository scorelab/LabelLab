const initialState = {
	userActions:{
		isuploading:false,
		isfetching:false,
		isinitializing:false,
		errors:""
	},
	userProjects:{

	},
	userDetails:{
		name:"",
		username:"",
		image:"",
		email:""
	},
	allProjects:{

	}
}

const user = (state=initialState,action)=>{
	switch(action.type){
	default:
		return state
	}
}

export default user