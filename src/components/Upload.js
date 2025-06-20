import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Input,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch upload history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/upload/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data.uploads || []);
      } catch (error) {
        console.error("Failed to fetch upload history:", error);
      }
    };

    fetchHistory();
  }, [token]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file");

    const formData = new FormData();
    formData.append("excelsheet", file);

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/upload/excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { message, summary, data: parsedData, columns: parsedColumns } = res.data;
      setUploadMsg(message);
      setSummary(summary);

      navigate("/chart", { state: { data: parsedData, columns: parsedColumns } });

      // Refresh history after upload
      const updated = await axios.get("http://localhost:5000/api/upload/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(updated.data.uploads || []);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadMsg("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (entry) => {
    if (entry.rows && entry.summary?.columns) {
      navigate("/chart", { state: { data: entry.rows, columns: entry.summary.columns } });
    } else {
      alert("No data available for this file.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>📤 Upload Excel File</Typography>

      <Input
        type="file"
        inputProps={{ accept: ".xlsx,.xls" }}
        onChange={handleFileChange}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        startIcon={<UploadFileIcon />}
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
      </Button>

      {uploadMsg && (
        <Box mt={2}>
          <Alert severity={uploadMsg === "Upload failed" ? "error" : "success"}>
            {uploadMsg}
          </Alert>
        </Box>
      )}

      {summary && (
        <Card sx={{ mt: 4, backgroundColor: "#f5f5f5" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>📊 Upload Summary</Typography>
            <pre>{JSON.stringify(summary, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>🕓 Upload History</Typography>
          <List>
            {history.map((entry, index) => (
              <React.Fragment key={entry._id || index}>
                <ListItem button onClick={() => handleHistoryClick(entry)}>
                  <ListItemText
                    primary={`📁 ${entry.fileName}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {new Date(entry.uploadedAt).toLocaleString()}
                        </Typography>
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                          {JSON.stringify(entry.summary, null, 2)}
                        </pre>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default Upload;
