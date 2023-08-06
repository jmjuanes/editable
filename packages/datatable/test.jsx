import {render, screen} from "@testing-library/react";
import {DataTable} from "./index.jsx";

// Mock dependencies
jest.mock("@josemi-icons/react", () => ({
    ChevronLeftIcon: jest.fn(() => "CHEVRON_LEFT_ICON"),
    ChevronRightIcon: jest.fn(() => "CHEVRON_RIGHT_ICON"),
}));

describe("DataTable", () => {
    const COLUMN_RENDER_RETURN = "custom value returned by column.render";
    const fakeColumns = Object.values({
        column1: {
            title: "Column 1",
            field: "key1",
        },
        column2: {
            title: "Column 2",
            render: () => {
                return COLUMN_RENDER_RETURN;
            },
        },
        column3: {
            title: "Column 3",
            visible: false,
        },
    });
    const fakeData = Object.values({
        row1: {
            key1: "value1",
        },
    });

    describe("empty message", () => {
        it("should render empty message if no data is provided", () => {
            render(<DataTable />);
            expect(screen.queryByTestId("dt-empty")).not.toBeNull();
            expect(screen.getByTestId("dt-empty").textContent).toEqual("No data to display");
        });

        it("should render the provided message via the prop 'emptyText'", () => {
            const EMPTY_MESSAGE = "This is an empty message";
            render(<DataTable emptyText={EMPTY_MESSAGE} />);
            expect(screen.getByTestId("dt-empty").textContent).toEqual(EMPTY_MESSAGE);
        });
    });

    describe("columns", () => {
        let container = null;
        beforeEach(() => {
            render(<DataTable columns={fakeColumns} data={fakeData} />);
        });

        it("should render provided columns", () => {
            expect(screen.queryByText("Column 1")).not.toBeNull();
            expect(screen.queryByText("Column 2")).not.toBeNull();
        });

        it("should not display hidden columns", () => {
            expect(screen.queryByText("Column 3")).toBeNull();
        });

        it("should display value returned by 'column.render'", () => {
            expect(screen.queryAllByText(COLUMN_RENDER_RETURN)).not.toHaveLength(0);
        });
    });

    describe("data", () => {
        beforeEach(() => {
            render(<DataTable columns={fakeColumns} data={fakeData} />);
        });

        it("should render the provided data", () => {
            expect(screen.getByTestId("dt-table-body").querySelectorAll(`tr > td`)).not.toHaveLength(0);
        });
    });
});
