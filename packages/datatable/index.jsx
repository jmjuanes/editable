import React from "react";
import classNames from "classnames";

// Generate an array range 
const range = (start, length) => {
    return Array(length).fill().map((_, index) => start + index);
};

//Find a class-name in a node list
const findClassInNodeList = (list, className, callback) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i].classList.contains(className) === true) {
            return callback(list[i], i);
        }
    }
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
                const key = columns[index].key;
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

export const DataTablePagination = props => {
    const handlePageChange = page => {
        const newPage = Math.max(0, Math.min(page, props.pages - 1));
        if (props.page !== newPage && typeof props.onPageChange === "function") {
            props.onPageChange(newPpage);
        }
    };
    const handlePaginationChange = event => {
        const entries = parseInt(event.target.value);
        if (!isNaN(entries) && props.pageSize !== entries) { 
            //console.log("New page size: " + entries);
            return props.onPageSizeChange(entries);
        }
    };
    return (
        <div className="datatable-pagination">
            {/* Left side content */}
            <div className="">
                Showing <b>{props.rowStart + 1}</b> to <b>{props.rowEnd}</b> of <b>{props.rowSize}</b> rows.
            </div>
            {/* Right side content */}
            <div className="">
                <div className="">
                    <div className="">Rows per page: </div>
                    <select defaultValue={props.pageSize} className="" onChange={handlePageSizeChange}>
                        {props.pageSizeOptions.map((value, index) => (
                            <option key={index} value={value}>{value.toString()}</option>
                        ))}
                    </select>
                </div>
                <div className="">
                    <button>Prev</button>
                    <div className="">
                        Page {props.page + 1} of {props.pages}
                    </div>
                    <button>Next</button>
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
    // Return the table content
    return (
        <table className="">
            <thead className="">
                <tr className="">
                    {props.selectable && (
                        <td className=""></td>
                    )}
                    {(props.columns || []).map((column, index) => {
                        const key = `header:cell:${index}`;
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
                            <td key={key} className="" onClick={handleCellClick} style={column.style}>
                                <span>{column.content}</span>
                            </td>
                        );
                    })}
                </tr>
            </thead>
            <tbody className="">
                {props.data.map((row, rowIndex) => {
                    const rowKey = `body:row:${rowIndex}`;
                    // const rowSelected = !!row.selected;
                    const handleRowSelect = event => {
                        event.stopPropagation();
                        event.preventDefault();
                        return props.onBodyRowSelect(event, row.index);
                    };
                    // Return this row
                    return (
                        <tr key={rowKey} className="" style={row.style}>
                            {props.selectable && (
                                <td className="" onClick={handleRowSelect}>
                                    Select
                                </td>
                            )}
                            {(row.cells || []).map((cell, cellIndex) => {
                                const cellKey = `body:row${rowIndex}:cell:${cellIndex}`;
                                const handleCellClick = event => {
                                    return props.onBodyCellClick(event, row.index, cell.index);
                                };
                                return (
                                    <td key={cellIndex} className="" style={cell.style} onClick={handleCellClick}>
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
export const DataTable = props => {
    const [state, setState] = React.useState(() => {
        const pageSize = (props.pagination === false) ? props.data.length : props.pageSize;
        return {
            page: 0,
            pages: calculatePages(props.data.length, pageSize),
            pageSize: pageSize,
            sortedColumns: [], 
            filteredRows: range(0, props.data.length),
            sortedRows: range(0, props.data.length)
        };
    });
    // Handle page change
    const handlePageChange = newPage => {
        // TODO: emit onPageChange event
        setState(prevState => ({...prevState, page: page}));
    };
    // Handle the page size change
    const handlePageSizeChange = size => {
        // TODO: emit onPageSizeChange event
        return setState(prevState => {
            return {
                ...prevState,
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
    const handleHeaderRowSelect = event => {
        return null;
    };
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
            const row = props.data[i];
            const rowProps = {
                index: state.sortedRows[i],
                cells: [],
                style: null,
                className: null,
                selected: typeof props.rowSelected === "function" ? props.rowSelected(row, i) : false,
            };
            // Build the row cells content
            props.columns.forEach((column, index) => {
                // Check if this column is not visible
                if (typeof column.visible === "boolean" && column.visible === false) {
                    return null;
                }
                // Initialize the cell props
                const cellProps = {
                    index: index,
                    style: {}, // helpers.callProp(column.bodyClassName, [row, rowIndex, column, index]),
                    className: "", // helpers.callProp(column.bodyStyle, [row, rowIndex, column, index]),
                    content: (typeof column.defaultValue === "string") ? column.defaultValue : ""
                };
                // Check for custom cell content
                if (typeof column.render === "function") {
                    cellProps.content = column.render(row, rowProps.index, column, index);
                }
                // No custom content, find the content in the row data
                else if (column.key && row[column.key]) {
                    cellProps.content = row[column.key];
                }
                // Save the cell information
                rowProps.cells.push(cellProps);
            });
            // Assign row style
            // rowProps.className = helpers.callProp(this.props.bodyRowClassName, [row, rowProps.index, rowProps.selected]);
            // rowProps.style = helpers.callProp(this.props.bodyRowStyle, [row, rowProps.index, rowProps.selected]);
            data.push(rowProps);
        }
    }
    // Check for no columns or data to display
    if (props.columns.length === 0 || props.data.length === 0) {
        return (
            <div className="">
                <span>{props.emptyText}</span>
            </div>
        );
    }
    // Calculate the rows start and end values
    const rowSize = state.sortedRows.length;
    const rowStart = Math.max(0, state.page * state.pageSize);
    const rowEnd = Math.min(rowStart + state.pageSize, rowSize);
    const height = props.pagination ? null : props.height;
    return (
        <div className="">
            <div className="" style={{height: height, ...props.style}}>
                <DataTableRender
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
        </div>
    );
};

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

