#!/bin/bash
echo "Stopping React frontend..."
kill $(lsof -t -i:3000)
