"use client";

import React, { useState, useEffect, useRef } from "react";
import { SnackbarProvider } from "notistack";
import * as d3 from "d3";
import {
	COLOR_ROOT,
	COLOR_LINE,
	COLOR_DIRECT,
	COLOR_INDIRECT,
} from "../../constants/theme";
import Searchbar from "../../components/Searchbar";
import NodeDialog from "../../components/NodeDialog";
import {
	NodeData,
	PolicyholderResponse,
	SelectedNodeState,
} from "../../type/nodeType";

export default function Home() {
	const svgRef = useRef(null);
	const [policyholderID, setPolicyholderID] = useState("");
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [selectedNode, setSelectedNode] = useState<SelectedNodeState>({
		node: {
			code: "",
			name: "",
			registration_date: 0,
			introducer_code: "",
		},
		parentNode: {
			code: "",
			name: "",
			registration_date: 0,
			introducer_code: "",
		},
	});
	const [policyholders, setPolicyholders] = useState(null);

	// 將節點分配到二元樹中，從最左邊的節點開始分配
	const distributeNodes = (
		root: PolicyholderResponse,
		nodes: PolicyholderResponse,
	) => {
		console.log(root, nodes);
		if (!root) return null;

		if (!Array.isArray(nodes) || nodes.length === 0) return root;

		// 使用隊列進行廣度優先遍歷
		const queue = [root];

		for (const node of nodes) {
			while (queue.length > 0) {
				const current = queue[0]; // 取出當前節點

				// 優先分配到左子節點
				if (!current.l) {
					current.l = { ...node, l: null, r: null };
					queue.push(current.l); // 將新節點加入隊列
					break;
				}
				// 再分配到右子節點
				else if (!current.r) {
					current.r = { ...node, l: null, r: null };
					queue.push(current.r); // 將新節點加入隊列
					break;
				}
				// 如果左右子節點都滿，從隊列中移除
				else {
					queue.shift();
				}
			}
		}

		return root;
	};

	// 主函數：將數據轉換為二元樹
	const convertToBinaryTree = (data) => {
		console.log(data);
		if (!data || typeof data !== "object") {
			return null;
		}

		const leftNodes = Array.isArray(data.l) ? data.l : [];
		const rightNodes = Array.isArray(data.r) ? data.r : [];

		// 初始化左樹
		const leftTree =
			leftNodes.length > 0
				? distributeNodes(
						{ ...leftNodes[0], l: null, r: null },
						leftNodes.slice(1),
					)
				: null;

		// 初始化右樹（當 data.r 存在且數據時生成）
		const rightTree =
			rightNodes.length > 0
				? distributeNodes(
						{ ...rightNodes[0], l: null, r: null },
						rightNodes.slice(1),
					)
				: null;

		return {
			...data,
			l: leftTree,
			r: rightTree,
		};
	};

	const handleNodeClick = (node: NodeData, parentNode: NodeData) => {
		setSelectedNode({
			...selectedNode,
			node: node,
			parentNode: parentNode,
		});
		setDialogOpen(true);
	};

	useEffect(() => {
		const width = 1500;
		const height = 600;
		const yOffset = 50; // 偏移量，確保樹的起始位置從 50px 開始
		const lineHeight = 10; // 行間距
		const rectHeight = 40; // 方形高度

		// 清空 SVG 畫布
		const svg = d3
			.select(svgRef.current)
			.html("")
			.attr("width", width)
			.attr("height", height);
		// 將數據轉換為二元樹
		const binaryTreeData = convertToBinaryTree(policyholders);

		// 將數據轉換為層次結構
		const root = d3.hierarchy(binaryTreeData, (d) => {
			// 僅當左右子樹存在時加入層次結構
			return [d?.l, d?.r].filter(Boolean);
		});

		// 設置樹形佈局
		const treeLayout = d3.tree().size([width + 30, height - 100]);
		treeLayout(root);

		// 繪製連線
		svg
			.selectAll("path")
			.data(root.links())
			.join("path")
			.attr("d", (d) => {
				// 起始點 (父節點中心)
				const sourceX = d.source?.x ?? 0;
				const sourceY = (d.source?.y ?? 0) + yOffset;

				const targetX = d.target?.x ?? 0;
				const targetY = (d.target?.y ?? 0) + yOffset;

				// 分叉點的 Y 座標（垂直向下延伸的距離）
				const midY = sourceY + (targetY - sourceY) / 2;

				// 路徑：垂直向下到 midY，然後水平分叉到子節點
				return `M ${sourceX},${sourceY} V ${midY} H ${targetX} V ${targetY}`;
			})
			.attr("fill", "none")
			.attr("stroke", COLOR_LINE)
			.attr("stroke-width", 1.5);

		// 繪製節點
		const nodes = svg
			.selectAll("g")
			.data(root.descendants())
			.join("g")
			.attr("transform", (d) => {
				if (d.x === undefined || d.y === undefined) {
					console.error("Node position is not defined", d);
					return "translate(0,0)"; // 默认回退到原点
				}
				return `translate(${d.x},${d.y + yOffset})`;
			})
			.on("click", (_, d) => {
				const currentNode = d.data;
				const parentNode = d.parent ? d.parent.data : null;

				handleNodeClick(currentNode, parentNode);
			});

		// 節點方形
		nodes
			.append("rect")
			.attr("cursor", "pointer")
			.attr("width", 70) // 方形寬度
			.attr("height", rectHeight) // 方形高度
			.attr("x", -35) // 中心對齊 (寬度的一半)
			.attr("y", -rectHeight / 2) // 中心對齊 (高度的一半)
			.attr("fill", (d) => {
				if (d.depth === 0) return COLOR_ROOT; // 根節點保持黃色
				const rootCode = root.data.code;

				// 判斷 introducer_code 是否匹配根節點的 code
				return d.data.introducer_code === rootCode
					? COLOR_DIRECT
					: COLOR_INDIRECT;
			});

		// 節點文字
		nodes
			.append("text")
			.attr("cursor", "pointer")
			.attr("text-anchor", "middle")
			.style("font-size", "12px")
			.style("fill", "black")
			.selectAll("tspan")
			.data((d) => [d.data.code, d.data.name]) // 分成多行
			.join("tspan")
			.text((line) => line) // 每行文字
			.attr("x", 0) // 水平居中
			.attr("dy", (_, i, nodes) => {
				const totalHeight = nodes.length * lineHeight; // 總文字高度
				return i === 0 ? -(totalHeight / 2) + lineHeight / 2 : lineHeight; // 第一行偏移到中心
			});
	}, [policyholders]);

	return (
		<SnackbarProvider
			maxSnack={3}
			anchorOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
		>
			<div className="flex flex-col items-center min-h-screen p-5 gap-16 w-full h-full">
				<Searchbar
					policyholderID={policyholderID}
					setPolicyholderID={setPolicyholderID}
					setPolicyholders={setPolicyholders}
				/>
				<main className="flex flex-col gap-8 items-center justify-center w-full">
					{policyholders ? <svg ref={svgRef}></svg> : ""}
				</main>
				<NodeDialog
					isDialogOpen={isDialogOpen}
					setDialogOpen={setDialogOpen}
					selectedNode={selectedNode}
					setPolicyholders={setPolicyholders}
				/>
			</div>
		</SnackbarProvider>
	);
}
