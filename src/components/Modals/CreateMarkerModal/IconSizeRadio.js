import React from 'react';
import { Label } from "@windmill/react-ui";


const IconSizeRadio = ({formValues, handleInputChange}) => {
	return (
		<>
		<Label className="mt-4">
			<span className='text-gray-200'>Icon Size</span>
		</Label>
		<div className="grid grid-cols-3 gap-2 rounded bg-gray-700 p-2 mt-1">
			<div>
				<input
					type="radio"
					name="iconProfile"
					id="profile-small"
					value="small"
					className="peer hidden"
					checked={formValues.iconProfile === 'small'}
					onChange={e => handleInputChange(e, 'iconProfile')}
				/>
				<label htmlFor="profile-small" className="h-full flex items-center block cursor-pointer select-none p-2 text-left peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">
					<div className='flex items-center'>
						<img
							src={`https://img.icons8.com/?size=50&id=${formValues?.icon?.id}&format=png`}
							alt='icon size small'
							className='mr-2'
							style={{height: '24px'}}
						/>
						<div>
							<div>Small</div>
							<div>24x24 px</div>
						</div>
					</div>
				</label>
			</div>
			<div>
				<input
					type="radio"
					name="iconProfile"
					id="profile-default"
					value="default"
					className="peer hidden"
					checked={formValues.iconProfile === 'default'}
					onChange={e => handleInputChange(e, 'iconProfile')}
				/>
				<label htmlFor="profile-default" className="h-full flex items-center block cursor-pointer select-none p-2 text-left peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">
					<div className='flex items-center'>
						<img
							src={`https://img.icons8.com/?size=50&id=${formValues?.icon?.id}&format=png`}
							alt='icon size default'
							className='mr-2'
							style={{height: '36px'}}
						/>
						<div>
							<div>Medium</div>
							<div>36x36 px</div>
						</div>
					</div>
				</label>
			</div>
			<div>
				<input
					type="radio"
					name="iconProfile"
					id="profile-large"
					value="large"
					className="peer hidden"
					checked={formValues.iconProfile === 'large'}
					onChange={e => handleInputChange(e, 'iconProfile')}
				/>
				<label htmlFor="profile-large" className="h-full flex items-center block cursor-pointer select-none p-2 text-left peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">
					<div className='flex items-center'>
						<img
							src={`https://img.icons8.com/?size=50&id=${formValues?.icon?.id}&format=png`}
							alt='icon size large'
							className='mr-2'
							style={{height: '48px'}}
						/>
						<div>
							<div>Large</div>
							<div>48x48 px</div>
						</div>
					</div>
				</label>
			</div>
		</div>
		</>
	);
}

export default IconSizeRadio;