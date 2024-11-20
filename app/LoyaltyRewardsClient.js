"use client";

import React, { useState, useEffect, useRef } from "react";
import {
	createUser,
	fetchUserPoints,
	earnPoints,
	getRedeemed,
	deleteRedeemed,
	addRedeemed,
} from "./apihelper";

const LoyaltyRewards = () => {
	const [uid, setUID] = useState(1);
	const [uname, setUName] = useState("");
	const [points, setPoints] = useState(0);
	const [redeemEntries, setRedeemEntries] = useState([]);
	const redeemVal = useRef(null);
	const redeemAddVal = useRef(null);
	const userid = useRef(1);
	useEffect(() => {
		const initializeData = async () => {
			try {
				// Ensure user creation is complete before fetching points and redeemed entries
				await createUser(userid.current.value, setUName);
				await fetchUserPoints(uid, setPoints);
				await getRedeemed(uid, setRedeemEntries);
			} catch (error) {
				console.error("Error initializing data:", error);
			}
		};

		initializeData();
	}, [uid]);

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

				<form onSubmit={deleteRedeemed} className="mb-4">
					<input
						type="text"
						ref={redeemVal}
						id="redeem"
						placeholder="Enter ID to delete"
						className="bg-gray-100 border border-gray-300 rounded-md py-2 px-3 w-full mb-2"
					/>
					<button
						type="submit"
						className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
					>
						Delete Redeem Entry
					</button>
				</form>

				<form onSubmit={addRedeemed}>
					<input
						type="text"
						ref={redeemAddVal}
						placeholder="Enter ID to add"
						className="bg-gray-100 border border-gray-300 rounded-md py-2 px-3 w-full mb-2"
					/>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
					>
						Add Redeem Entry
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoyaltyRewards;
