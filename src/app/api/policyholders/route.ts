import { NextResponse, NextRequest } from "next/server";
import { policyholdersData } from "../../../models/Policyholder";
import { buildTreeService } from "../../../services/policyholderService";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const code = searchParams.get("code");

		if (!code) {
			return NextResponse.json(
				{ error: "Missing required query parameter: code" },
				{ status: 400 },
			);
		}

		if (typeof code !== "string" || code.trim() === "") {
			return NextResponse.json(
				{ error: "Invalid parameter: code must be a non-empty string" },
				{ status: 400 },
			);
		}

		const response = buildTreeService(policyholdersData, code);

		if (response?.code !== code) {
			return NextResponse.json(
				{ error: `Policyholder with code ${code} not found` },
				{ status: 404 },
			);
		}

		return NextResponse.json(response);
	} catch (error) {
		console.error("Server Error:", error.message);

		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
