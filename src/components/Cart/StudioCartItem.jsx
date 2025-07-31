import React from 'react'
import DeleteIcon from '../../../public/Assets/studio/DeleteIcon'

const StudioCartItem = ({title,description,image}) => {

    

    return (
        <div> 
            <div className="flex justify-start items-center py-2 border-b p-2">
            <div className="w-20 h-20 flex-shrink-0 mr-4">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
                <div className="flex-col">
                    <p className=" font-semibold">{title}</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default StudioCartItem