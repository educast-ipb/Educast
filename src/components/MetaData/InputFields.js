import React, { useCallback, useState } from 'react';

const InputFields = ({ title, name, type, value, onChange: handleChange }) => {
	const [innerValue, setInnerValue] = useState(value);

	const onChange = useCallback(
		(e) => {
			const { value } = e.target;
			setInnerValue(value);
			handleChange(name, value);
		},
		[handleChange, name]
	);

	return (
		<div>
			<label>
				<h4> {title} </h4>
				<h5>
					<input
						type={type}
						name={title}
						value={innerValue}
						onChange={onChange}
					/>
				</h5>
			</label>
		</div>
	);
};

export default InputFields;
