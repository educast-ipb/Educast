import React, { useState, useMemo, useCallback } from 'react';

import ChipInput from 'material-ui-chip-input';
import style from './InputChip.module.scss';

const InputChip = ({ title, type, value, onChange: handleChange, name }) => {
	const [tags, setTags] = useState(value);

	const handleAddChip = useCallback(
		(chip) => {
			setTags((prev) => {
				const tags = [...prev, chip];
				handleChange(name, tags);
				return tags;
			});
		},
		[handleChange, name]
	);

	const handleDeleteChip = (chip, index) => {
		tags.splice(index, 1);
		setTags(tags);
		handleChange(name, tags);
	};

	const inputClasses = useMemo(
		() => ({
			inputRoot: style['input-root'],
			input: style['input'],
			root: style['textarea-tag'],
			chip: style['chip'],
			chipContainer: style['chip-container'],
		}),
		[]
	);

	return (
		<div>
			<label className={style['label']}>
				<h4 className={style['h4-margin']}> {title} </h4>

				<h5>
					<ChipInput
						variant="standard"
						autoFocus={false}
						name={title}
						disableUnderline={true}
						classes={inputClasses}
						value={tags}
						onAdd={(chip) => handleAddChip(chip)}
						onDelete={(chip, index) => handleDeleteChip(chip, index)}
					/>
				</h5>
			</label>
		</div>
	);
};

export default InputChip;
