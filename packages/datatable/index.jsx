import React from "react";
import classNames from "classnames";
import {ChevronLeftIcon, ChevronRightIcon} from "@josemi-icons/react";

// Generate an array range 
const range = (start, length) => {
    return Array(length).fill().map((_, index) => start + index);
};

// Calculate the number of pages
const calculatePages = (rowsTotal, rowsPage) => {
    const pages = rowsTotal / rowsPage;
    // console.log("Calculated pages: ", pages);
    return (Math.floor(pages) === pages) ? pages : Math.floor(pages) + 1;
};

// Tiny utility to generate sorted columns list
const getSortedColumns = (columns, columnIndex, shiftKey = false) => {
    let sortedColumns = (columns || []).slice(0);
    const index = sortedColumns.findIndex(c => c.index === columnIndex);
    if (index !== -1 && (shiftKey === true || sortedColumns.length === 1)) {
        if (sortedColumns[index].order === "asc") {
            sortedColumns[index].order = "desc";
        }
        else {
            sortedColumns.splice(index, 1);
        }
    }
    // Check if the column is not found but the shift is presset
    else if (index === -1 && shiftKey === true) {
        sortedColumns.push({
            index: columnIndex,
            order: "asc"
        });
    }
    else {
        sortedColumns = [];
        sortedColumns.push({
            index: columnIndex,
            order: "asc"
        });
    }
    // Return updated sorted columns
    return sortedColumns;
};

// Tiny utility to generate table sorted rows
const getSortedRows = (data, rows, columns, sortedColumns) => {
    return rows.slice(0).sort((a, b) => {
        for (let i = 0; i < sortedColumns.length; i++) {
            // Get the column index and order
            const index  = sortedColumns[i].index;
            const order = (sortedColumns[i].order === "asc") ? 1 : -1;
            // Check for custom sort method
            if (typeof columns[index].sort === "function") {
                const result = columns[index].sort(data[a], data[b]);
                if (result !== 0) { 
                    return result * order; 
                }
            }
            // Default sorting
            else {
                const key = columns[index].field;
                const numeric = !isNaN(+data[a][key] - +data[b][key]);
                const value1 = (numeric === true) ? +data[a][key] : data[a][key].toLowerCase();
                const value2 = (numeric === true) ? +data[b][key] : data[b][key].toLowerCase();
                // Check for not the same value
                if (value1 !== value2) { 
                    return ((value1 < value2) ? -1 : 1) * order;
                }
            }
        }
        // Equivalent values
        return 0;
    });
};

// Get cell content
const getCellContent = (row, rowIndex, column, columnIndex) => {
    // Check for custom cell content
    if (typeof column.render === "function") {
        return column.render(row, rowIndex, column, columnIndex);
    }
    // No custom content, find the content in the row data
    if (column.field && typeof row[column.field] !== "undefined") {
        return row[column.field];
    }
    // Default: return default value in column config
    return column.defaultValue || "";
};

