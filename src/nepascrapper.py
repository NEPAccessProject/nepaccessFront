import requests

def login_and_download(username, password):
    # Login
    login_url = 'https://example.com/login'
    login_data = {
        'username': username,
        'password': password
    }
    session = requests.Session()
    session.post(login_url, data=login_data)

    # Download PDFs
    pdf_urls = ['https://example.com/pdf1.pdf', 'https://example.com/pdf2.pdf']
    for pdf_url in pdf_urls:
        response = session.get(pdf_url)
        if response.status_code == 200:
            filename = pdf_url.split('/')[-1]
            with open(filename, 'wb') as file:
                file.write(response.content)
                print(f"Downloaded {filename}")
        else:
            print(f"Failed to download {pdf_url}")

# Usage
username = 'your_username'
password = 'your_password'
login_and_download(username, password)