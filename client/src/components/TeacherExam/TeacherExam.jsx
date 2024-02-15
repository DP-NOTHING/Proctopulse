// import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';

export default function TeacherExam() {
	// useEffect(())
	const [isLoading, setIsLoading] = useState(true);
	const Navigate = useNavigate();
	const [exams, setExams] = useState([]);
	const deleteExam = async (e) => {
		try {
			// console.log(e.currentTarget.id);
			setIsLoading(true);
			const deletedExamId = e.currentTarget.id;
			await axios.delete(
				`${process.env.REACT_APP_BACKEND}/exam/${e.currentTarget.id}`
			);
			setExams(exams.filter((exam) => exam._id != deletedExamId));
			setIsLoading(false);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		// console.log('jnsdnknsdkxnkdsn');
		const fetchExams = async () => {
			try {
				const response = await axios.get(
					`${
						process.env.REACT_APP_BACKEND
					}/exam/${localStorage.getItem('email')}`
				);
				return response;
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchExams()
			.then((response) => {
				console.log(response.data);
				setExams(response.data);
				setIsLoading(false);
			})
			.catch((res) => {
				console.error(res);
				setIsLoading(false);
			});

		return () => {};
	}, []);
	return (
		<>
			{isLoading && <Loader />}
			{isLoading || (
				<Box sx={{ width: '100%', maxWidth: 'fit' }}>
					<Typography
						sx={{ mt: 4, mb: 2, ml: 4 }}
						variant='h4'
						component='div'
					>
						Exams
					</Typography>
					<List>
						{/* <ListItem
							disablePadding
							secondaryAction={
								<IconButton
									edge='end'
									aria-label='delete'
								>
									<DeleteIcon />
								</IconButton>
							}
						>
							<ListItemButton>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary='Inbox' />
							</ListItemButton>
						</ListItem>
						<ListItem
							disablePadding
							secondaryAction={
								<IconButton
									edge='end'
									aria-label='delete'
								>
									<DeleteIcon />
								</IconButton>
							}
						>
							<ListItemButton>
								<ListItemIcon>
									<DraftsIcon />
								</ListItemIcon>
								<ListItemText primary='Drafts' />
							</ListItemButton>
						</ListItem> */}
						{exams.map((exam) => (
							<ListItem
								key={exam._id.toString()}
								disablePadding
								secondaryAction={
									// <div
									// 	onClickCapture={deleteExam}
									// 	id={`${exam._id.toString()}`}
									// >
									<IconButton
										id={`${exam._id.toString()}`}
										edge='end'
										aria-label='delete'
										onClick={deleteExam}
									>
										<DeleteIcon />
									</IconButton>
									// </div>
								}
							>
								<ListItemButton>
									<ListItemIcon>
										<DraftsIcon />
									</ListItemIcon>
									<ListItemText
										primary={`${exam.examName}`}
									/>
								</ListItemButton>
							</ListItem>
						))}
						<ListItem disablePadding>
							<ListItemButton
								onClick={() => Navigate('/create-exam')}
								sx={{ backgroundColor: '#F5EBFF' }}
							>
								<ListItemIcon>
									<AddIcon />
								</ListItemIcon>
								<ListItemText primary='Create New Exam' />
							</ListItemButton>
						</ListItem>
					</List>
				</Box>
			)}
		</>
	);
}
