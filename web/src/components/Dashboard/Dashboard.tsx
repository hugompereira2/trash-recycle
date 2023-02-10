import logo from '../../assets/logo.svg';
import { CaretDown, Plus, SignOut, UserCircle, X } from "phosphor-react";
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../LoginForm/LoginForm";
import "./Dashboard.scss";
import { useState, useMemo } from "react";
import { useTable, TableOptions, Column } from "react-table";

// interface ReactTableProps<T extends object> {
//     data: T[];
//     columns: Column<T>[];
// }

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const data = useMemo(
        () => [
            {
                col1: '1',
                col2: '30/01/2023',
                col3: 'Interprise',
                col4: 'Pendente',
            },
            {
                col1: '1',
                col2: '30/01/2023',
                col3: 'Interprise',
                col4: 'Pendente',
            },
            {
                col1: '1',
                col2: '30/01/2023',
                col3: 'Interprise',
                col4: 'Pendente',
            },
        ],
        []
    )

    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'col1', // accessor is the "key" in the data
            },
            {
                Header: 'Data',
                accessor: 'col2',
            },
            {
                Header: 'Empresa',
                accessor: 'col3',
            },
            {
                Header: 'Status',
                accessor: 'col4',
            },
        ],
        []
    )

    const tableInstance = useTable<{}>({ columns, data })
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    return (
        <div id="dashboard">
            <div className="table-container">
                <h1>Dashboard</h1>
                <table {...getTableProps()} style={{
                    borderRadius: '8px',
                }}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th
                                        {...column.getHeaderProps()}
                                        style={{
                                            borderBottom: '1px solid #ced4da',
                                            color: 'black',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                style={{
                                                    padding: '10px',
                                                    borderBottom: '1px solid #ced4da',
                                                }}
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard