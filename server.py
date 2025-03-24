import asyncio
import websockets
import json

async def handler(conn):
    try:
        await conn.send(json.dumps({'id': conn.id.hex}))
        while True:
                s = await conn.recv()
                msg = json.loads(s)
                msg['id'] = conn.id.hex
                websockets.asyncio.server.broadcast(server.connections, json.dumps(msg))
    except websockets.ConnectionClosed:
        pass

async def main():
    global server
    server = await websockets.serve(handler, "localhost", 8765)
    await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())
