import axios from "axios";

export const loginCall = async (userCredentials, dispatch) => {
	dispatch({ type: "LOGIN_REQUEST" });
	try {
		const response = await axios.post("/auth/login", userCredentials);
		// console.log(response);
		if (response.error) {
			dispatch({ type: "LOGIN_FAILURE", payload: response.error });
		}
		dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
	} catch (error) {
		dispatch({ type: "LOGIN_FAILURE", payload: error });
	}
};
