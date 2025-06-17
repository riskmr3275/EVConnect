import requests
from bs4 import BeautifulSoup

# Session setup
session = requests.Session()
url = "https://jacresults.com/enter-class-x-2025-student-details"

# Get hidden values
response = session.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

viewstate = soup.find('input', {'id': '__VIEWSTATE'})['value']
viewstategen = soup.find('input', {'id': '__VIEWSTATEGENERATOR'})['value']
eventvalidation = soup.find('input', {'id': '__EVENTVALIDATION'})['value']

# Initialize counters
first_div_count = 0
second_div_count = 0
fail_count = 0
total_checked = 0

# Iterate over roll numbers
for i in range(1, 101):
    roll_no = str(i).zfill(4)

    payload = {
        '__VIEWSTATE': viewstate,
        '__VIEWSTATEGENERATOR': viewstategen,
        '__EVENTVALIDATION': eventvalidation,
        'ctl00$ContentPlaceHolder1$txt_code': '24037',
        'ctl00$ContentPlaceHolder1$txt_no': roll_no,
        'ctl00$ContentPlaceHolder1$btn_submit': 'Submit'
    }

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    print(f"\nFetching result for Roll No: {roll_no}")

    response = session.post(url, data=payload, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    try:
        student_name = soup.find(id='ContentPlaceHolder1_lblstudentname').text.strip()
        percentage = soup.find(id='ContentPlaceHolder1_lblpercentage').text.strip()

        # Clean and convert percentage
        percentage = float(percentage.replace('%', '').strip())

        total_checked += 1

        if percentage >= 60:
            first_div_count += 1
        elif percentage >= 45:
            second_div_count += 1
        elif percentage < 33:
            fail_count += 1

        print(f"{student_name} → Percentage: {percentage}%")

    except Exception as e:
        print("Result not found or error occurred.")

# Summary
print("\n--- Summary ---")
print(f"Total Students Checked: {total_checked}")
print(f"First Division (>= 60%): {first_div_count}")
print(f"Second Division (45% to <60%): {second_div_count}")
print(f"Failed (< 33%): {fail_count}")
