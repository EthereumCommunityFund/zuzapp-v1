import React from 'react';
import { Menu, Item, Group } from '@radix-ui/react-menu';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    const handleItemClick = (page: number) => {
        onPageChange(page);
    };

    return (
        <Menu>
            <Group>
                {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                        <Item key={page} onSelect={() => handleItemClick(page)}>
                            {page}
                        </Item>
                    );
                })}
            </Group>
        </Menu>
    );
};

export default Pagination;
