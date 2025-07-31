

import { useDispatch } from 'react-redux';
import DeleteIcon from "../../../public/Assets/studio/DeleteIcon";
import { ChevronDownIcon, ChevronRightIcon, Plus, Minus } from 'lucide-react';
import { updateEquipment, updateHelper, updatePackage, updateService } from '@/stores/bookingSlice';

const CartItem = ({
    title,
    price,
    image,
    itemId,
    itemType,
    quantity,
    isPackage = false,
    isExpanded = false,
    onToggle,
    isSubItem = false
}) => {
    const dispatch = useDispatch();
    
    // Map itemType to Redux actions
    const actionMap = {
        'services': updateService,
        'equipments': updateEquipment,
        'packages': updatePackage,
        'helpers': updateHelper,
    };
    
    // Handle increment
    const handleIncrement = () => {
        const action = actionMap[itemType];
        if (action) {
            dispatch(action({ id: itemId, change: 1 }));
        }
    };
    
    // Handle decrement
    const handleDecrement = () => {
        const action = actionMap[itemType];
        if (action) {
            // Always decrement by -1, the reducer will handle deletion if count reaches 0
            dispatch(action({ id: itemId, change: -1 }));
        }
    };
    
    // Handle direct delete
    const handleDelete = () => {
        const action = actionMap[itemType];
        if (action) {
            // Delete by setting change to negative quantity to force count to 0
            dispatch(action({ id: itemId, change: -quantity }));
        }
    };
    
    return (
        <div className={`flex justify-between items-center py-3 ${!isSubItem ? 'border-b' : ''} p-2 ${isSubItem ? 'bg-gray-50' : ''}`}>
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 mr-3 flex items-center justify-center">
                    {image && (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    )}
                </div>
                <div className="flex flex-col">
                    <p className={`text-sm font-medium ${isSubItem ? 'text-gray-600' : 'text-gray-800'} truncate`}>
                        {title}
                    </p>
                    {isSubItem && (
                        <p className="text-xs text-gray-500">
                            {itemType === 'services' ? 'Service' : 
                             itemType === 'equipments' ? 'Equipment' : 
                             itemType === 'packages' ? 'Package' : 'Helper'}
                        </p>
                    )}
                </div>
                {isPackage && (
                    <button
                        onClick={onToggle}
                        className="mr-1 hover:bg-gray-100 rounded p-1 transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                        ) : (
                            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                        )}
                    </button>
                )}
                
                {/* Sub-item indicator (optional) */}
                {isSubItem && (
                    <div className="w-4 h-4 mr-1"></div> 
                )}
            </div>
            
            <div className="flex items-center gap-3">
                <p className={`text-sm ${isSubItem ? 'text-gray-600' : 'text-gray-700'} font-semibold`}>
                    ₹{price}
                </p>
                
                {!isSubItem && (
                    <div className="flex items-center gap-2">
                        {quantity > 1 ? (
                            // Show +/- buttons when quantity > 1
                            <div className="flex items-center border rounded">
                                <button
                                    onClick={handleDecrement}
                                    className="px-2 py-1 hover:bg-gray-100 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
                                <button
                                    onClick={handleIncrement}
                                    className="px-2 py-1 hover:bg-gray-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            // Show delete button when quantity is 1
                            <button
                                onClick={handleDelete}
                                className="p-1 hover:bg-red-50 rounded transition-colors duration-200 text-red-600"
                            >
                                <DeleteIcon />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartItem;