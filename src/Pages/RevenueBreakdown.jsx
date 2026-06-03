import { useCallback, useEffect, useState } from "react";
import { getRevenueBreakdown } from "../Apis/subsciptionApis/subsciptionApis";
import { Box, CircularProgress, Typography } from "@mui/material";
import FilterBar from "../Components/RevenueBreakdown/FilterBar";
import RevenueTable from "../Components/RevenueBreakdown/RevenueTable";
import PlanBreakdownCard from "../Components/RevenueBreakdown/PlanBreakdownCard";

export default function RevenueBreakdownPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState("paid");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRevenueBreakdown({ year, status });
      if (res?.success) setData(res);
      else setError("Failed to load data.");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [year, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Box sx={{ minHeight: "100vh", background: "#fafafa", p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>
          Revenue Breakdown
        </Typography>
        <Typography sx={{ color: "#888", fontSize: 13, mt: 0.5 }}>
          Monthly revenue grouped by plan
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FilterBar
          year={year}
          status={status}
          onYearChange={setYear}
          onStatusChange={setStatus}
        />
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#e53935" }} />
        </Box>
      )}

      {error && !loading && (
        <Box sx={{ p: 3, background: "#fff5f5", borderRadius: "12px", border: "1px solid #ffcdd2" }}>
          <Typography sx={{ color: "#c62828", fontWeight: 600 }}>{error}</Typography>
        </Box>
      )}

      {!loading && !error && data && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <RevenueTable
            rows={data.rows}
            summary={data.summary}
            plan={null}
            title="All Plans - Monthly Overview"
            year={year}
            status={status}
          />

          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", color: "#777", mt: 0.5 }}>
            Plan Breakdown
          </Typography>

          {["basic", "professional", "advanced"].map((plan) => (
            <PlanBreakdownCard
              key={plan}
              plan={plan}
              rows={data.rows}
              summary={data.summary}
              year={year}
              status={status}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
