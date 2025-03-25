import { useState, useEffect } from "react";
import axios from "axios";
import RiskPieChart from "./../components/ui/RiskPieChart"; // Adjust the import path if needed
import { PieChart, Pie, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { API_BASE_URL } from "./../config";

const ReportPage = () => {
  const [riskData, setRiskData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [apiCallData, setApiCallData] = useState([]);
  const [preferredCategory, setPreferredCategory] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [riskRes, ratingRes, apiRes, categoryRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/report/risk-classification`),
        axios.get(`${API_BASE_URL}/report/star-ratings`),
        axios.get(`${API_BASE_URL}/report/api-calls`),
        axios.get(`${API_BASE_URL}/report/preferred-category`)
      ]);

      setRiskData(riskRes.data);
      setRatingData(ratingRes.data);
      setApiCallData(apiRes.data);
      setPreferredCategory(categoryRes.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  return (
    <div className="report-container">
      <span align="center"><h1>Reports</h1></span>  <br /><br/>
      <span align="left"><h2>User Risk Classification</h2></span>
      <span align="left">
            {riskData.length > 0 ? (
                <RiskPieChart riskData={riskData} />
            ) : (
                <p>Loading risk data...</p>
            )}
      </span>
        <br/><br/>
        <span align="left"><h2>Star Ratings Provided by Users</h2></span>
      <BarChart width={400} height={300} data={ratingData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rating" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>

      <br/><br/>
      <span align="left"><h2>API Calls (Web vs. Mobile)</h2></span>
      
      <BarChart width={400} height={300} data={apiCallData}>
        <XAxis dataKey="channel" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#ffc658" />
      </BarChart>
      <br/><br/>

     
      <span align="left"><h2> Most Preferred Category </h2></span>
      <BarChart width={400} height={300} data={preferredCategory}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#ffc658" />
      </BarChart>

    </div>
  );
};

export default ReportPage;
