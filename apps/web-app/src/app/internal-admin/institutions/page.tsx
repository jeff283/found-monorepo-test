"use client";

import { useState } from "react";
import Link from "next/link";
import { Pagination } from "@/components/shared/Pagination";
import { DashboardHeader } from "@/components/internal-admin/dashboard-header";
import { Filter, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddInstitutionPopover } from "@/components/internal-admin/institutions/AddInstitutionPopover";
import Image from "next/image";

const institutions = [
	{
		id: "1",
		name: "Lumière Grand Hotel",
		email: "contact@lumierehotel.com",
		location: "Nairobi, Kenya",
		avatarUrl: "/avatars/hotel.png",
		foundItems: 24,
		agents: 12,
		lastActivity: "1 Hour ago",
	},
];

function InstitutionCard({
	name,
	location,
	avatarUrl,
	foundItems,
	agents,
	lastActivity,
}: {
	name: string;
	location: string;
	avatarUrl: string;
	foundItems: number;
	agents: number;
	lastActivity: string;
}) {
	return (
		<div className="border border-border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition">
			<div className="flex items-start justify-between">
				{/* Left side: Avatar + Info */}
				<div className="flex items-center gap-3">
					<Image
						src={avatarUrl}
						alt={name}
						width={48}
						height={48}
						className="w-12 h-12 rounded-full object-cover"
						priority
					/>
					<div>
						<h3 className="font-semibold text-base">{name}</h3>
						<p className="text-sm text-muted-foreground">{location}</p>
					</div>
				</div>

				{/* Right side: 3 dots */}
				<button className="text-muted-foreground hover:text-foreground p-1 rounded">
					<MoreVertical size={18} />
				</button>
			</div>

			{/* Info Row */}
			<div className="grid grid-cols-3 mt-4">
				<div className="flex flex-col items-start">
					<p className="text-xs text-muted-foreground mb-1 opacity-60">
						Found Items
					</p>
					<p className="text-sm text-muted-foreground">{foundItems}</p>
				</div>
				<div className="flex flex-col items-start">
					<p className="text-xs text-muted-foreground mb-1 opacity-60">
						Agents
					</p>
					<p className="text-sm text-muted-foreground">{agents}</p>
				</div>
				<div className="flex flex-col items-start">
					<p className="text-xs text-muted-foreground mb-1 opacity-60">
						Last Activity
					</p>
					<p className="text-sm text-muted-foreground">{lastActivity}</p>
				</div>
			</div>
		</div>
	);
}

export default function InstitutionsPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(9);
	const [search, setSearch] = useState("");

	const allInstitutions = Array.from(
		{ length: 50 },
		(_, idx) => institutions[idx % institutions.length]
	);

	const filteredInstitutions = allInstitutions.filter((inst) =>
		inst.name.toLowerCase().includes(search.toLowerCase()) ||
		inst.location.toLowerCase().includes(search.toLowerCase()) ||
		inst.email.toLowerCase().includes(search.toLowerCase())
	);

	const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage);
	const paginatedInstitutions = filteredInstitutions.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<>
			<DashboardHeader
				user={{
					name: "John Snow",
					role: "Admin",
					avatar: "/avatars/avatar-1.webp",
				}}
			/>

			<div className="w-full flex justify-center bg-background min-h-screen px-2 sm:px-4">
				<div className="w-full max-w-[1295px] py-6 space-y-6">
					{/* Header */}
					<div className="flex justify-between items-center flex-wrap gap-4">
						<div className="flex items-center gap-2">
							<h2 className="font-semibold text-lg">Institutions</h2>
							<span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md">
								{filteredInstitutions.length}
							</span>
						</div>
						<div className="flex flex-wrap justify-end items-center gap-3 w-full sm:w-auto">
							<Input
								type="text"
								placeholder="Search institutions"
								value={search}
								onChange={(e) => {
									setCurrentPage(1);
									setSearch(e.target.value);
								}}
								className="px-4 py-2 border border-input rounded-lg text-sm w-full sm:w-[240px]"
							/>
							<button className="button-text-small px-4 py-2 border border-input rounded-lg text-muted-foreground flex items-center gap-2">
								<Filter size={16} /> Filter
							</button>
							<AddInstitutionPopover />
						</div>
					</div>

					{/* Institutions Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px]">
						{paginatedInstitutions.map((institution, idx) => (
							<Link
								key={institution.id + "-" + ((currentPage - 1) * itemsPerPage + idx)}
								href={`/internal-admin/institutions/${institution.id}`}
								className="block"
							>
								<InstitutionCard {...institution} />
							</Link>
						))}
					</div>

					{/* Pagination */}
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
						itemsPerPage={itemsPerPage}
						onItemsPerPageChange={(n) => {
							setItemsPerPage(n);
							setCurrentPage(1);
						}}
					/>
				</div>
			</div>
		</>
	);
}
