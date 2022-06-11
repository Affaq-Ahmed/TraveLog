const AuthReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN_START":
			return {
				isFetching: true,
				error: false,
				user: null,
			};
		case "LOGIN_SUCCESS":
			return {
				isFetching: false,
				user: action.payload,
				error: false,
			};
		case "LOGIN_FAILURE":
			return {
				user: null,
				isFetching: false,
				error: action.payload,
			};
		case "LOGOUT":
			return {
				user: null,
				error: false,
				isFetching: false,
			};
		case "FOLLOW":
			return {
				...state,
				user: {
					...state.user,
					following: [...state.user.following, action.payload],
				},
				error: false,
				isFetching: false,
			};
		case "UNFOLLOW":
			return {
				...state,
				user: {
					...state.user,
					following: state.user.following.filter((id) => id !== action.payload),
				},
				error: false,
				isFetching: false,
			};
		default:
			return state;
	}
};

export default AuthReducer;
