import Contractor from '../models/contractorSchema.js';

export const createContractor = async (contractorData) => {
  try {
    const existingContractor = await Contractor.findOne({ docNumber: contractorData.docNumber });

    if (existingContractor) {
      const hasChanges = Object.keys(contractorData).some(
        (key) => String(contractorData[key]) !== String(existingContractor[key])
      );

      if (hasChanges) {
        const updatedContractor = await Contractor.findByIdAndUpdate(
          existingContractor._id,
          contractorData,
          { new: true }
        );
        return updatedContractor;
      }

      return existingContractor;
    }

    const savedContractor = await Contractor.create(contractorData);
    return savedContractor;
  } catch (error) {
    throw error;
  }
};
