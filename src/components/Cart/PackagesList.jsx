import React, { useState } from 'react';
import CartItem from './CartItem';
import { ChevronDownIcon } from 'lucide-react'; // or use your own arrow icon

const PackagesList = ({ packages }) => {
    const [expandedPackages, setExpandedPackages] = useState({});
    
    const togglePackage = (packageId) => {
        setExpandedPackages(prev => ({
            ...prev,
            [packageId]: !prev[packageId]
        }));
    };
    
    
    return (
        <>
           {packages?.length > 0 && (

<div className="mb-4"> 
            <h3 className="text-[#872980] text-[14px] font-bold text-center bg-[#FCF3FB] py-1">Packages</h3>
            {packages?.map((item, index) => (
                <div key={item._id} className="mt-4">
                    <CartItem
                        key={index}
                        title={item?.name}
                        price={item?.price}
                        image={item?.photo}
                        quantity={item?.count}
                        itemType="packages"
                        isPackage={true}
                        isExpanded={expandedPackages[item._id]}
                        onToggle={() => togglePackage(item._id)}
                    />
                    
                    {/* Show services and equipment when expanded */}
                    {expandedPackages[item._id] && (
                        <div className="ml-4 mt-2 border-l-2 border-gray-200 bg-gray-50">
                            {/* Services */}
                            {item?.services?.map((service) => (
                                <CartItem
                                    key={`service-${service._id}`}
                                    title={service?.name}
                                    price={service?.price}
                                    image={service?.photo}
                                    quantity={1}
                                    itemType="services"
                                    isSubItem={true}
                                />
                            ))}
                            
                            {/* Equipments */}
                            {item?.equipments?.map((equipment) => (
                                <CartItem
                                    key={`equipment-${equipment._id}`}
                                    title={equipment?.name}
                                    price={equipment?.price}
                                    image={equipment?.photo}
                                    quantity={1}
                                    itemType="equipments"
                                    isSubItem={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
            </div>)}
        </>
    );
};

export default PackagesList;