import httpx
import asyncio

async def run():
    async with httpx.AsyncClient() as c:
        try:
            r = await c.get('https://musicbrainz.org/ws/2/recording/?query=recording:believer%20AND%20artist:imagine%20dragons&fmt=json', headers={'User-Agent': 'BPM-API-Backend/1.0'})
            data = r.json()
            ids = [rec['id'] for rec in data.get('recordings', [])]
            print(f"Found IDs: {ids[:5]}")
            for mbid in ids[:5]:
                print(f"Trying MBID {mbid}")
                r2 = await c.get(f'https://acousticbrainz.org/api/v1/{mbid}/low-level')
                if r2.status_code == 200:
                    ab_data = r2.json()
                    bpm = ab_data.get('rhythm', {}).get('bpm')
                    key = ab_data.get('tonal', {}).get('key_key')
                    scale = ab_data.get('tonal', {}).get('key_scale')
                    ts = ab_data.get('rhythm', {}).get('beats_count')
                    print(f"Data found! BPM: {bpm}, Key: {key} {scale}")
                    break
                else:
                    print(f"AcousticBrainz error: {r2.status_code}")
        except Exception as e:
            print(f"Error: {e}")

asyncio.run(run())
