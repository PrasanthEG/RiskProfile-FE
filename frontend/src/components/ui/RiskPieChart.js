import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6680"]; // Define custom colors

const RiskPieChart = ({ riskData }) => {
  return (
    <PieChart width={400} height={300}>
      <Pie 
        data={riskData} 
        dataKey="count" 
        nameKey="risk_profile_name" 
        fill="#8884d8" 
        label
      >
        {riskData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> // Assign different colors
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default RiskPieChart;
