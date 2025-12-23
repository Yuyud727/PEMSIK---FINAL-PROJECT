// Utils/hooks/useChart.jsx
import { useQuery } from "@tanstack/react-query";
import { getAllChartData } from "@/Utils/Apis/ChartApi";

export const useChartData = () =>
  useQuery({
    queryKey: ["chart", "all"],
    queryFn: getAllChartData,
    // Tidak perlu select karena API sudah return format yang benar
  });