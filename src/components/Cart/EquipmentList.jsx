import CartItem from './CartItem';

const EquipmentList = ({ equipments }) => {
  // const equipments = cartItems?.equipments;
  console.log(equipments,"this equpmets");
  
  return (
    <>
      {equipments?.length > 0 && (

        <div className="mb-4">
          <h3 className="text-[#872980] text-[14px] font-bold text-center bg-[#FCF3FB] py-1">Equipment</h3>
          {equipments.map((item, index) => (
            <CartItem
              key={index}
              title={item?.name}
              price={item?.price}
              image={item?.photo}
              itemId={item?._id}
              quantity={item?.count}
              itemType="equipments"
            />
          ))}
        </div>
      )}
    </>
  );
};

export default EquipmentList;
