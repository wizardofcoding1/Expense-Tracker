import * as analyticsService from "../service/analytics.service.js";

export async function getSummary(req, res) {
      try {
            const { month, year } = req.query || {};
            const summary = await analyticsService.getMonthlySummary(req.userId, month, year);
            
            return res.status(200).json({
                  success: true,
                  data: summary
            });
      } catch (error) {
            console.error("Get Monthly Summary Error Details:", error);
            return res.status(400).json({
                  success: false,
                  message: error.message
            });
      }
}
