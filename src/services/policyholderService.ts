import { NodeData } from "../type/nodeType";

export const buildTreeService = (data: any, rootCode: string) => {
	const root = data.find((item: NodeData) => item.code === rootCode);
	if (!root) return null;

	const directChildren = data.filter(
		(item: NodeData) =>
			item.introducer_code === rootCode && item.code !== rootCode,
	);
	const indirectChildren: NodeData[] = [];

	directChildren.forEach((child: NodeData) => {
		const indirect = data.filter(
			(item: NodeData) =>
				item.introducer_code === child.code && item.code !== rootCode,
		);
		indirectChildren.push(...indirect);
	});

	const combinedChildren = [...directChildren, ...indirectChildren];
	const left: NodeData[] = [];
	const right: NodeData[] = [];

	combinedChildren.forEach((child, index) => {
		const childData: NodeData = {
			code: child.code,
			name: child.name,
			registration_date: child.registration_date,
			introducer_code: child.introducer_code,
		};
		const targetArray = index % 2 === 0 ? left : right;

		if (targetArray.length < 15) {
			targetArray.push(childData);
		}
	});

	return {
		code: root.code,
		name: root.name,
		registration_date: root.registration_date,
		introducer_code: root.introducer_code,
		l: left,
		r: right,
	};
};
