import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogFooter,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRootData } from "../hooks/useRootData";

function NodeDialog({
	isDialogOpen = false,
	setDialogOpen,
	selectedNode = {},
	setPolicyholders = null,
}: {
	isDialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
	selectedNode?: any;
	setPolicyholders: any;
}) {
	const { getRootData } = useRootData();
	const { node, parentNode } = selectedNode;
	const milliseconds = (node?.registration_date ?? 0) * 1000;

	const getTopNodeDate = (code: string) => {
		getTopNodeData(code).then((data) => setPolicyholders(data));
		setDialogOpen(false);
	};

	const getSelectedNodeTree = async (code: string) => {
		await getRootData(code).then((data) => setPolicyholders(data));
		setDialogOpen(false);
	};

	const getTopNodeData = async (code: string) => {
		try {
			const response = await axios.get(`/api/policyholders/${code}/top`);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error(error.response?.data?.error || error.message);
			} else {
				console.error("Unexpected Error:", error);
			}
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent aria-describedby="dialog-description">
				<VisuallyHidden>
					<DialogTitle>保戶資訊</DialogTitle>
				</VisuallyHidden>
				<DialogTitle>保戶資訊</DialogTitle>
				<div className="flex flex-col items-start space-y-4">
					{node ? (
						<div className="flex flex-col items-start space-y-4">
							<p>
								<strong>編號:</strong> {node.code}
							</p>
							<p>
								<strong>姓名:</strong> {node.name}
							</p>
							<p>
								<strong>註冊日期:</strong>{" "}
								{dayjs(milliseconds).format("YYYY-MM-DD")}
							</p>
							<p>
								<strong>邀請碼:</strong> {node.introducer_code}
							</p>
						</div>
					) : (
						<p>No node selected.</p>
					)}
				</div>
				<DialogFooter>
					<Button onClick={() => getTopNodeDate(parentNode?.code)}>
						顯示上一階
					</Button>
					<Button onClick={() => getSelectedNodeTree(node?.code)}>
						顯示關係圖
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default NodeDialog;
