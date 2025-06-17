import requests
from bs4 import BeautifulSoup

# Set up session
session = requests.Session()
url = "https://jacresults.com/enter-class-xii-2025-student-details"

# Initial request to fetch hidden fields
resp = session.get(url)
soup = BeautifulSoup(resp.text, 'html.parser')

viewstate = soup.find('input', {'id': '__VIEWSTATE'})['value']
viewstategen = soup.find('input', {'id': '__VIEWSTATEGENERATOR'})['value']
eventvalidation = soup.find('input', {'id': '__EVENTVALIDATION'})['value']

# School code
school_code = "11066"

# Roll numbers loop
for i in range(10001, 10006):
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

    print(f"\n🔍 Checking Roll No: {roll}")

    try:
        res = session.post(url, data=payload, headers=headers)
        result_soup = BeautifulSoup(res.text, 'html.parser')

        name = result_soup.find(id='ContentPlaceHolder1_lblstudentname').text.strip()
        father = result_soup.find(id='ContentPlaceHolder1_lblfather').text.strip()
        mother = result_soup.find(id='ContentPlaceHolder1_lblmother').text.strip()
        school = result_soup.find(id='ContentPlaceHolder1_lblschoolname').text.strip()
        total_marks = result_soup.find(id='ContentPlaceHolder1_lbltotal_marks').text.strip()
        result_div = result_soup.find(id='ContentPlaceHolder1_lbl_result').text.strip()

        print(f"👩 Name        : {name}")
        print(f"👨 Father Name : {father}")
        print(f"👩 Mother Name : {mother}")
        print(f"🏫 School      : {school}")
        print(f"📊 Total Marks : {total_marks}")
        print(f"🎖️ Division    : {result_div}")
        print("📘 Subjects:")

        # Parse all subjects (upto 6 allowed)
        for sub in range(1, 6 + 1):
            code = result_soup.find(id=f'ContentPlaceHolder1_lblsubcode{sub}')
            theory = result_soup.find(id=f'ContentPlaceHolder1_lbltheory{sub}')
            practical = result_soup.find(id=f'ContentPlaceHolder1_lblpractical{sub}')
            cce = result_soup.find(id=f'ContentPlaceHolder1_lblcce{sub}')
            total = result_soup.find(id=f'ContentPlaceHolder1_lbltotal{sub}')

            if code and total:
                print(f"   📖 {code.text.strip()}: Theory={theory.text.strip()}, Practical={practical.text.strip()}, CCE={cce.text.strip()}, Total={total.text.strip()}")

    except Exception as e:
        print("❌ Error or result not found.")
