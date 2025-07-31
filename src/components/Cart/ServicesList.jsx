import React from 'react'
import CartItem from './CartItem'

const ServicesList = ({ services }) => {

  return (
    <>
           {services?.length > 0 && (

<div className="mb-4"> 
          <h3 className="text-[#872980] text-[14px] font-bold text-center bg-[#FCF3FB] py-1">Services</h3>
      {services?.map((item, index) => (
        <div key={item._id} >
          <CartItem
            key={index}
            title={item?.name}
            price={item?.price}
            image={item?.photo}
            itemId={item?._id}
            quantity={item?.count}
            itemType="services"
          />
        </div>
      ))}
      </div>)}
    </>
  )
}

export default ServicesList