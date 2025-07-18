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
      console.error('Erreur lors du chargement des données du tableau de bord:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return <div className="loading">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="container">

      <h1 className="page-title">Tableau de Bord</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Utilisateurs</h3>
          <div className="number">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <h3>Utilisateurs Actifs</h3>
          <div className="number">{stats.activeUsers}</div>
        </div>
        <div className="stat-card">
          <h3>Total Ventes</h3>
          <div className="number">{stats.totalSales}</div>
        </div>
        <div className="stat-card">
          <h3>Chiffre d'Affaires</h3>
          <div className="number">{stats.revenue.toLocaleString()} €</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="card">
          <h3>Croissance des Utilisateurs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#0066cc" name="Utilisateurs" strokeWidth={2} />
              <Line type="monotone" dataKey="sales" stroke="#28a745" name="Ventes" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Chiffre d'Affaires par Catégorie</h3>
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
        <h3>Chiffre d'Affaires Mensuel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#0066cc" name="Chiffre d'Affaires" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
