import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSales: 0,
    revenue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsResponse, chartResponse] = await Promise.all([
        axios.get('/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/dashboard/chart-data', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsResponse.data);
      setChartData(chartResponse.data.lineData);
      setPieData(chartResponse.data.pieData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="number">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <div className="number">{stats.activeUsers}</div>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <div className="number">{stats.totalSales}</div>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <div className="number">${stats.revenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="card">
          <h3>User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
              <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
