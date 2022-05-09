#!/usr/bin/env python

import asyncio
import json
import logging
import websockets

logging.basicConfig()

USERS = set()
USERS_EMAIL = {}
VALUE = 0
TIMESTAMP = 0

def users_event():
    return json.dumps({"type": "users", "count": len(USERS), "user_list": " ".join(list(USERS_EMAIL.values()))})

async def counter(websocket):
    global USERS, TIMESTAMP
    try:
        # Register user
        USERS.add(websocket)
        # Broadcast user event to all users
        websockets.broadcast(USERS, users_event())
        
        # When new message came, broad event to all users
        # TODO: update to broad event to all users except sender
        async for message in websocket:
            event = json.loads(message)
            websockets.broadcast(USERS, message)
            # send log to all users 
            websockets.broadcast(USERS, users_event())
            USERS_EMAIL[websocket.id] = event['userEmail']
    finally:
        # When user lost connection
        USERS.remove(websocket)
        USERS_EMAIL.pop(websocket.id, None)
        # send log to all users
        websockets.broadcast(USERS, users_event())

async def main():
    async with websockets.serve(counter, None, 8765):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())