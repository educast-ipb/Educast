import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';

import styles from './EditableTextField.module.scss';

const useStyles = makeStyles({
	editableTextField: {
		fontSize: '0.75rem',
		color: 'black',
		background: '#ECECEC',
		height: '2.5rem',
		width: '100%',
		padding: '0.3125rem 0.625rem 0.125rem 0.625rem',
	},
});

const EditableTextField = ({
	type,
	value,
	updateTitleFunction,
	chapter,
	isTextFieldBeingEdited,
}) => {
	const [editable, setEditable] = useState(false);
	const [fieldValue, setFieldValue] = useState(value);
	const [fieldBackupValue, setFieldBackupValue] = useState('');
	const classes = useStyles();

	const handleInputOnChange = (event) => {
		setFieldValue(event.target.value);
	};

	const handleInputOnBlur = () => {
		setEditable(false);
		isTextFieldBeingEdited(false);
		updateTitleFunction(chapter.id, fieldValue);
	};

	const handleInputOnFocus = (event) => {
		const value = event.target.value;
		event.target.value = '';
		event.target.value = value;
		setFieldBackupValue(fieldValue);
	};

	const handleInputOnKeyUp = (event) => {
		if (event.key === 'Escape') {
			setEditable(false);
			isTextFieldBeingEdited(false);
			setFieldValue(fieldBackupValue);
			updateTitleFunction(chapter.id, fieldBackupValue);
		}
		if (event.key === 'Enter') {
			setEditable(false);
			isTextFieldBeingEdited(false);
			updateTitleFunction(chapter.id, fieldValue);
		}
	};

	const handleFieldOnClick = () => {
		setEditable(editable === false);
		isTextFieldBeingEdited(editable === false);
	};

	return (
		<div className={styles['description-label']}>
			{editable ? (
				<Input
					id="chapter-title"
					type={type}
					value={fieldValue}
					className={classes.editableTextField}
					autoFocus
					multiline={true}
					onFocus={handleInputOnFocus}
					onChange={handleInputOnChange}
					onBlur={handleInputOnBlur}
					onKeyUp={handleInputOnKeyUp}
					rowsMax={2}
					inputProps={{
						'aria-label': 'title',
					}}
				/>
			) : (
				<div className={styles['textfield-label']} onClick={handleFieldOnClick}>
					{fieldValue}
				</div>
			)}
		</div>
	);
};

export default EditableTextField;
