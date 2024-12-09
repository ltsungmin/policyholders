export interface NodeData {
	code: string;
	name: string;
	registration_date: number;
	introducer_code: string;
}

export interface PolicyholderResponse {
	code: string;
	name: string;
	registration_date: number;
	introducer_code: string;
	l: Array<NodeData>;
	r: Array<NodeData>;
}

export interface SelectedNodeState {
	node: NodeData | null;
	parentNode: NodeData | null;
}
