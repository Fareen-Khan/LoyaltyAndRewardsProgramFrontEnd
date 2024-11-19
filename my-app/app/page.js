"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const LoyaltyRewards = () => {
	const [points, setPoints] = useState(0);
	const [redeemEntries, setRedeemEntries] = useState([]);
	const redeemVal = useRef(null);
	const redeemAddVal = useRef(null);

	useEffect(() => {
		fetchUserPoints();
		getRedeemed();
	}, []);

	const fetchUserPoints = async () => {
		try {
			const response = await axios.get(
				"https://cps714-backend.onrender.com/points/1"
      );
      console.log(response.data.points);
			setPoints(response.data.points);
		} catch (error) {
			console.error("Error fetching user points:", error);
		}
	};

	const earnPoints = async (activityID) => {
		try {
			await axios.post("https://cps714-backend.onrender.com/activities/", {
				user_id: 1,
				activity_id: activityID,
			});
			fetchUserPoints();
		} catch (error) {
			console.error("Error earning points:", error);
		}
	};

	const getRedeemed = async () => {
		try {
			const response = await axios.get(
				"https://cps714-backend.onrender.com/redeemed/user/1"
			);
			const rewardIds = response.data.map((entry) => entry.id);
			setRedeemEntries(rewardIds);
		} catch (error) {
			console.error("Error fetching redeemed entries: ", error);
		}
	};

	const deleteRedeemed = async (e) => {
		e.preventDefault();
		const value = redeemVal.current.value;
		try {
			await axios.delete(
				`https://cps714-backend.onrender.com/redeemed/${value}`
			);
			fetchUserPoints();
			getRedeemed();
			redeemVal.current.value = "";
			console.log("Deleted successfully");
		} catch (error) {
			console.error("Error deleting: ", error);
		}
	};

	const addRedeemed = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`https://cps714-backend.onrender.com/redeemed`, {
				id: redeemAddVal.current.value,
				reward_id: 1,
				user_id: 1,
			});
			fetchUserPoints();
			getRedeemed();
			redeemAddVal.current.value = "";
		} catch (error) {
			console.error("Error adding ", error);
		}
	};

	return (
		<div className="w-full mx-auto">
			<div className="bg-white rounded-lg  p-6">
				<h2 className="text-2xl font-bold mb-4">Loyalty and Rewards Program</h2>
				<div className="flex justify-between items-center mb-4">
					<div>
						<label
							htmlFor="points"
							className="block text-gray-700 font-medium mb-1"
						>
							Total Points
						</label>
						<input
							id="points"
							type="number"
							value={points}
							readOnly
							className="bg-gray-100 border border-gray-300 rounded-md py-2 px-3 w-full"
						/>
					</div>
				</div>

				<div className="flex justify-between items-center">
					<div className="space-x-2">
						<button
							onClick={() => earnPoints(1)}
							className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
						>
							Sign Up (10 Points)
						</button>
						<button
							onClick={() => earnPoints(2)}
							className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
						>
							Purchase (20 Points)
						</button>
						<button
							onClick={() => earnPoints(3)}
							className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
						>
							Referral (30 Points)
						</button>
					</div>
				</div>
				<br />
				<div className="flex flex-col justify-between items-start space-y-2">
					<div>
						<label
							htmlFor="redeemed"
							className="block text-gray-700 font-medium mb-1"
						>
							Redeemed Entries
						</label>
						<input
							id="redeemed"
							type="text"
							value={redeemEntries.join(", ")}
							readOnly
							className="bg-gray-100 border border-gray-300 rounded-md py-2 px-3 w-full"
						/>
					</div>
					<div>
						<form onSubmit={deleteRedeemed} className="space-y-2">
							<input
								type="text"
								name="Which item to redeem"
								id="redeem"
								ref={redeemVal}
								className="bg-gray-100 border border-gray-300 rounded-md py-2 px-3 w-full"
							/>

							<input
								className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
								type="submit"
								value="Redeem"
							/>
						</form>
					</div>
				</div>

				<br />
				<div className="flex flex-col justify-between items-start space-y-2">
					<div>
						<label
							htmlFor="redeemed"
							className="block text-gray-700 font-medium mb-1"
						>
							Add Redeem Entries
						</label>
						<form onSubmit={addRedeemed} className="space-y-2">
							<input
								type="text"
								name="Which item to add to redeem list"
								id="redeemAdd"
								ref={redeemAddVal}
								className="bg-gray-100 border border-gray-300 rounded-md py-2 px-3 w-full"
							/>

							<input
								className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
								type="submit"
								value="Add"
							/>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoyaltyRewards;
