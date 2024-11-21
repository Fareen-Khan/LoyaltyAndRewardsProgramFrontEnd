"use client";

import React, { useState, useEffect, useRef } from "react";
import {
	createUser,
	fetchUserPoints,
	getActivities,
	earnPoints,
	getRewards,
	getRedeemed,
	deleteRedeemed,
	addRedeemed,
} from "./apiHelper";

const LoyaltyRewards = () => {
	const [uid, setUID] = useState(1);
	const [uname, setUName] = useState("");
	const [points, setPoints] = useState(0);
	const [redeemEntries, setRedeemEntries] = useState([]);
	const [activities, setActivities] = useState([]);
	const [rewards, setRewards] = useState([]);
	const redeemVal = useRef(null);
	const userid = useRef(null);
	useEffect(() => {
		const initializeData = async () => {
			try {
				await createUser(userid.current.value, setUName);
				await fetchUserPoints(uid, setPoints);
				await getActivities(setActivities);
				await getRewards(setRewards);
				await getRedeemed(uid, rewards, setRedeemEntries);
			} catch (error) {
				console.error("Error initializing data:", error);
			}
		};

		initializeData();
	}, [uid, rewards.length]);

	return (
		<div className="w-full mx-auto">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold mb-4">Loyalty and Rewards Program</h2>
				<h2 className="text-2xl font-bold mb-4">{uname}</h2>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						setUID(userid.current.value);
					}}
					className="mb-4 flex flex-col"
				>
					<input
						type="text"
						ref={userid}
						id="redeem"
						placeholder="Search for UserID"
						className="bg-gray-100 border border-gray-300 rounded-md py-2 px-3 w-1/4 mb-2"
					/>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-1/12"
					>
						Search
					</button>
				</form>

				<div className="mb-4">
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

				<div className="space-x-2 mb-4">
					{activities.map((activity) => (
						<button
							key={activity.id}
							onClick={() => {
								console.log(activity.id);
								earnPoints(uid, Number(activity.id), () =>
									fetchUserPoints(uid, setPoints)
								);
							}}
							className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
						>
              {activity.name} (+ {activity.points_reward} points)
						</button>
					))}
				</div>

				{/* Rewards Section */}
				<div className="space-x-2 mb-4">
					{rewards.map((reward) => (
						<button
							key={reward.id}
							onClick={() => {
								console.log(reward.id);
								addRedeemed(
									uid,
									reward.id,
									() => fetchUserPoints(uid, setPoints),
									() => getRedeemed(uid, rewards, setRedeemEntries)
								);
							}}
							className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md"
						>
              { reward.id }. {reward.name} (- {reward.points_cost})
						</button>
					))}
				</div>

				<div className="mb-4">
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

				<form
					onSubmit={(e) => {
						e.preventDefault();
						deleteRedeemed(
							redeemVal.current.value,
							() => fetchUserPoints(uid, setPoints),
							uid,
							() => getRedeemed(uid, rewards, setRedeemEntries)
            );
            redeemVal.current.value = ""; 
          }}
          
					className="mb-4"
				>
					<input
						type="text"
						ref={redeemVal}
            id="redeem"
						placeholder="Enter Reward ID to delete (1-6 as you see them listed)"
						className="bg-gray-100 border border-gray-300 rounded-md py-2 px-3 w-full mb-2"
					/>
					<button
						type="submit"
						className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
					>
						Delete Redeem Entry
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoyaltyRewards;
