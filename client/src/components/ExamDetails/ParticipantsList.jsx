import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
	{ id: 'firstname', label: 'First Name', align: 'center', minWidth: 170 },
	{ id: 'lastname', label: 'Last Name', align: 'center', minWidth: 100 },
	{
		id: 'personalEmail',
		label: 'Email Id',
		minWidth: 170,
		align: 'center',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'viewApplication',
		label: 'View Application',
		minWidth: 170,
		align: 'center',
		format: (value) => value.toLocaleString('en-US'),
	},
];
export default function ParticipantsList({ data, examId }) {
	// console.log(data[0]);
	const Navigate = useNavigate();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleViewApplication = async (e) => {
		e.preventDefault();
		Navigate('/ViewApplicationForm', {
			state: {
				examId: e.currentTarget.id.toString().split(' ')[0],
				studentId: e.currentTarget.id.toString().split(' ')[1],
			},
		});
	};

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table
					stickyHeader
					aria-label='sticky table'
				>
					<TableHead>
						<TableRow>
							<TableCell
								align='center'
								colSpan={12}
							>
								<h2>Participants</h2>
							</TableCell>
						</TableRow>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{
										minWidth: column.minWidth,
										fontSize: '20px',
									}}
								>
									{column.id != 'viewApplication' &&
										column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data
							.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
							)
							.map((row) => {
								console.log(row);
								return (
									<TableRow
										hover
										role='checkbox'
										tabIndex={-1}
										key={row._id}
									>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell
													key={column.id}
													align={column.align}
													style={{ fontSize: '15px' }}
												>
													{column.id !=
														'viewApplication' &&
														value}
													{column.id ==
														'viewApplication' && (
														<Button
															variant='outlined'
															id={
																row.examId +
																' ' +
																row.studentId
															}
															onClick={
																handleViewApplication
															}
														>
															View Application
														</Button>
													)}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component='div'
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
