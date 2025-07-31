import React from "react";
import CartItem from "./CartItem";
import Arrow from "../../../public/Assets/studio/Arrow";
import StudioCartItem from "./StudioCartItem";
import { useRouter } from "next/navigation";

const StudioList = ({ entityInfo, entityType }) => {

let image;
let title;
let description;
let key;


  if(entityType ==='studio')
  {
  const { _id, studioName, studioDescription, images } = entityInfo;
  image = images[0];
  title=studioName
  description=studioDescription
  key = _id


  }else if(entityType==='freelancer'){
      const {_id, name , description:freelancerDescription, profileImage } = entityInfo;
  image =  profileImage;
  title=name
  description=freelancerDescription
  key = _id
  }

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="mb-4">
      <div
        className="flex justify-start items-center p-2 cursor-pointer"
        onClick={handleBack}
      >
        <p>
          <Arrow />
        </p>
        <p className="ml-3">My Cart</p>
      </div>
      <div>
        <StudioCartItem
          key={key}
          title={title}
          description={description}
          image={image}
        />
      </div>
    </div>
  );
};

export default StudioList;
