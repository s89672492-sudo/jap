# python3 pack.py <id>... ：把 frames/<id>/*.png 合成動態 WebP 到 out/<id>.webp
import sys, glob, os
from PIL import Image
os.makedirs('out', exist_ok=True)
for i in sys.argv[1:]:
    fr = [Image.open(f).convert('RGB') for f in sorted(glob.glob(f'frames/{i}/*.png'))]
    fr[0].save(f'out/{i}.webp', save_all=True, append_images=fr[1:], duration=125, loop=0, quality=60, method=6)
    print(i, len(fr), os.path.getsize(f'out/{i}.webp') // 1024, 'KB')
