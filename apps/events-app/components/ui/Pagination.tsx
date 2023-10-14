// src/Pagination.tsx
import React from 'react';
import Button from './buttons/Button';
import { ArrowLeft, ArrowRight } from './icons';

interface PaginationProps {
	currentPage: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	// Ensure at least 3 page numbers are displayed for UX design
	const minPagesToShow = 3;
	const startPage = Math.max(1, Math.min(currentPage - Math.floor(minPagesToShow / 2), totalPages - minPagesToShow + 1));
	const endPage = Math.min(startPage + minPagesToShow - 1, totalPages);

	const renderPageNumbers = () => {
		const pages = [];
		for (let i = startPage; i <= endPage; i++) {
			pages.push(
				<Button
					key={i}
					className={`p-0 cursor-pointer ${currentPage === i ? 'bg-gray-700' : 'bg-gray-600'} w-11 h-11 inline-block text-center leading-11 border border-borderPrimary`}
					onClick={() => onPageChange(i)}
				>
					{i}
				</Button>
			);
		}
		return pages;
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px', backgroundColor: '' }}>
			<Button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1 || totalItems < 3 * itemsPerPage}
				style={{
					borderTopLeftRadius: '6px',  // Set border-radius for top left corner
					borderBottomLeftRadius: '6px',
					width: '45px',
					height: '44px',
				}}
				leftIcon={ArrowLeft}
			/>
			{renderPageNumbers()}
			<Button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages || totalItems < 3 * itemsPerPage}
				style={{
					borderTopRightRadius: '6px',  // Set border-radius for top left corner
					borderBottomRightRadius: '6px',
					width: '45px',
					height: '44px',
				}}
				leftIcon={ArrowRight}
			/>
		</div>
	);
};

export default Pagination;
