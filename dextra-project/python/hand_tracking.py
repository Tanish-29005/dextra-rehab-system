import cv2
import mediapipe as mp
import numpy as np
import requests
import time

URL = "http://localhost:3001/api/telemetry"

mp_hands = mp.solutions.hands

FINGER_ORDER = ["THUMB","INDEX","MIDDLE","RING","PINKY"]

def send(flex):
    payload = {
        "flexion": int(sum(flex.values())/5),
        "fingers": flex
    }

    try:
        requests.post(URL, json=payload, timeout=0.1)
    except:
        pass

def compute(hand):
    pts = hand.landmark

    def angle(a,b,c):
        v1 = np.array([a.x-b.x,a.y-b.y])
        v2 = np.array([c.x-b.x,c.y-b.y])
        cos = np.dot(v1,v2)/(np.linalg.norm(v1)*np.linalg.norm(v2)+1e-6)
        return np.degrees(np.arccos(np.clip(cos,-1,1)))

    fingers = {
        "THUMB": (2,3,4),
        "INDEX": (5,6,8),
        "MIDDLE": (9,10,12),
        "RING": (13,14,16),
        "PINKY": (17,18,20),
    }

    res = {}

    for f,(m,p,t) in fingers.items():
        a = angle(pts[m],pts[p],pts[t])
        res[f] = int(np.clip((a/180)*100,0,100))

    return res

cap = cv2.VideoCapture(0)

with mp_hands.Hands() as hands:
    last = 0

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        frame = cv2.flip(frame,1)
        rgb = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
        res = hands.process(rgb)

        flex = {f:0 for f in FINGER_ORDER}

        if res.multi_hand_landmarks:
            hand = res.multi_hand_landmarks[0]
            flex = compute(hand)

            mp.solutions.drawing_utils.draw_landmarks(
                frame, hand, mp_hands.HAND_CONNECTIONS
            )

        if time.time() - last > 0.1:
            send(flex)
            last = time.time()

        cv2.imshow("DEXTRA", frame)

        if cv2.waitKey(1) == ord("q"):
            break

cap.release()
cv2.destroyAllWindows()