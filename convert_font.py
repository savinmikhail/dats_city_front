import os
import json
import requests
from fontTools.ttLib import TTFont
from pathlib import Path

def download_font():
    url = "https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf"
    response = requests.get(url)
    
    with open("Roboto-Regular.ttf", "wb") as f:
        f.write(response.content)

def convert_font():
    # Load the TTF font
    font = TTFont("Roboto-Regular.ttf")
    
    # Create a dictionary to store the font data
    font_data = {
        "glyphs": {},
        "familyName": "Roboto",
        "ascender": font["OS/2"].sTypoAscender,
        "descender": font["OS/2"].sTypoDescender,
        "underlinePosition": font["post"].underlinePosition,
        "underlineThickness": font["post"].underlineThickness,
        "boundingBox": {"yMin": font["head"].yMin, "xMin": font["head"].xMin,
                       "yMax": font["head"].yMax, "xMax": font["head"].xMax},
        "resolution": 1000,
        "original_font_information": dict(font["name"].getName(nameID=1, platformID=1, platEncID=0, langID=0) or ""),
    }

    # Get the cmap
    cmap = font.getBestCmap()
    
    # Process each glyph
    for unicode_val, glyph_name in cmap.items():
        if font["glyf"][glyph_name].numberOfContours > 0:  # Only process non-empty glyphs
            glyph = font["glyf"][glyph_name]
            font_data["glyphs"][chr(unicode_val)] = {
                "ha": font["hmtx"][glyph_name][0],
                "x_min": glyph.xMin if hasattr(glyph, "xMin") else 0,
                "x_max": glyph.xMax if hasattr(glyph, "xMax") else 0,
                "o": "M" + " L".join(f"{x},{y}" for x, y in zip(
                    glyph.coordinates[0::2] if hasattr(glyph, "coordinates") else [],
                    glyph.coordinates[1::2] if hasattr(glyph, "coordinates") else []
                ))
            }

    # Save the converted font
    os.makedirs("public/fonts", exist_ok=True)
    with open("public/fonts/Roboto_Regular.json", "w", encoding="utf-8") as f:
        json.dump(font_data, f, ensure_ascii=False)

    # Clean up
    os.remove("Roboto-Regular.ttf")

if __name__ == "__main__":
    download_font()
    convert_font()
    print("Font converted successfully!") 