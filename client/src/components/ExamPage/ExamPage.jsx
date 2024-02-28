import React, { useState, useEffect } from 'react';
import Bar from './Bar';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useRestrictCopyPaste } from './useRestrictCopyPaste.ts';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Pagination from '@mui/material/Pagination';
import { Stack } from '@mui/material';
import Loader from '../Loader/Loader.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import AlertDialog from './AlertDialog.jsx';

export default function ExamPage() {
	const {
		state: { examId, studentId, exam, startTime },
	} = useLocation();
	const webcamRef = React.useRef(null);
	const [imgSrc, setImgSrc] = React.useState(null);
	const [queryParameters] = useSearchParams();
	const [cam, setCam] = useState(true);
	const [stuimage, setStuImage] = useState('');
	const [multipleperson, setMultiplePerson] = useState(0);
	const [differentperson, setDifferentPerson] = useState(0);
	const [dialog, setDialog] = useState(null);
	const capture = React.useCallback(() => {
		console.log(stuimage.length);
		if (webcamRef.current && stuimage.length > 0) {
			const imageSrc = webcamRef.current.getScreenshot();
			// setImgSrc(imageSrc);
			console.log('heioiy');
			// console.log(imageSrc);
			console.log(typeof stuimage);
			console.log(stuimage.length);
			console.log(typeof imageSrc);
			axios
				.post(`http://127.0.0.1:8000/check`, {
					'photo': stuimage,
					'webcam': imageSrc,
				})
				.then((res) => {
					console.log('fef');
					if (res.data.no_of_person > 1) {
						setMultiplePerson(multipleperson + 1);
					}
					if (res.data.verified == false) {
						setDifferentPerson(differentperson + 1);
					}
					console.log(res);
				})
				.catch((err) => {
					console.log('feefesfes');
					console.log(err);
				});
		}
		console.log('hey');
	}, [webcamRef, setImgSrc]);

	function capture2() {
		if (webcamRef.current) {
			const imageSrc = webcamRef.current.getScreenshot();
			// setImgSrc(imageSrc);
			console.log('heioiy');
			// console.log(imageSrc);
			console.log(typeof stuimage);
			console.log(stuimage.length);

			console.log(typeof imageSrc);
			axios
				.post(`http://127.0.0.1:8000/check`, {
					'photo': stuimage,
					'webcam': imageSrc,
				})
				.then((res) => {
					console.log('fef');
					console.log(res);
				})
				.catch((err) => {
					console.log('feefesfes');
					console.log(err);
				});
		}
		console.log('hey');
	}
	function camswitch() {
		setCam(!cam);
	}

	var stuid = 'jee';
	// console.log(stuid);
	const handleTabChanged = (e) => {
		//do something else
		// if (!document.fullscreenElement) {
		// 	console.log('tab changed');
		// 	alert('You are not allowed to leave page blah blah');
		// }
		setDialog('You are not allowed to leave page blah blah');
	};
	const handleFullScreenChange = (e) => {
		e.preventDefault();
		if (!document.fullscreenElement) {
			// alert('You are not allowed to leave fullscreen blah blah');
			// console.log(
			// 	'fullscreen changed',
			// 	document.fullscreenElement
			// 	// window.fullScreen
			// );
			setDialog('You are not allowed to leave fullscreen blah blah');
		}
	};
	useEffect(() => {
		window.addEventListener('blur', handleTabChanged);
		window.addEventListener('fullscreenchange', handleFullScreenChange);
		return () => {
			window.removeEventListener('fullscreenchange', handleFullScreenChange);
			window.removeEventListener('blur', handleTabChanged);
		};
	}, []);
	/* useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND}/student/getimage/${stuid}`,).
    then((res)=>{
      // stuimage = res.data;
      setStuImage(res.data);
      console.log("fasd1"); 
      // console.log(res.data);
      console.log(res.data.length)
      console.log(stuimage.length)
    }).catch((err)=>{
      console.log(err);
    });
  },[]);


  
  useEffect(() => {
    
    if (cam) {
        setTimeout(()=>{
          if(stuimage.length!=0){
            console.log("------")
            console.log(stuimage.length)
            console.log("////////////")
            const intervalId = setInterval(() => {
              capture2();
            }, 8000);
            return () => clearInterval(intervalId);
          }
      },3000)      
    }
  }, [cam, capture,stuimage]);

  useEffect(() => {
    const keyDownHandler = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []); @note commented as they were throwing error -dm */
	// setTimeout(() => {
	//   setCam(true);
	// }, 3000);
	function QuestionPaper() {
		pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
		const [numPages, setNumPages] = useState(null);
		const [pageNumber, setPageNumber] = useState(1);
		const [progress, setProgress] = useState(0);
		/*To Prevent right click on screen*/
		document.addEventListener('contextmenu', (event) => {
			event.preventDefault();
		});

		/*When document gets loaded successfully*/
		function onDocumentLoadSuccess({ numPages }) {
			setNumPages(numPages);
			setPageNumber(1);
		}

		// function changePage(offset) {
		// 	setPageNumber((prevPageNumber) => prevPageNumber + offset);
		// }
		function changePageNumber(e, n) {
			setPageNumber(n);
		}
		// function previousPage() {
		// 	changePage(-1);
		// }

		// function nextPage() {
		// 	changePage(1);
		// }

		return (
			<Stack
				spacing={2}
				alignItems='center'
			>
				<Document
					loading={<Loader />}
					file={`${process.env.REACT_APP_BACKEND}/exam/download/${exam.file}`}
					onLoadSuccess={onDocumentLoadSuccess}
				>
					<Page
						loading={<Loader />}
						pageNumber={pageNumber}
					/>
				</Document>
				{numPages && (
					<Pagination
						count={numPages}
						boundaryCount={0}
						variant='outlined'
						color='primary'
						size='large'
						siblingCount={1}
						onChange={changePageNumber}
						showFirstButton
						showLastButton
					/>
				)}
				{/* <div>
						<div>
							Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
						</div>
						<div>
							<button
								type='button'
								disabled={pageNumber <= 1}
								onClick={previousPage}
								className='Pre'
							>
								Previous
							</button>
							<button
								type='button'
								disabled={pageNumber >= numPages}
								onClick={nextPage}
							>
								Next
							</button>
						</div>
					</div> */}
			</Stack>
		);
	}
	useRestrictCopyPaste({ window, actions: ['copy', 'cut', 'paste', 'select'] });
	return (
		<>
			<Bar
				startTime={startTime}
				exam={exam}
			/>
			{/* <Webcam 
        width={0}
        ref={webcamRef}>
      </Webcam> */}
			{cam ? (
				<div>
					<Webcam
						audio={false}
						ref={webcamRef}
						screenshotFormat='image/jpeg'
						forceScreenshotSourceSize={true}
						style={{ width: '0%' }}
						// screenshotQuality={1}
					/>
				</div>
			) : (
				''
			)}
			<button onClick={capture}>Capture photo</button>
			{imgSrc && <img src={imgSrc} />}
			<button onClick={camswitch}>switch</button>
			<QuestionPaper />
			{dialog && (
				<AlertDialog
					dialogContent={dialog}
					handler={setDialog}
				/>
			)}
		</>
	);
}
