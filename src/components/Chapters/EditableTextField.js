import React, { useState } from 'react';

import Input from '@material-ui/core/Input';

import styles from './EditableTextField.module.scss';

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
		<div>
			{editable ? (
				<Input
					id="chapter-title"
					type={type}
					value={fieldValue}
					className={styles['editable-textField']}
					autoFocus
					multiline={true}
					onFocus={handleInputOnFocus}
					onChange={handleInputOnChange}
					onBlur={handleInputOnBlur}
					onKeyUp={handleInputOnKeyUp}
					rowsMax={2}
					inputProps={{
						'aria-label': 'title',
						maxLength: 50,
					}}
				/>
			) : (
				<div className={styles['textField-label']} onClick={handleFieldOnClick}>
					{fieldValue}
				</div>
			)}
		</div>
	);
};

export default EditableTextField;
