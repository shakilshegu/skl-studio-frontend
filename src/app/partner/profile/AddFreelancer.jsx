import FreelancerDetails from '@/partner-pages/freelancer-form/FreelancerDetails'
import React from 'react'

const AddFreelancer = ({ setIsEditing, isEditing }) => {
  return (
    <div>
      <FreelancerDetails setIsEditing={setIsEditing} isEditing={isEditing} />
    </div>
  )
}

export default AddFreelancer