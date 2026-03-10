import Report from '../models/reportSchema.js';
import Contractor from '../models/contractorSchema.js';

export const getReports = async (req, res, next) => {
  try {
    const { name, paidMonth, paidYear } = req.query;
    const filter = {};

    if (name) {
      const regex = new RegExp(name, 'i');
      const contractors = await Contractor.find({
        $or: [{ names: regex }, { surnames: regex }]
      }).select('_id');

      const contractorIds = contractors.map((c) => c._id);
      filter.contractorId = { $in: contractorIds };
    }

    if (paidMonth) filter.paidMonth = paidMonth;
    if (paidYear) filter.paidYear = Number(paidYear);

    const reports = await Report.find(filter)
      .populate('contractorId', 'names surnames docNumber')
      .populate('supervisorId', 'names surnames email');

    return res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

export const createReport = async (req, res, next) => {
  try {
    const { fileUrl, ...reportData } = req.body;
    const { contractorId, paidMonth, paidYear } = reportData;

    const existingReport = await Report.findOne({
      contractorId,
      paidMonth,
      paidYear
    });

    if (existingReport) {
      if (existingReport.status === 'pending') {
        return res.status(400).json({ message: 'Planilla en proceso, a espera de revisión' });
      }

      if (existingReport.status === 'completed') {
        return res.status(400).json({ message: 'Error, planilla ya registrada' });
      }

      if (existingReport.status === 'error') {
        const updatedReport = await Report.findByIdAndUpdate(
          existingReport._id,
          reportData,
          { new: true }
        );
        return res.status(200).json({ message: 'Datos enviados exitosamente', report: updatedReport });
      }
    }

    const savedReport = await Report.create(reportData);
    return res.status(201).json(savedReport);
  } catch (error) {
    next(error);
  }
};
