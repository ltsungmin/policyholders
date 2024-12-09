import { useCallback } from "react";
import axios from "axios";

export const useRootData = () => {
	const getRootData = useCallback(async (code: string) => {
		try {
			const response = await axios.get(`/api/policyholders`, {
				params: { code },
				headers: { "Content-Type": "application/json" },
			});
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(error.response?.data?.error || error.message);
			} else {
				console.error("Unexpected Error:", error);
			}
			return null;
		}
	}, []);

	return { getRootData };
};
