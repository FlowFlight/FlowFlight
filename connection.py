
test = """
[
{"ScheduledTakeOff": "14:27", "Priority": 1, "Flight": "L312", "Aircraft": "K8136", "Airline": "LOT"},
{"ScheduledTakeOff": "14:38", "Priority": 1, "Flight": "PL234", "Aircraft": "OM752", "Airline": "Ryanair"},
{"ScheduledTakeOff": "14:57", "Priority": 1, "Flight": "LYG542", "Aircraft": "GB43i", "Airline": "Ryanair"},
{"ScheduledTakeOff": "14:20", "Priority": 2, "Flight": "MN654", "Aircraft": "PL456", "Airline": "Ryanair"},
{"ScheduledTakeOff": "14:25", "Priority": 2, "Flight": "IK542", "Aircraft": "DF543", "Airline": "Ryanair"},
{"ScheduledTakeOff": "14:35", "Priority": 2, "Flight": "P758", "Aircraft": "HN01j", "Airline": "LOT"},
{"ScheduledTakeOff": "14:40", "Priority": 3, "Flight": "K647", "Aircraft": "47N", "Airline": "LOT"},
{"ScheduledTakeOff": "14:30", "Priority": 0, "Flight": "K183", "Aircraft": "P478n", "Airline": "Ryanair"},
{"ScheduledTakeOff": "15:05", "Priority": 0, "Flight": "PO98", "Aircraft": "HJK86", "Airline": "LOT"},
{"ScheduledTakeOff": "15:15", "Priority": 0, "Flight": "IY743", "Aircraft": "PHJ643", "Airline": "Ryanair"}
]
"""
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {"message": test}
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)