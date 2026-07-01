import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { spawn, execSync } from "child_process";

async function startServer() {
  // Install python dependencies
  try {
    console.log("Installing python dependencies...");
    execSync("python3 -m pip install selenium --break-system-packages || python3 -m pip install selenium", { stdio: "inherit" });
    console.log("Python dependencies installed.");
  } catch (err) {
    console.error("Failed to install python dependencies:", err);
  }

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example core engine deployment endpoint
  app.post("/api/engine/deploy", async (req, res) => {
    const { targetAccount, serviceType, quantity, speed } = req.body;
    
    console.log(`[Engine] Deploying ${quantity} ${serviceType} to ${targetAccount} at ${speed} speed.`);
    
    // Spawn the python script
    const pythonProcess = spawn('python3', ['engine.py', serviceType, targetAccount]);
    
    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`[Python]: ${data.toString()}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(`[Python Error]: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          status: "error",
          message: `Engine failed with code ${code}.`,
          details: errorOutput || output
        });
      }
      
      res.json({ 
        status: "deployed", 
        message: `Engine successfully executed for ${targetAccount}.`,
        details: output
      });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
