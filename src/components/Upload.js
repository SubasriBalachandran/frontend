// Updated Upload.js with history tracking
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

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem("uploadHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Save to localStorage whenever history changes
    localStorage.setItem("uploadHistory", JSON.stringify(history));
  }, [history]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file");

    const formData = new FormData();
    formData.append("excelsheet", file);

    try {
      setLoading(true);
      const uploadRes = await axios.post("http://localhost:5000/api/upload/excel", formData);
      setUploadMsg(uploadRes.data.message);

      const summaryRes = await axios.get("http://localhost:5000/api/analysis/summary");
      setSummary(summaryRes.data.summary);

      const entry = {
        fileName: file.name,
        summary: summaryRes.data.summary,
        timestamp: new Date().toLocaleString(),
      };

      setHistory([entry, ...history]);
    } catch (error) {
      console.error("Error:", error);
      setUploadMsg("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        📤 Upload Excel File
      </Typography>

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
            <Typography variant="h5" gutterBottom>
              📊 Current Upload Summary
            </Typography>
            <pre>{JSON.stringify(summary, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            🕓 Upload History
          </Typography>
          <List>
            {history.map((entry, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`📁 ${entry.fileName}`}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {entry.timestamp}
                        </Typography>
                        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(entry.summary, null, 2)}</pre>
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