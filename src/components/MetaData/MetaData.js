import React, { useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import style from './MetaData.module.scss';
import InputFields from './InputFields';
import InputComment from './InputComment';
import InputChip from './InputChip';

const MetaData = () => {
	const dispatch = useDispatch();
	const { title, subtitle, date, local, description, tag } = useSelector(
		(state) => state.metadata
	);

	console.log(title);

	const onChange = useCallback(
		(name, value) => {
			dispatch({ type: 'SET_METADATA', name, value });
		},
		[dispatch]
	);

	return (
		<div className={style.metadata}>
			<form>
				<div>
					<div className={style.container}>
						<InputFields
							title="Título"
							type="text"
							value={title}
							name="title"
							onChange={onChange}
						/>
						<InputFields
							title="Subtítulo"
							type="text"
							value={subtitle}
							name="subtitle"
							onChange={onChange}
						/>
						<InputFields
							title="Data"
							type="text"
							value={date}
							name="date"
							onChange={onChange}
						/>
						<InputFields
							title="Local"
							type="text"
							name="local"
							value={local}
							onChange={onChange}
						/>
					</div>
					<div className={style.container}>
						<InputComment
							title="Descrição"
							name="description"
							type="text"
							value={description}
							onChange={onChange}
						/>
						<InputChip
							title="Tag"
							name="tag"
							onChange={onChange}
							type="text"
							value={tag}
						/>
					</div>

					<div className={style.group}></div>
				</div>
			</form>
		</div>
	);
};

export default MetaData;
