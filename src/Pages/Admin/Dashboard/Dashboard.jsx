import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useChartData } from "@/Utils/hooks/useChart";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8dd1e1"];

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <div className="font-semibold mb-3">{title}</div>
    {/* Tambahkan min-height untuk menghindari warning */}
    <div style={{ width: "100%", height: 320, minHeight: 320 }}>
      {children}
    </div>
  </div>
);

const Dashboard = () => {
  const { data, isLoading, isError, error } = useChartData();

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        <p className="text-xl mb-2">❌ Gagal memuat data chart</p>
        <p>{error?.message || "Unknown error"}</p>
      </div>
    );
  }

  const {
    students = [],
    genderRatio = [],
    registrations = [],
    gradeDistribution = [],
    lecturerRanks = [],
  } = data || {};

  return (
    <div className="p-6 space-y-6">
      <div className="text-2xl font-bold">Dashboard</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BarChart: Mahasiswa per Fakultas */}
        <ChartCard title="Mahasiswa per Fakultas (BarChart)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={students}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="faculty" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* PieChart: Rasio Gender */}
        <ChartCard title="Rasio Gender Mahasiswa (PieChart)">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderRatio}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                outerRadius={95}
                label
              >
                {genderRatio.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* LineChart: Tren Registrasi */}
        <ChartCard title="Tren Pendaftaran per Tahun (LineChart)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#00C49F" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* RadarChart: Distribusi Nilai */}
        <ChartCard title="Distribusi Nilai per Jurusan (RadarChart)">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={gradeDistribution} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Tooltip />
              <Legend />
              <Radar name="A" dataKey="A" stroke="#0088FE" fill="#0088FE" fillOpacity={0.35} />
              <Radar name="B" dataKey="B" stroke="#00C49F" fill="#00C49F" fillOpacity={0.25} />
              <Radar name="C" dataKey="C" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* AreaChart: Pangkat Dosen */}
        <ChartCard title="Pangkat Dosen (AreaChart)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lecturerRanks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rank" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="count" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;