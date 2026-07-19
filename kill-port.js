#!/usr/bin/env node

/**
 * Kill-Port Script
 * Automatically kills Node.js processes using ports 8000 (backend) and 5173 (frontend)
 * Safe approach: Only kills processes that match our project patterns
 */

const { execSync } = require('child_process');
const port = process.env.PORT || 8000;

console.log('🔍 Checking for processes on port', port, '...');

try {
  // Find PIDs using the port
  const pids = execSync(`lsof -t -i:${port} 2>/dev/null || fuser ${port}/tcp 2>/dev/null`, { encoding: 'utf-8' }).trim();
  
  if (pids) {
    const pidList = pids.split('\n').filter(Boolean);
    pidList.forEach(pid => {
      try {
        // Check if it's our Node.js process
        const cmd = execSync(`ps -p ${pid} -o comm= 2>/dev/null`, { encoding: 'utf-8' }).trim();
        if (cmd === 'node') {
          console.log(`🛑 Killing orphan process on port ${port}: PID ${pid}`);
          execSync(`kill -9 ${pid} 2>/dev/null`);
        }
      } catch (e) {
        // Process already gone
      }
    });
  } else {
    console.log(`✅ Port ${port} is available`);
  }
} catch (error) {
  console.log(`✅ Port ${port} is available (or lsof not found)`);
}

// Also check for orphan node processes from our project
try {
  const projectPids = execSync(`pgrep -f "node.*server\\.js.*gameku|node.*--watch.*server" 2>/dev/null`, { encoding: 'utf-8' }).trim();
  if (projectPids) {
    const pidList = projectPids.split('\n').filter(Boolean);
    if (pidList.length > 1) {
      console.log('🧹 Cleaning up duplicate backend processes...');
      // Keep the newest, kill the old ones
      const sortedPids = pidList.sort((a, b) => b - a);
      sortedPids.slice(1).forEach(pid => {
        try {
          console.log(`🛑 Killing duplicate process: PID ${pid}`);
          execSync(`kill -9 ${pid} 2>/dev/null`);
        } catch (e) {}
      });
    }
  }
} catch (error) {
  // No duplicate processes
}

process.exit(0);