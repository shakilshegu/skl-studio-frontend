import LocationsIcon from "../../../public/Assets/studio/LocationsIcon";

const StudioDetails = ({ entityInfo,entityType }) => {

  
  let image;
let title;
let description;
let key;
let place;
  if(entityType ==='studio')
    {
    const { _id, studioName, studioDescription, images ,address} = entityInfo;
    image = images[0];
    title=studioName
    description=studioDescription
    key = _id
    place = address.city+ " , "+address.state
  
  
    }else if(entityType==='freelancer'){
        const {_id, name , description:freelancerDescription, profileImage,location } = entityInfo;
    image =  profileImage;
    title=name
    description=freelancerDescription
    key = _id
    place=location
    }
  

  
  return (  <div className="border rounded-lg">
    <div className="bg-gray-100 text-center font-semibold text-sm uppercase tracking-wider border-b  rounded-t"> Details</div>
    <div className="p-4">
      <h2 className="text-lg font-semibold">{title}</h2> 
      <div className="flex items-center text-sm text-gray-600">
        <LocationsIcon className="mr-2" />
        <span className="ml-2">{place}</span>
        <span className="ml-3">⭐ 4.5</span>
      </div>
    </div>
  </div>)
}


export default StudioDetails;