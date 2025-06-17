import requests
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

auth_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50dWlkIjozNzUxLCJ1c2VybmFtZSI6IjIzMjA0MDMxMTciLCJpYXQiOjE3NDk3MzQ0OTcsImV4cCI6MTc1NzUxMDQ5N30.aIYEHp_i-oDLiPS8En3GI5aooXfmGyAp8DdAUkTnoRA"

headers = {
    "Authorization": f"Bearer {auth_token}",
    "Content-Type": "application/json"
}

payload = {
    "studentuid": 3751,
    "program": 28
}

result_url = "https://erpapi.manit.ac.in/api/student_result"
register_url = "https://erpapi.manit.ac.in/api/fetch_register"

def safe_print_response(label, response):
    print(f"\n📘 {label} - HTTP {response.status_code}")
    print("Raw response:")
    print(response.text)
    try:
        print("Parsed JSON:")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print("⚠️ Failed to parse JSON:", e)

try:
    # res1 = requests.post(result_url, json=payload, headers=headers, verify=False)
    # safe_print_response("Semester 1 & 2 Results", res1)

    res2 = requests.post(register_url, json=payload, headers=headers, verify=False)
    safe_print_response("3rd Semester Registration Info", res2)

except requests.exceptions.RequestException as e:
    print("❌ Request failed:", e)
