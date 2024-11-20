import axios from "axios";

export const createUser = async (newID, setUName) => {
	try {
		const res = await axios.get(
			"https://cps714-backend.onrender.com/points/?offset=0&limit=100"
		);
		const totalres = await axios.get(
			"https://jsonplaceholder.typicode.com/users"
		);
		const users = res.data;
		const allUsers = totalres.data;

		const userExists = users.some(
			(user) => Number(user.user_id) === Number(newID)
		);
		const realUser = allUsers.some((user) => Number(user.id) === Number(newID));

		if (realUser) {
			setUName(allUsers.find((user) => Number(user.id) === Number(newID)).name);
		}

		if (!userExists && realUser) {
			await axios.post("https://cps714-backend.onrender.com/points/", {
				user_id: newID,
			});
			console.log(`User with ID ${newID} created successfully.`);
		} else {
			console.log(`User with ID ${newID} already exists.`);
		}
	} catch (error) {
		console.error("Error Creating User: ", error, newID);
	}
};

export const fetchUserPoints = async (uid, setPoints) => {
	try {
		const response = await axios.get(
			`https://cps714-backend.onrender.com/points/${uid}`
		);
		setPoints(response.data.points);
	} catch (error) {
		console.error("Error fetching user points:", error);
	}
};

export const earnPoints = async (uid, activityID, fetchUserPoints) => {
	try {
		await axios.post("https://cps714-backend.onrender.com/activities/", {
			user_id: uid,
			activity_id: activityID,
		});
		fetchUserPoints(uid);
	} catch (error) {
		console.error("Error earning points:", error);
	}
};

export const getRedeemed = async (uid, setRedeemEntries) => {
	try {
		const response = await axios.get(
			`https://cps714-backend.onrender.com/redeemed/user/${uid}`
		);
		const rewardIds = response.data.map((entry) => entry.id);
		setRedeemEntries(rewardIds);
	} catch (error) {
		console.error("Error fetching redeemed entries: ", error);
	}
};

export const deleteRedeemed = async (
	value,
	fetchUserPoints,
	getRedeemed,
	uid
) => {
	try {
		await axios.delete(`https://cps714-backend.onrender.com/redeemed/${value}`);
		fetchUserPoints(uid);
		getRedeemed(uid);
	} catch (error) {
		console.error("Error deleting: ", error);
	}
};

export const addRedeemed = async (value, uid, fetchUserPoints, getRedeemed) => {
	try {
		await axios.post(`https://cps714-backend.onrender.com/redeemed`, {
			id: value,
			reward_id: 1,
			user_id: uid,
		});
		fetchUserPoints(uid);
		getRedeemed(uid);
	} catch (error) {
		console.error("Error adding redeemed entry: ", error);
	}
};
