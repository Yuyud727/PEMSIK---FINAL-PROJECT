// Utils/Apis/ChartApi.jsx
import supabase from "@/Utils/SupabaseClient";

export const getAllChartData = async () => {
  // Fetch semua data chart secara parallel
  const [
    studentsResult,
    genderRatioResult,
    registrationsResult,
    gradeDistributionResult,
    lecturerRanksResult,
  ] = await Promise.all([
    supabase.from("chart_students").select("*").order("id"),
    supabase.from("chart_gender_ratio").select("*").order("id"),
    supabase.from("chart_registrations").select("*").order("year"),
    supabase.from("chart_grade_distribution").select("*").order("id"),
    supabase.from("chart_lecturer_ranks").select("*").order("id"),
  ]);

  // Check for errors
  if (studentsResult.error) throw studentsResult.error;
  if (genderRatioResult.error) throw genderRatioResult.error;
  if (registrationsResult.error) throw registrationsResult.error;
  if (gradeDistributionResult.error) throw gradeDistributionResult.error;
  if (lecturerRanksResult.error) throw lecturerRanksResult.error;

  return {
    students: studentsResult.data,
    genderRatio: genderRatioResult.data,
    registrations: registrationsResult.data,
    gradeDistribution: gradeDistributionResult.data,
    lecturerRanks: lecturerRanksResult.data,
  };
};