export const DataTablePagination = props => {
    const pageSize = props.pageSize;
    const handlePageChange = page => {
        const newPage = Math.max(0, Math.min(page, props.pages - 1));
        if (props.page !== newPage && typeof props.onPageChange === "function") {
            props.onPageChange(newPage);
        }
    };
    const nextPage = () => handlePageChange(props.page + 1);
    const prevPage = () => handlePageChange(props.page - 1);
    const handlePageSizeChange = event => {
        const entries = parseInt(event.target.value);
        if (!isNaN(entries) && props.pageSize !== entries) { 
            //console.log("New page size: " + entries);
            return props.onPageSizeChange(entries);
        }
    };
    return (
        <div className="flex items-center justify-between mt-2" data-testid="dt-pagination">
            {/* Left side content */}
            <div className="text-gray-600 text-sm">
                Showing <b>{props.rowStart + 1}</b> to <b>{props.rowEnd}</b> of <b>{props.rowSize}</b> rows.
            </div>
            {/* Right side content */}
            <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                    <div className="text-gray-600 text-sm">
                        <span>Rows per page:</span>
                    </div>
                    <select className="py-1 pl-1 pr-8 text-sm bg-white" defaultValue={pageSize} onChange={handlePageSizeChange}>
                        {props.pageSizeOptions.map((value, index) => (
                            <option key={index} value={value}>{value.toString()}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-2 text-sm flex items-center" onClick={prevPage}>
                        <ChevronLeftIcon />
                        <strong>Prev</strong>
                    </div>
                    <div className="text-gray-600">
                        Page <b>{props.page + 1}</b> of <b>{props.pages}</b>
                    </div>
                    <div className="p-2 text-sm flex items-center" onClick={nextPage}>
                        <strong>Next</strong>
                        <ChevronRightIcon />
                    </div>
                </div>

            </div>
        </div>
    );
};

// Pagination default props
DataTablePagination.defaultProps = { 
    page: 0, 
    pages: 0, 
    pageSize: 0,
    pageSizeOptions: [],
    rowStart: 0,
    rowEnd: 0,
    rowSize: 0,
    onPageChange: null, 
    onPageSizeChange: null, 
};

// Export datatable render component
export const DataTableRender = props => {
    const tableClass = classNames({
        "w-full rounded-md": true,
        "border border-gray-300": props.border,
    });
    // Return the table content
    return (
        <table className={tableClass} data-testid="dt-table">
            <thead className="" data-testid="dt-table-header">
                <tr className="border-b-2 border-gray-300">
                    {props.selectable && (
                        <td className="p-3 w-12"></td>
                    )}
                    {(props.columns || []).map((column, index) => {
                        const key = `header:cell:${index}`;
                        const cellClass = classNames({
                            "p-3 font-bold": true,
                            "border-l-1 first:border-l-0 border-gray-300": props.border,
                        });
                        const handleCellClick = event => {
                            return props.onHeaderCellClick(event, column.index);
                        };
                        // //Check if column is sortable
                        // if (typeof column.sortable === "boolean" && column.sortable === true) {
                        //     //Add the sortable class
                        //     //cellProps.className.push("neutrine-datatable-header-cell--sortable");
                        //     cellProps.sortable = true;
                        //     cellProps.order = column.order;
                        //     //Add the column order
                        //     //if (column.order !== null) {
                        //     //    cellProps.className.push("neutrine-datatable-header-cell--" + column.order);
                        //     //}
                        // }
                        return (
                            <td key={key} className={cellClass} onClick={handleCellClick} style={column.style}>
                                <span>{column.content}</span>
                            </td>
                        );
                    })}
                </tr>
            </thead>
            <tbody className="" data-testid="dt-table-body">
                {props.data.map((row, rowIndex) => {
                    const isLast = rowIndex === props.data.length - 1;
                    const rowKey = `body:row:${rowIndex}`;
                    const rowClass = classNames({
                        "odd:bg-white even:bg-gray-100": props.striped,
                        "border-b-1 border-gray-300": !isLast && props.border,
                    });
                    const rowSelected = !!row.selected;
                    const handleRowSelect = event => {
                        event.stopPropagation();
                        event.preventDefault();
                        return props.onBodyRowSelect(event, row.index);
                    };
                    // Return this row
                    return (
                        <tr key={rowKey} className={rowClass} style={row.style}>
                            {props.selectable && (
                                <td className="w-12" onClick={handleRowSelect}>
                                    <div className="flex items-center justify-center">
                                        <input
                                            key={rowKey + rowSelected}
                                            type="checkbox"
                                            className=""
                                            defaultChecked={rowSelected}
                                        />
                                    </div>
                                </td>
                            )}
                            {(row.cells || []).map((cell, cellIndex) => {
                                const cellKey = `body:row${rowIndex}:cell:${cellIndex}`;
                                const cellClass = classNames({
                                    "p-3": true,
                                    "border-l-1 first:border-l-0 border-gray-300": props.border,
                                });
                                const handleCellClick = event => {
                                    return props.onBodyCellClick(event, row.index, cell.index);
                                };
                                return (
                                    <td key={cellKey} className={cellClass} style={cell.style} onClick={handleCellClick}>
                                        {cell.content}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

DataTableRender.defaultProps = {
    data: [],
    columns: [],
    border: false,
    striped: false,
    hover: false,
    selectable: false,
    onHeaderCellClick: null,
    onHeaderRowSelect: null,
    onBodyCellClick: null,
    onBodyRowSelect: null
};

// DataTable component
export const DataTable = React.forwardRef((props, ref) => {
    const [state, setState] = React.useState(() => {
        const pageSize = (props.pagination === false) ? props.data.length : props.pageSize;
        return {
            updateKey: 0,
            page: 0,
            pages: calculatePages(props.data.length, pageSize),
            pageSize: pageSize,
            sortedColumns: [], 
            filteredRows: range(0, props.data.length),
            sortedRows: range(0, props.data.length)
        };
    });
    // Initialize public api for datatable
    if (ref && typeof ref?.current !== "undefined") {
        ref.current = {
            forceUpdate: () => {
                setState(prevState => ({
                    ...prevState,
                    updateKey: prevState.updateKey + 1,
                }));
            },
            getColumn: index => props.columns[index],
            getRow: index => props.rows[index],
            countRows: () => props.data.length,
            // Manage pages
            nextPage: () => setState(prevState => ({
                ...prevState,
                page: Math.min(prevState.page + 1, prevState.pages - 1),
            })),
            prevPage: () => setState(prevState => ({
                ...prevState,
                page: Math.max(0, prevState.page - 1),
            })),
            // getCurrentPage: () => state.page,
            // getTotalPages: () => state.pages,
            // Filter rows
            filter: fn => {
                const filteredRows = range(0, props.data.length).filter(index => {
                    return !!fn(props.data[index], index);
                });
                return setState(prevState => ({
                    ...prevState,
                    updateKey: prevState.updateKey + 1,
                    filteredRows: filteredRows,
                    sortedRows: getSortedRows(props.data, filteredRows, props.columns, prevState.sortedColumns),
                    pages: calculatePages(filteredRows.length, prevState.currentPageSize),
                    page: 0,
                }));
            },
        };
    }
    // Handle page change
    const handlePageChange = page => {
        // TODO: emit onPageChange event
        setState(prevState => ({
            ...prevState,
            updateKey: prevState.updateKey + 1,
            page: page,
        }));
    };
    // Handle the page size change
    const handlePageSizeChange = size => {
        // TODO: emit onPageSizeChange event
        return setState(prevState => {
            return {
                ...prevState,
                updateKey: prevState.updateKey + 1,
                page: 0,
                pages: calculatePages(prevState.filteredRows.length, size),
                pageSize: size,
            };
        });
    };
    // Handle the cell click event
    const handleBodyCellClick = (event, rowIndex, columnIndex) => {
        //console.log("Clicked on row: " + rowIndex);
        //console.log("Clicked on cell: " + columnIndex);
        if (typeof props.onBodyCellClick === "function") {
            const row = props.data[rowIndex];
            const column = props.columns[columnIndex];
            return props.onBodyCellClick(event, row, rowIndex, column, columnIndex);
        }
    };
    // Handle body row select event
    const handleBodyRowSelect = (event, index) => {
        if (typeof props.onBodyRowSelect === "function") {
            return props.onBodyRowSelect(event, props.data[index], index);
        }
    }
    // Handle the header cell click event
    const handleHeaderCellClick = (event, columnIndex) => {
        const column = props.columns[columnIndex];
        if (column.sortable === true) {
            const sortedColumns = getSortedColumns(state.sortedColumns, columnIndex, event.shiftKey);
            setState(prevState => ({
                ...prevState,
                updateKey: prevState.updateKey + 1,
                sortedColumns: sortedColumns,
                sortedRows: getSortedRows(props.data, state.filteredRows, props.columns, sortedColumns),
            }))
        }
        // Call the header click method
        if (typeof props.onHeaderCellClick === "function") {
            props.onHeaderCellClick(event, column, columnIndex);
        }
    };
    // Handle the header row select event
    // const handleHeaderRowSelect = event => {
    //     return null;
    // };
    // Check for no columns or data to display
    if (props.columns.length === 0 || props.data.length === 0) {
        return (
            <div className="w-full text-center" data-testid="dt-empty">
                <span>{props.emptyText}</span>
            </div>
        );
    }
    // Calculate the rows start and end values
    const rowSize = state.sortedRows.length;
    const rowStart = Math.max(0, state.page * state.pageSize);
    const rowEnd = Math.min(rowStart + state.pageSize, rowSize);
    const height = props.pagination ? null : props.height;
    // Get table columns
    const columns = props.columns.map((column, index) => {
        if (typeof column.visible === "boolean" && !column.visible) {
            return null;
        }
        const columnProps = {
            index: index,
            content: column.title || "",
            sortable: !!column.sortable,
            order: null,
            className: column.headerClassName || "",
            style: column.headerStyle || {},
        };
        // Check if column is sortable
        if (columnProps.sortable) {
            const columnOrder = state.sortedColumns.findIndex(c => c.index === index);
            if (columnOrder !== -1) {
                columnProps.order = state.sortedColumns[columnOrder].order.toLowerCase();
            }
        }
        // Add this column to the list of displayed columns
        return columnProps;
    });
    // Add the table data
    const data = [];
    if (state.sortedRows.length > 0) {
        for (let i = rowStart; i < rowEnd; i++) {
            const rowIndex = state.sortedRows[i];
            const row = props.data[rowIndex];
            const rowProps = {
                index: rowIndex,
                cells: [],
                style: null,
                className: null,
                selected: typeof props.rowSelected === "function" ? props.rowSelected(row, rowIndex) : false,
            };
            // Build the row cells content
            props.columns.forEach((column, index) => {
                // Check if this column is not visible
                if (typeof column.visible === "boolean" && column.visible === false) {
                    return null;
                }
                // Save cell configuration
                rowProps.cells.push({
                    index: index,
                    style: {}, // helpers.callProp(column.bodyClassName, [row, rowIndex, column, index]),
                    className: "", // helpers.callProp(column.bodyStyle, [row, rowIndex, column, index]),
                    content: getCellContent(row, rowIndex, column, index),
                });
            });
            // Assign row style
            // rowProps.className = helpers.callProp(this.props.bodyRowClassName, [row, rowProps.index, rowProps.selected]);
            // rowProps.style = helpers.callProp(this.props.bodyRowStyle, [row, rowProps.index, rowProps.selected]);
            data.push(rowProps);
        }
    }
    return (
        <div className="w-full maxw-full" data-testid="dt">
            <div className="w-full overflow-x-auto" style={{height: height, ...props.style}}>
                <DataTableRender
                    key={state.updateKey}
                    data={data}
                    columns={columns.filter(c => !!c)}
                    border={!!props.border}
                    striped={!!props.striped}
                    hover={!!props.hover}
                    selectable={!!props.selectable}
                    onHeaderCellClick={handleHeaderCellClick}
                    onBodyCellClick={handleBodyCellClick}
                    onBodyRowSelect={handleBodyRowSelect}
                />
            </div>
            {props.showPagination && props.pagination && (
                <DataTablePagination
                    page={state.page}
                    pages={state.pages}
                    pageSize={state.pageSize}
                    pageSizeOptions={props.pageSizeOptions}
                    rowStart={rowStart}
                    rowEnd={rowEnd}
                    rowSize={rowSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}
        </div>
    );
});

// Default props for datatable
DataTable.defaultProps = { 
    data: [],
    columns: [], 
    // Global table style configuration
    border: true, 
    striped: false, 
    hover: false,
    height: null,
    className: null, // Global table classname
    style: null, // Global table style
    // Header row style
    headerRowClassName: null,
    headerRowStyle: null,
    // Body row style
    bodyRowClassName: null,
    bodyRowStyle: null,
    //Pagination
    pagination: true, // Use pagination
    showPagination: true, // Display pagination
    page: 0, // Initial page
    pageSize: 10, // Initial number of rows for each page
    pageSizeOptions: [5, 10, 15], // Available rows for each page
    // showPaginationTop: false, // Not available yet
    // showPaginationBottom: false, // Not available yet
    // showPageSize: false, // Not available yet
    // Selection
    selectable: false,
    rowSelected: null,  // Set if a body row should be selected
    //Default texts
    emptyText: "No data to display",
    // Events listeners
    onBodyCellClick: null, // Body cell click event listener
    onHeaderCellClick: null, // Header cell click event listener
    onHeaderRowSelect: null,  // Select/deselect on a header row
    onBodyRowSelect: null,  // Select/deselect on a body row
    onPageChange: null, // Current page changed
    onPageSizeChange: null, // Page size changed
};
