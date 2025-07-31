import React from "react";
import CartItem from "./CartItem";

const HelpersList = ({ helpers }) => {
  return (
    <>
      {helpers?.length > 0 && (
        <div className="mb-4">
          <h3 className="text-[#872980] text-[14px] font-bold text-center bg-[#FCF3FB] py-1">
            Helpers
          </h3>
          {helpers?.map((item, index) => (
            <div key={item._id}>
              <CartItem
                key={index}
                title={item?.name}
                price={item?.price}
                image={item?.photo}
                itemId={item?._id}
                quantity={item?.count}
                itemType="helpers"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HelpersList;
