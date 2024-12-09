import { useCallback } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

export const useRootData = () => {
	const { enqueueSnackbar } = useSnackbar();

	const getRootData = useCallback(async (code: string) => {
		try {
			const response = await axios.get(`/api/policyholders`, {
				params: { code },
				headers: { "Content-Type": "application/json" },
			});
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				enqueueSnackbar(error.response?.data?.error || error.message, {
					variant: "error",
				});
			} else {
				enqueueSnackbar(error, {
					variant: "error",
				});
			}
			return null;
		}
	}, []);

	return { getRootData };
};
