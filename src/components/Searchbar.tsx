"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRootData } from "../hooks/useRootData";

function Searchbar({
	policyholderID = "",
	setPolicyholderID,
	setPolicyholders,
}) {
	const { getRootData } = useRootData();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setPolicyholderID(value);
	};

	const handleSubmit = () => {
		getRootData(policyholderID).then((data) => setPolicyholders(data));
	};

	return (
		<div className="flex w-full max-w-sm items-center space-x-2">
			<Input
				type="text"
				placeholder="Please Enter Placeholder ID"
				onChange={handleChange}
				name="policyholderID"
				value={policyholderID}
			/>
			<Button
				type="submit"
				onClick={handleSubmit}
				disabled={policyholderID.length === 0}
			>
				Search
			</Button>
		</div>
	);
}

export default Searchbar;
