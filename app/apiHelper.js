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
		} else {
			alert("User not in DB");
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

export const getActivities = async (setActivities) => {
	try {
		const res = await axios.get(
			"https://cps714-backend.onrender.com/activities/?offset=0&limit=100"
		);
		console.log(res.data);
		setActivities(res.data);
	} catch (error) {
		console.error("error fetching activities: ", error);
	}
};

export const earnPoints = async (uid, activityID, fetchUserPoints) => {
	try {
		await axios.post("https://cps714-backend.onrender.com/activities/", {
			user_id: uid,
			activity_id: activityID,
		});
		console.log("user id: ", uid, "activity_id: ", activityID);
		fetchUserPoints(uid);
	} catch (error) {
		console.log("user id: ", uid, "activity_id: ", activityID);
		console.error("Error earning points:", error);
	}
};

export const getRewards = async (setRewards) => {
	try {
		const res = await axios.get(
			"https://cps714-backend.onrender.com/rewards/?offset=0&limit=100"
		);
		setRewards(res.data);
	} catch (error) {
		console.error("error getting rewards: ", error);
	}
};

export const getRedeemed = async (uid, rewards, setRedeemEntries) => {
	try {
		const rewardsArray = Array.isArray(rewards) ? rewards : [];
    console.log("rewards are: ", rewards)
		const response = await axios.get(
			`https://cps714-backend.onrender.com/redeemed/user/${uid}`
		);

		const redeemed = response.data; 

		const matchingNames = redeemed
			.map((entry) => {
				const reward = rewardsArray.find(
					(reward) => reward.id === entry.reward_id
				);
				return reward ? reward.name : null; 
			})
			.filter((name) => name !== null); 

		setRedeemEntries(matchingNames);
	} catch (error) {
		console.error("Error fetching redeemed entries:", error);
	}
};

export const deleteRedeemed = async (
	rewardsID,
	fetchUserPoints,
  uid,
  getRedeemed
) => {
	try {
		const redeemedResponse = await axios.get(
			`https://cps714-backend.onrender.com/redeemed/user/${uid}`
		);

		const redeemedItem = redeemedResponse.data.find(
			(entry) => Number(entry.reward_id) === Number(rewardsID)
		);
		console.log("data is ", redeemedItem);
		if (!redeemedItem) {
			console.error(`No redeemed item found for reward_id: ${rewardsID}`);
			return;
		}
		console.log("deleted redeem #", redeemedItem.id);
		await axios.delete(
			`https://cps714-backend.onrender.com/redeemed/${redeemedItem.id}`
		);
    console.log(`Deleted redeemed item with id: ${redeemedItem.id}`);
    fetchUserPoints(uid);
		getRedeemed(uid);
	} catch (error) {
		console.error("Error deleting: ", error);
	}
};

export const addRedeemed = async (
	uid,
	rewardid,
	fetchUserPoints,
	getRedeemed
) => {
	try {
		await axios.post(`https://cps714-backend.onrender.com/redeemed`, {
			reward_id: rewardid,
			user_id: uid,
		});
		fetchUserPoints(uid);
		getRedeemed(uid);
	} catch (error) {
		console.error("Error adding redeemed entry: ", error);
	}
};
