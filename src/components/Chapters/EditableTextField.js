import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import styles from './EditableTextField.module.scss';
import { makeStyles } from '@material-ui/core/styles';

const mkStyles = makeStyles({
	editableTextfield: {
		fontSize: '1.7vh',
		color: 'black',
		background: '#ECECEC',
		width: '100%',
		height: '100%',
	}
});

const EditableTextField = ({ type, value, updateTitleFunction, chapter, isTextFieldBeingEdited }) => {
	const [editable, setEditable] = useState(false);
	const [fieldValue, setFieldValue] = useState(value);
	const [fieldBackupValue, setFieldBackupValue] = useState('');
	const classes = mkStyles();

	const handleInputOnChange = (event) => {
		setFieldValue(event.target.value);
	};

	const handleInputOnBlur = (event) => {
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

	const handleFieldOnClick = (event) => {
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
					className={classes.editableTextfield}
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
