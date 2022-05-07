from time import sleep
from requests import post
from os import getenv

BASE_URL = getenv("STATE_API_BASE_URL")
ENDPOINTS = {
    'setState' : f"{BASE_URL}/neworder"
}
n = 0
while True:
    n += 1
    message = {"data": {"orderId": n}}

    try:
        response = post(ENDPOINTS.get('setState'), json=message)
    except Exception as e:
        print(e)

    sleep(1)
