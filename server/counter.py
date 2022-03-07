#!/usr/bin/env python

import asyncio
import json
import logging
import websockets

logging.basicConfig()

USERS = set()

VALUE = 0
TIMESTAMP = 0
def pause_event():
    return json.dumps({"type": "pause", "value": 0})

def play_event():
    return json.dumps({"type": "play", "value": 0})

def jump_event(timestamp):
    return json.dumps({"type": "jump", "value": timestamp})

def rewind_event(seconds):
    return json.dumps({"type": "rewind", "value": seconds})

def load_event(video_id):
    return json.dumps({"type": "load", "value": video_id})



def users_event():
    return json.dumps({"type": "users", "count": len(USERS)})

# def value_event():
#     return json.dumps({"type": "value", "value": VALUE})

async def counter(websocket):
    global USERS, TIMESTAMP
    try:
        # Register user
        USERS.add(websocket)
        websockets.broadcast(USERS, users_event())
        # Send current state to user
        # Manage state changes
        async for message in websocket:
            event = json.loads(message)
            if event["action"] == "pause":
                websockets.broadcast(USERS, pause_event())
            elif event["action"] == "play":
                websockets.broadcast(USERS, play_event())
            elif event["action"] == "jump":
                websockets.broadcast(USERS, jump_event(event["timestamp"]))
                TIMESTAMP = int(event["timestamp"])
            elif event["action"] == "rewind":
                TIMESTAMP -= 30
                websockets.broadcast(USERS, rewind_event(TIMESTAMP))
            else:
                logging.error("unsupported event: %s", event)
    finally:
        # Unregister user
        USERS.remove(websocket)
        websockets.broadcast(USERS, users_event())

async def main():
    async with websockets.serve(counter, None, 8765):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())