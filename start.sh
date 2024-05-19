#!/bin/bash

# Install Python dependencies
pip install -r requirements.txt

# Run Python script in the background
python connection.py &

# Navigate to FlowFlightGUI directory, install npm dependencies, and start the development server
(
  cd FlowFlightGUI || exit
  npm install
  npm run dev
) &

# Wait for all background processes to finish
wait
