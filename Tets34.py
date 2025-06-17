import requests
from bs4 import BeautifulSoup

# Initialize session
session = requests.Session()
url = "https://jacresults.com/enter-class-xii-2025-student-details"

# First request to get hidden inputs
resp = session.get(url)
soup = BeautifulSoup(resp.text, 'html.parser')

viewstate = soup.find('input', {'id': '__VIEWSTATE'})['value']
viewstategen = soup.find('input', {'id': '__VIEWSTATEGENERATOR'})['value']
eventvalidation = soup.find('input', {'id': '__EVENTVALIDATION'})['value']

# School code
school_code = "11066"

# Result storage for Santosh students
santosh_results = []

# Loop through roll numbers
for i in range(10001, 10800):
    roll = str(i)
    payload = {
        '__VIEWSTATE': viewstate,
        '__VIEWSTATEGENERATOR': viewstategen,
        '__EVENTVALIDATION': eventvalidation,
        'ctl00$ContentPlaceHolder1$txt_code': school_code,
        'ctl00$ContentPlaceHolder1$txt_no': roll,
        'ctl00$ContentPlaceHolder1$ddl_stream': 'SCI',
        'ctl00$ContentPlaceHolder1$btn_submit': 'Submit'
    }

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        res = session.post(url, data=payload, headers=headers)
        result_soup = BeautifulSoup(res.text, 'html.parser')

        name = result_soup.find(id='ContentPlaceHolder1_lblstudentname').text.strip()
        father = result_soup.find(id='ContentPlaceHolder1_lblfather').text.strip()

        # Check if father's name contains or starts with "santosh"
        if 'santosh' in father.lower():
            mother = result_soup.find(id='ContentPlaceHolder1_lblmother').text.strip()
            school = result_soup.find(id='ContentPlaceHolder1_lblschoolname').text.strip()
            total_marks = result_soup.find(id='ContentPlaceHolder1_lbltotal_marks').text.strip()
            result_div = result_soup.find(id='ContentPlaceHolder1_lbl_result').text.strip()

            subjects = []
            for sub in range(1, 7):
                code = result_soup.find(id=f'ContentPlaceHolder1_lblsubcode{sub}')
                theory = result_soup.find(id=f'ContentPlaceHolder1_lbltheory{sub}')
                practical = result_soup.find(id=f'ContentPlaceHolder1_lblpractical{sub}')
                cce = result_soup.find(id=f'ContentPlaceHolder1_lblcce{sub}')
                total = result_soup.find(id=f'ContentPlaceHolder1_lbltotal{sub}')

                if code and total:
                    subjects.append({
                        'subject': code.text.strip(),
                        'theory': theory.text.strip(),
                        'practical': practical.text.strip(),
                        'cce': cce.text.strip(),
                        'total': total.text.strip()
                    })

            santosh_results.append({
                'roll': roll,
                'name': name,
                'father': father,
                'mother': mother,
                'school': school,
                'total_marks': total_marks,
                'division': result_div,
                'subjects': subjects
            })

    except Exception as e:
        print(f"❌ Error for Roll No {roll}: {e}")

# ✅ Print all results of students with father name containing "Santosh"
print("\n🎯 STUDENTS WHOSE FATHER'S NAME CONTAINS 'SANTOSH':\n")
for student in santosh_results:
    print(f"🔢 Roll No      : {student['roll']}")
    print(f"👩 Name         : {student['name']}")
    print(f"👨 Father Name  : {student['father']}")
    print(f"👩 Mother Name  : {student['mother']}")
    print(f"🏫 School       : {student['school']}")
    print(f"📊 Total Marks  : {student['total_marks']}")
    print(f"🎖️ Division     : {student['division']}")
    print(f"📘 Subjects     :")
    for sub in student['subjects']:
        print(f"   📖 {sub['subject']}: Theory={sub['theory']}, Practical={sub['practical']}, CCE={sub['cce']}, Total={sub['total']}")
    print("--------------------------------------------------")
